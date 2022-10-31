/* eslint-disable no-console */
import AWS from 'aws-sdk';
import { Plugin, Context } from '@nuxt/types';
import * as rootTypes from '@/store/types/rootType';
import * as logReceiveTypes from '@/store/types/logReceiveType';
import * as logReceiveAdapter from '@/store/types/adapters/logReceiveAdapter';
import { Formatter } from '@/utils/Formatter';

declare module 'vue/types/vue' {
  interface Vue {
    $mediaDevices: MediaDevices;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $mediaDevices: MediaDevices;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $mediaDevices: MediaDevices;
  }
}

export type MediaStreamResultType = {
  isAllow: boolean;
  isEnableVideo: boolean;
  isEnableAudio: boolean;
  mediaStream: MediaStream | null;
};

export type MediaDeviceInfoResultType = {
  success: boolean;
  videoSuccess: boolean;
  audioSuccess: boolean;
  videoInputs: MediaDeviceInfo[];
  audioInputs: MediaDeviceInfo[];
}

/**
 * このプラグインの中で使用するユーティリティです
 *
 * @class
 */
class Utils
{
  /**
   * constructor
   */
  constructor(
    private context: Context,
  ) {}

  /**
   * ログをサーバに保存します
   *
   * @param {logReceiveAdapter.LogReceiveAdapter} log
   */
  public saveLog(log: logReceiveAdapter.LogReceiveAdapter): void {
    const startup = this.context.store.getters[rootTypes.GETTER_STARTUP];

    if (startup.isDebug == null) {
      return;
    }

    this.context.store.dispatch(logReceiveTypes.ACTION_POST_LOG_RECEIVE, log);
  }

  /**
   * エラーログをサーバに保存します
   *
   * @param {{
   *          message: string,
   *          error: Error | any | null,
   *          args: Arguments,
   *        }} data
   */
  public saveErrorLog(data: {message: string, error: any | null, args: any/*Arguments*/, }): void {
    const startup = this.context.store.getters[rootTypes.GETTER_STARTUP];

    if (!startup.isDebug) {
      return;
    }

    if (startup.isDebug >= 2) {
      const details: any = {
        message: data.message,
        args: [].slice.call(data.args),
        userAgent: window.navigator.userAgent,
        error: {
          name: '',
          message: '',
          errorMessage: '',
        } as any,
        unknownError: null as any,
      }
      if (data.error instanceof Error) {
        details.error = {
          name: data.error.name,
          message: data.error.message,
          errorMessage: data.error.toString(),
        }
      } else {
        try {
          details.unknownError = { ...data.error };
        } catch (e) {
          details.unknownError = '<unknown>';
        }
      }

      return this.saveLog({
        type: logReceiveAdapter.LogReceiveType.ERROR,
        path: 'front/plugins/global/mediaDevices.ts',
        module: 'front-gui',
        location: 'error',
        details: JSON.stringify(details).slice(0, logReceiveAdapter.DETAILS_MAX_LENGTH) || '<<empty>>',
        timestamp: Formatter.date('yyyy-MM-dd hh:mm:ss', new Date()),
      });
    }
  }
}

class Polyfill
{
  constructor(
    private context: Context,
    private utils: Utils,
  ) {
  }

  /**
   * メディアストリーム取得のpolyfill
   *
   * @param {any} constraints
   * @return {Promise<any>}
   */
  public getUserMedia(constraints: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const args:any = [constraints];
      try {
        const navigator: any = window.navigator;
        const mediaDevices: {getUserMedia(c:any):Promise<any>} =
          navigator.mediaDevices
          || (
            (navigator.mozGetUserMedia || navigator.webkitGetUserMedia)
              ? {
                getUserMedia(c:any): Promise<any> {
                  return new Promise((y, n) => {
                    (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, c, y, n);
                  });
                },
              }
              : null
          );
        mediaDevices.getUserMedia(constraints)
          .then(mediaStream => {
            console.log('[LOG INFO] : camera / mike success!', mediaStream);
            resolve(mediaStream);
          })
          .catch(err => {
            // console.error('[LOG ERROR] : camera / mike permission denied', err);
            this.utils.saveErrorLog({
              message: 'navigator.mediaDevices.getUserMedia()メソッドでエラーが発生しました。',
              error: err,
              args: args,
            });
            reject();
          });
      } catch (e) {
        const navigator: any = window.navigator;
        const getUserMedia: any = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (getUserMedia) {
          getUserMedia.call(
            navigator,
            constraints,
            (mediaStream:any) => {
              resolve(mediaStream);
            },
            (err:any) => {
              this.utils.saveErrorLog({
                message: 'navigator.getUserMedia()メソッドでエラーが発生しました。',
                error: err,
                args: args,
              });
              reject();
            });
        } else {
          this.utils.saveErrorLog({
            message: 'navigator.getUserMedia()メソッドが存在しませんでした。',
            error: e,
            args: args,
          });
          reject();
        }
      }
    });
  }

  /**
   * getUserMedia()で取得したMediaStreamを解放するためのメソッド
   *
   * このメソッドはgetUserMedia()と必ずしも対で呼び出す必要はないとは思うが、
   * 正直わからない。
   *
   * @param {MediaStream | null} mediaStream
   */
  public releaseUserMedia(mediaStream: MediaStream | null) {
    if (!mediaStream) {
      return
    }

    mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop()
    })
  }

  /**
   * メディアデバイスを列挙します
   *
   * @return {Promise<MediaDeviceInfo>}
   * @see https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/enumerateDevices
   */
  public enumerateDevices(): Promise<MediaDeviceInfo[]> {
    if (!window.navigator.mediaDevices) {
      return Promise.reject(new Error('navigator.mediaDevicesがありません。'))
    }
    if (!window.navigator.mediaDevices.enumerateDevices) {
      return Promise.reject(new Error('navigator.mediaDevices.enumerateDevicesがありません。'))
    }

    return new Promise((resolve, reject) => {
      // TODO: safariでは、mediaDevices.enumerateDevices()をコールする前にmediaDevices.getUserMedia()を実行しておく必要がある
      // ↓ の「セキュリティ的な関係で、アクティブなメディアストリームが存在するか、メディアデバイスへの継続的な権限をユーザが付与しない限り、」云々のことだと思う
      // @see https://developer.mozilla.org/ja/docs/Web/API/MediaDeviceInfo
      let mediaStream: MediaStream | null = null;
      this.getUserMedia({video:true, audio:true})
        .then((ms: MediaStream) => {
          mediaStream = ms
        })
        .finally(() => {
          window.navigator.mediaDevices.enumerateDevices()
            .then(resolve)
            .catch(reject)
            .finally(() => {
              this.releaseUserMedia(mediaStream)
              mediaStream = null
            })
        })
    })
  }
}
/**
 *
 *
 * @class
 */
class Storage
{
  private devices: MediaDeviceInfo[] = [];

  constructor(
    private context: Context,
    private utils: Utils,
  ) {
  }

  /**
   * 入出力メディアデバイスの情報を設定します
   *
   * @param {MediaDeviceInfo[]}
   */
  public setDevices(devices: MediaDeviceInfo[]) {
    this.devices = devices
  }

  /**
   * カレントなデバイスの情報を取得します
   *
   * @return {MediaDeviceInfo | null}
   */
  public getCurrentVideoDeviceInfo(): MediaDeviceInfo | null {
    const currentVideoDeviceId = this.getCurrentVideoDeviceId()
    if (currentVideoDeviceId == null) {
      return null;
    }
    const devices = this.devices;
    if (devices.length == 0) {
      return null
    }

    for (let i = 0; i < devices.length; i ++) {
      const v = devices[i];
      if (v.deviceId == currentVideoDeviceId) {
        return v;
      }
    }
    return null;
  }

  /**
   * カレントなデバイスIDを取得します
   *
   * @return {string | null}
   */
  public getCurrentVideoDeviceId(): string | null {
    try {
      return window.localStorage.getItem('currentVideoDeviceId') || null
    } catch (e) {
      return null
    }
  }

  /**
   * カレントなデバイスIDを設定します
   *
   * @param {string | null} currentVideoDeviceId
   */
  public setCurrentVideoDeviceId(currentVideoDeviceId: string | null) {
    try {
      if (currentVideoDeviceId == '' || currentVideoDeviceId == null) {
        window.localStorage.removeItem('currentVideoDeviceId')
      } else { 
        window.localStorage.setItem('currentVideoDeviceId', currentVideoDeviceId)
      }
    } catch (e) {
    }
  }

  /**
   * $mediaDevices.getMediaStream()のconstraintsを生成します
   *
   * @param {{
   *          pc: object;
   *          sp: object;
   *        }} params
   * @return {object}
   */
  public makeMediaStreamConstraints(params: {pc: object, sp: object}): object {
    const constraints = {
      //frameRate: {
      //  min: 30,
      //  ideal: 60,
      //},
      facingMode: 'user',
    };

    const currentVideoDeviceId = this.getCurrentVideoDeviceId()
    // @ts-ignore
    const result = this.context.$ua.isFromPc()
      ? Object.assign({}, constraints, (currentVideoDeviceId ? {deviceId: currentVideoDeviceId} : {}), params.pc)
      : Object.assign({}, constraints, params.sp)

    console.log(result)
    return result
  }
}

type CameraMediaStreamCache = {
  args: any[];
  result: MediaStreamResultType;
}

export type MediaStreamHandler = {
  onCameraMediaStreamCreated?: (mediaStreamResult: MediaStreamResultType) => Promise<boolean>;
  onCameraMediaStreamReset?: (mediaStreamResult: MediaStreamResultType) => Promise<boolean>;
}

/**
 * メディアデバイス達
 *
 * @class
 */
class MediaDevices
{
  public constructor(
    private context: Context,
    private utils: Utils,
    private polyfill: Polyfill,
    public storage: Storage,
  ) {
  }

  /** @var フロント/リアカメラの生成に必要な引数/戻り値のキャッシュを保持する. */
  private cacheMap: {
    [key: string]: CameraMediaStreamCache | null,
  } = {
    front: null,
    rear: null,
  };
  private handlers: MediaStreamHandler[] = [];

  /**
   * フロントカメラのメディアストリームを取得します
   *
   * @param {boolean} videoFlg
   * @param {boolean} audioFlg
   * @return {Promise<MediaStreamResultType>}
   */
  public createFrontCameraMediaStream(videoFlg: boolean, audioFlg: boolean): Promise<MediaStreamResultType> {
    return this.createCameraMediaStream('front', videoFlg, audioFlg)
  }

  /**
   * リアカメラのメディアストリームを取得します
   *
   * @param {boolean} videoFlg
   * @param {boolean} audioFlg
   * @return {Promise<MediaStreamResultType>}
   */
  public createRearCameraMediaStream(videoFlg: boolean, audioFlg: boolean): Promise<MediaStreamResultType> {
    return this.createCameraMediaStream('rear', videoFlg, audioFlg)
  }

  /**
   * カメラのメディアストリームを取得します
   *
   * @param {string} cameraType 'front' or 'rear'
   * @param {boolean} videoFlg
   * @param {boolean} audioFlg
   * @return {Promise<MediaStreamResultType>}
   */
  private createCameraMediaStream(cameraType: string, videoFlg: boolean, audioFlg: boolean): Promise<MediaStreamResultType> {
    const args = [].slice.call(arguments, 0)

    const cache = this.cacheMap[cameraType]
    if (cache) {
      if (cache!.result.mediaStream) {
        this.doMediaStreamHandler('onCameraMediaStreamCreated', [cache!.result])
        return Promise.resolve(cache!.result)
      }
    }
    this.releaseCameraMediaStream()

    return new Promise((resolve, reject) => {

      const facingMode = cameraType === 'front'
        ? 'user'
        : 'environment'

      const constraints = this.storage.makeMediaStreamConstraints({
        pc: {},
        sp: {facingMode: facingMode},
      })
      this.getMediaStream(videoFlg, audioFlg, constraints)
        .then((result: MediaStreamResultType) => {
          this.cacheMap[cameraType] = {
            args: args,
            result: result,
          }
          this.doMediaStreamHandler('onCameraMediaStreamCreated', [result])
          resolve(result)
        })
        .catch((e: any) => {
          reject(e)
        })
    })
  }

  /**
   * カメラのメディアストリームを取得します
   *
   * @return {Promise<MediaStreamResultType>}
   */
  public getCameraMediaStream(): MediaStreamResultType | null {
    const found = Object.values(this.cacheMap).find((cache) => cache)
    if (!found) {
      return null
    }
    return found.result
  }

  /**
   * カメラのメディアストリームを解放します
   */
  public releaseCameraMediaStream() {
    Object.values(this.cacheMap).forEach((cache) => {
      if (cache && cache!.result.mediaStream) {
        this.releaseMediaStream(cache!.result.mediaStream!)
      }
    })
    this.cacheMap = {}
  }

  /**
   * カメラのメディアストリームをリセットします
   */
  public resetCameraMediaStream(): Promise<MediaStreamResultType> {
    const found = Object.values(this.cacheMap).find((cache) => cache)
    if (!found) {
      return Promise.reject(new Error(''))
    }

    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.createCameraMediaStream.apply(this, found.args)
        .then((result: MediaStreamResultType) => {
          this.doMediaStreamHandler('onCameraMediaStreamReset', [result])
          resolve(result)
        })
        .catch((e: any) => {
          reject(e)
        })
    })
  }

  /**
   * ハンドラを登録します
   *
   * @param {MediaStreamHandler} handler
   */
  public addMediaStreamHandler(handler: MediaStreamHandler) {
    // 多重登録できないようにする
    this.handlers = this.handlers.filter(v => v != handler)

    this.handlers.push(handler)
  }

  /**
   * ハンドラを削除します
   *
   * @param {MediaStreamHandler} handler
   */
  public removeMediaStreamHandler(handler: MediaStreamHandler) {
    this.handlers = this.handlers.filter(v => v != handler)
  }

  /**
   * ハンドラを実行します
   *
   * @param {string} name
   * @param {any[]} args
   */
  private doMediaStreamHandler(name: string, args: any[]) {
    const promises = this.handlers
      // @ts-ignore
      .filter((v: MediaStreamHandler) => !!v[name])
      // @ts-ignore
      .map((v: MediaStreamHandler) => v[name]!.apply(v[name]!, args))
    return Promise.all(promises)
  }

  /**
   * メディアストリームを取得します
   *
   * @param {boolean} videoFlg
   * @param {boolean} audioFlg
   * @param {{
   *           // MDNを参考にしてください
   *        }}       constraints
   * @return {MediaStreamResultType}
   * @see https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia
   * @see srv/services/proctor/application/checker/js/index.js
   */
  private getMediaStream(videoFlg: boolean, audioFlg: boolean, constraints: object): Promise<MediaStreamResultType> {
    return new Promise((resolve) => {
      const resolution: (object | boolean) = videoFlg
        ? (constraints || true)
        : false;

      const getVideo = () => this.polyfill.getUserMedia({ video: resolution });
      const getAudio = () => this.polyfill.getUserMedia({ audio: true });
      const getMedia = () => this.polyfill.getUserMedia({ video: resolution, audio: true });
      const resolveMediaStream = (result: { isEnableVideo: boolean, isEnableAudio: boolean }) => (mediaStream: any) => resolve({
        isAllow: true,
        isEnableVideo: result.isEnableVideo,
        isEnableAudio: result.isEnableAudio,
        mediaStream
      });
      const rejectMediaStream = (result: { isEnableVideo: boolean, isEnableAudio: boolean }) => () => resolve({
        isAllow: true,
        isEnableVideo: result.isEnableVideo,
        isEnableAudio: result.isEnableAudio,
        mediaStream: null,
      });
      const reject = () => resolve({
        isAllow: false,
        isEnableVideo: false,
        isEnableAudio: false,
        mediaStream: null,
      });
      if (videoFlg && audioFlg) {
        // Androidはこれじゃないとカメラの切り替え不能
        if(/Android/i.test(navigator.userAgent)) {
          getMedia()
            .then(resolveMediaStream({ isEnableVideo: true, isEnableAudio: true }))
            .catch(reject);
        } else {
          getVideo()
            .then(() => getAudio()
              .then(() => getMedia()
                .then(resolveMediaStream({isEnableVideo: true, isEnableAudio: true}))
                .catch(reject))
              .catch(rejectMediaStream({isEnableVideo: true, isEnableAudio: false})))
            .catch(() => getAudio()
              .then(rejectMediaStream({isEnableVideo: false, isEnableAudio: true}))
              .catch(reject));
        }
      } else if (videoFlg) {
        getVideo()
          .then(resolveMediaStream({ isEnableVideo: true, isEnableAudio: false }))
          .catch(reject);
      } else if (audioFlg) {
        getAudio()
          .then(resolveMediaStream({ isEnableVideo: false, isEnableAudio: true }))
          .catch(reject);
      }
    });
  }

  /**
   * メディアストリームを開放します
   *
   * @param {MediaStreamResultType | MediaStream | null} unknownObject
   */
  private releaseMediaStream(unknownObject: MediaStreamResultType | MediaStream | null) {
    if (unknownObject == null) {
      return;
    }

    if ((unknownObject as any).mediaStream) {
      return this.polyfill.releaseUserMedia((unknownObject as MediaStreamResultType).mediaStream)
    }

    return this.polyfill.releaseUserMedia(unknownObject as MediaStream)
  }

  /**
   * メディアデバイスを列挙してチェックします
   *
   * @return {Promise<MediaDeviceInfoResultType>}
   */
  public getDeviceInfoList(): Promise<MediaDeviceInfoResultType> {
    return new Promise((resolve, reject) => {
      this.polyfill.enumerateDevices()
        .then((devices: MediaDeviceInfo[]) => {
          this.storage.setDevices(devices);

          const inputs:{[key: string]: MediaDeviceInfo[]} = {}
          let videoInputs: MediaDeviceInfo[]
          let audioInputs: MediaDeviceInfo[]
          let result: MediaDeviceInfoResultType

          devices.forEach((v) => {
            if (!v.deviceId || !v.label) {
              return;
            }

            if (!inputs[v.kind]) {
              inputs[v.kind] = [];
            }
            inputs[v.kind].push(v);
          });
          videoInputs = inputs['videoinput'] || []
          videoInputs.sort((l, r) => { return l.label.localeCompare(r.label)})
          audioInputs = inputs['audioinput'] || []
          audioInputs.sort((l, r) => { return l.label.localeCompare(r.label)})

          result = {
            success: ((videoInputs.length > 0) && (audioInputs.length > 0)),
            videoSuccess: (videoInputs.length > 0),
            audioSuccess: (audioInputs.length > 0),
            videoInputs: videoInputs,
            audioInputs: audioInputs,
          };
          console.log(result)

          resolve(result)
        })
        .catch((e) => {
          var result = {
            success: false,
            videoSuccess: false,
            audioSuccess: false,
            videoInputs: [],
            audioInputs: [],
          };
          console.log(result)

          resolve(result)
        })
    })
  }
}


/**
 * This file demonstrates the process of creating a KVS Signaling Channel.
 */
const channelPlugin: Plugin = (context: Context, inject) => {
  // ユーティリティ
  const utils = new Utils(context)
  const polyfill = new Polyfill(context, utils)
  const storage = new Storage(context, utils)
  const mediaDevices =  new MediaDevices(context, utils, polyfill, storage)

  inject('mediaDevices', mediaDevices);
};

export default channelPlugin;
