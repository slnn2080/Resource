/* eslint-disable prefer-const */
import AWS from 'aws-sdk';
import { Plugin, Context } from '@nuxt/types';
declare const MediaRecorder: any;
import * as rootTypes from '@/store/types/rootType';
import * as testerPageTypes from '@/store/types/testerPageType';
import {
  TesterRecordingAdapter,
  TesterRecordingRecoveryAdapter,
  TesterRecordingRecoveryRequestType,
} from '@/store/types/adapters/testerRecordingAdapter';
import { Formatter } from '@/utils/Formatter';
import { PromiseUtils } from '@/utils/PromiseUtils';

declare module 'vue/types/vue' {
  interface Vue {
    $startUploader(
      stream: MediaStream,
      eventHandler: UploaderEventHandler,
      options: optionsType
    ): Promise<boolean>;
    $stopUploader(): Promise<boolean>;
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $startUploader(
      stream: MediaStream,
      eventHandler: UploaderEventHandler,
      options: optionsType
    ): Promise<boolean>;
    $stopUploader(): Promise<boolean>;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $startUploader(
      stream: MediaStream,
      eventHandler: UploaderEventHandler,
      options: optionsType
    ): Promise<boolean>;
    $stopUploader(): Promise<boolean>;
  }
}

type s3ConfigsType = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  bucket: string;
  key: string;
  uploadId: string;
};

type optionsType = {
  mimeType?: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
  timeslice?: number;
  videoRecordingPreference?: number;
  voiceQualityPreference?: number;
};

export type UploaderEvent = {
  error?: Error;
  errorString?: string;
}

export type UploaderEventHandler = {
  initializeError: (event: UploaderEvent) => Promise<boolean>;
  uploadError: (event: UploaderEvent) => Promise<boolean>;
};

type uploadStatusType = {
  PartNumber: number;
  Completed: boolean;
  Errored: boolean;
};

// ---------

type QueueItem = {
  flag: boolean,
  partNumber: number,
  totalSize: number,
  fn: Function
}

type FnType = (blob: Blob, partNumber: number) => Promise<void>

// ---------


const logPath = '/proctor/front/plugins/s3/upload.ts';
const debugLevel = 0;
let loggerContext: Context | null = null;
let loggerStartTime : Date;

function logging(isDebug: number, params: any) {
  try {
    const context: any = loggerContext as Context;
    const _isDebug = context.app.store.getters[rootTypes.GETTER_STARTUP].isDebug;
    if (_isDebug >= isDebug) {
      const endTime = new Date();
      params['type'] = 5;
      params['path'] = logPath;
      params['timestamp'] =  Formatter.date('yyyy-MM-dd hh:mm:ss', endTime);
      params['tag1'] = endTime.getTime() - loggerStartTime.getTime();
      context.app.$axios.$post('/api/v1/log_receive.php', params);
    }
  } catch (e) {
    // このエラーは握りつぶす
  }
}

/**
 * S3へのアクセスを行うためのクラスです
 *
 * 初期化処理/終了処理をサーバ側、動画アップロードをブラウザ側で行っています。
 *
 * @class
 */
class S3Component {
  /**
   * コンストラクタ
   *
   * @constructor
   */
  constructor(
    public context: Context | null = null,
    public s3Client: AWS.S3 | null = null,
    public bucketName: string | null = null,
    public key: string | null = null,
    public uploadId: string | null = null,
  ) {}

  /**
   * S3を初期化します
   *
   * @param {Context} context
   * @return {Promise<s3ConfigsType>}
   */
  initS3(context: Context): Promise<boolean> {
    this.context = context;

    return new Promise((resolve, reject) => {
      (this.context as any).app.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_START_TESTER_RECORDING)
        .then((recording: TesterRecordingAdapter) => {
          const valid = (value: string | null) => (value ? value : '');
          const s3Configs = {
            accessKeyId: valid(recording.accessKeyId),
            secretAccessKey: valid(recording.secretAccessKey),
            bucket: valid(recording.bucket),
            key: valid(recording.key),
            sessionToken: valid(recording.sessionToken),
            uploadId: recording.uploadId,
          };

          // Configure the AWS. In this case for the simplicity I'm using access key and secret.
          AWS.config.update({
            credentials: {
              accessKeyId: s3Configs.accessKeyId,
              secretAccessKey: s3Configs.secretAccessKey,
              sessionToken: s3Configs.sessionToken,
            }
          });

          this.s3Client = new AWS.S3({ region: 'ap-northeast-1' });
          this.bucketName = s3Configs.bucket;
          this.key = s3Configs.key;
          console.log('-----------------config:uploadId' + s3Configs.uploadId);
          this.uploadId = s3Configs.uploadId;
          logging(debugLevel, {
            module: 'initS3',
            location: 'S3Configs set',
            details: 'bucket:' + this.bucketName + " key:" + this.key + " uploadId:" + this.uploadId
          });

          resolve(true);
        })
        .catch((error: any) => reject(error))
    })
  }

  /**
   * S3の後始末処理をします。
   *
   * シングルパートアップロードでもマルチアップロードでもサーバ側で適切に行います
   *
   * @return {Promise<boolean>}
   */
  finalS3(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      (
        // 認証エラーがあるか？
        (this.context as any).app.store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_AUTH_ERROR]
          //? (this.context as any).app.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_END_TESTER_RECORDING_RECOVERY, {key: this.key} as TesterRecordingRecoveryRequestType)
          ? Promise.resolve(true)
          : (this.context as any).app.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_END_TESTER_RECORDING)
      )
        .then(() => {
          resolve(true)
        })
        .catch(() => resolve(true))
        //.catch((error: any) => reject(error))
    })
  }

  /**
   * S3にアップロードします
   *
   * @param {Blob} data
   * @return {Promise<any>}
   */
  putObjectVideo(blob: Blob) {
    return new Promise((resolve, reject) => {
      (this.s3Client as any).putObject(
        {
          Bucket: this.bucketName,
          Body: blob,
          Key: this.key,
          ContentType: blob.type
        },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          } else {
            console.log(`File uploaded successfully. ${data}`);
            resolve(data)
          }
        }
      );
    })
  }

  /**
   * マルチパートアップロードのパーツをS3にアップロードします
   *
   * @param {Blob} data
   * @param {number} partNumber
   * @return {Promise<any>}
   */
  uploadPartVideo(blob: Blob, partNumber: number) {
    console.log('s3Obj.uploadId:' + this.uploadId);
    return (this.s3Client as any)
      .uploadPart({
        Body: blob,
        Bucket: this.bucketName,
        Key: this.key,
        PartNumber: partNumber,
        UploadId: this.uploadId,
        ContentLength: blob.size
      })
      .promise();
  }

//  stopHandler(): Promise<boolean> {
//    try {
//      const { Location } = await this.uploadComplete(this.multiParts);
//      console.log('upload success : ', Location);
//      logging(debugLevel, {module:'stopHandler','location':'upload success','details':'upload success:'+Location});
//      this.partNumber = 0;
//      this.multiParts = [];
//      return Promise.resolve(true);
//    } catch (error) {
//      console.error(error);
//      logging(debugLevel, {module:'stopHandler','location':'upload error','details':'upload error:'+error+' abortMultipartUploadへ'});
//      (this.s3Client as any)
//        .abortMultipartUpload({
//          Bucket: this.bucketName,
//          UploadId: this.uploadId,
//          Key: this.key
//        })
//        .promise()
//        .then(() => console.log('Multipart upload aborted'))
//        .catch((e: any) => {
//          console.error(e);
//          logging(debugLevel, {module:'stopHandler','location':'abortMultipartUpload error','details':'abortMultipartUpload error:'+e});
//          this.eventHandler.abortError({error: e, errorString: e.toString()});
//        });
//      return Promise.reject(error);
//    }
//  }
//
//  uploadComplete(parts: multiPartsType[]) {
//    console.log(parts);
//    logging(debugLevel, {module:'uploadComplete','location':'uploadComplete','details':'この処理は動いたらいけない'});
//    return (this.s3Client as any)
//      .completeMultipartUpload({
//        Bucket: this.bucketName,
//        Key: this.key,
//        UploadId: this.uploadId,
//        MultipartUpload: {
//          Parts: this.multiParts
//        }
//      })
//      .promise();
//  }
}

/** @const */
const MINIMUM_SIZE = 1048576 * 5;  //5MB制限

/**
 * 録画をS3にアップロードするためのレコーダ
 *
 * このクラスのstartUploader()とstopUploader()の実行は排他的に行われます。
 * それぞれのメソッドから返されたPromiseが完全に完了し通知を行うまでは、どちらかのメソッドが動くことはありません。
 *
 * @class
 */
class S3Uploader
{
  /**
   * コンストラクタ
   *
   * @constructor
   */
  constructor(
    public s3Component: S3Component | null = null,
    public mediaRecorder: any /*MediaRecorder | null*/ = null,
    public defaultOptions: optionsType = {},
    public eventHandler: UploaderEventHandler = {
      initializeError: (event: UploaderEvent) => { return Promise.resolve(true); },
      uploadError: (event: UploaderEvent) => { return Promise.resolve(true); },
    },

    // この2つのpromiseでstartUploader()とstopUploader()が同時に実行されないよう制御する
    public startUploaderPromise: Promise<any> | null = null,
    public stopUploaderPromise: Promise<any> | null = null,
    public aborts: {error: any}[] = [],

    public partNumber: number = 0,
    public stopPartNumber: number | null = null,
    public uploadStatus: uploadStatusType[] = [],

    public lastBlob: Blob[] = [],


    // 2173
    public queue: QueueItem[] = [],
    public temp: QueueItem | null = null
  ) {}

  /**
   * アップロードを開始します
   *
   * @param {Context} context
   * @param {MediaStream} stream
   * @param {UploaderEventHandler} eventHandler
   * @param {optionsType} options
   * @return {Promise<boolean>}
   */
  startUploader(
    context: Context,
    stream: MediaStream,
    eventHandler: UploaderEventHandler,
    options: optionsType
  ): Promise<boolean> {
    if (this.startUploaderPromise) {
      // すでにstartUploader()中ならばなにもしない
      return this.startUploaderPromise
    } else if (this.stopUploaderPromise) {
      // stopUploader()中ならば、処理終了を待ってstartUploader()を行う
      return new Promise((resolve, reject) => {
        (this.stopUploaderPromise as any)
          .finally(() => {
            this.startUploader(context, stream, eventHandler, options)
              .then(resolve)
              .catch(reject)
          })
      })
    }

    return this.startUploaderPromise = new Promise((resolve, reject) => {
      loggerStartTime = new Date();

      this.s3Component = new S3Component();
      this.mediaRecorder = null;
      this.defaultOptions = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000, // 5000000 bits/s
        audioBitsPerSecond: 128000, // 128000 bits/s
        timeslice: 15000 // 15sec
      };
      this.eventHandler = eventHandler;
    
      this.startUploaderPromise = null;
      this.stopUploaderPromise = null;
      this.aborts = [];

      this.partNumber = 0;
      this.stopPartNumber = null;
      this.uploadStatus = [];

      this.lastBlob = [];

      // 処理が成功するまで、繰り返します
      PromiseUtils.repeatUntilSuccessful(
        () => (this.s3Component as S3Component).initS3(context),
        {}
      )
        .then(() => {
          try {
            logging(debugLevel, {
              module:'startUploader',
              location: '初期化スタート',
              details: 's3Objの初期化開始'
            });

            this.mediaRecorder = new MediaRecorder(stream, this.setOptions(options));
            logging(debugLevel, {
              module: 'startUploader',
              location: 'MediaRecorder created',
              details: 'MediaRecorder:作成成功'
            });
            this.mediaRecorder.addEventListener('start', (event: any) => this.startHandler(event));
            this.mediaRecorder.addEventListener('stop', (event: any) => this.stopHandler(event));
            this.mediaRecorder.addEventListener('dataavailable', (event: any) => this.dataAvailableHandler(event));

            this.mediaRecorder.start(this.defaultOptions.timeslice); // timeslice
            logging(debugLevel, {
              module: 'startUploader',
              location: 'MediaRecorder start',
              details: 'MediaRecorder:スタート'
            });

            this.startUploaderPromise = null;
            resolve(true);
          } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            logging(debugLevel, {
              module: 'startUploader',
              location: 'MediaRecorder error',
              details: 'Exception while creating MediaRecorder: ' + e + ' ストップイベントへ'
            });
            this.eventHandler.initializeError({error: e, errorString: e.toString()});

            this.mediaRecorder = null
            this.startUploaderPromise = null;
            reject(e);
          }
        })
        .catch((e: any) => {
          // S3Componentの初期化失敗 

          this.mediaRecorder = null
          this.startUploaderPromise = null;
          reject(e)
        })
    })
  }

  /**
   * アップロードを終了します
   *
   * @param {{
   *          error: any,
   *        }} | null abort この引数を指定した場合、アップロード処理を正常終了せず異常終了とします。
   *                        ただし、処理を中断はせず、アップロード完了とエラー検知がすべて完了するのを待ってから終了します。
   * @return {Promise<boolean>}
   */
  stopUploader(abort: {error: any} | null = null): Promise<boolean> {
    if (abort) {
      this.aborts.push(abort);
    }

    if (this.startUploaderPromise) {
      // startUploader()中ならば処理終了後にストップを行う
      return new Promise((resolve, reject) => {
        (this.startUploaderPromise as any)
          .finally(() => {
            this.stopUploader(abort)
              .then(resolve)
              .catch(reject)
          })
      })
    } else if (this.stopUploaderPromise) {
      // すでにstopUploader()中ならば、なにもしない
      return this.stopUploaderPromise
    }

    if (! this.mediaRecorder) {
      return Promise.resolve(true)
    }

    return this.stopUploaderPromise = new Promise((resolve, reject) => {
      (new Promise((resolve, reject) => {
        let isStopUpload: boolean = false;
        let retry: number = 0;
        const interval = setInterval(() => {
          try {
            if (! isStopUpload) {
              retry = 0;

              // ストップ処理開始
              console.log('------------------------------------------------------stopUploader');
              this.mediaRecorder.stop();
              isStopUpload = true;
              logging(debugLevel, {
                module: 'stopUploader',
                location: 'stopped',
                details: 'stopUploader'
              });
            } else {
              retry ++;

              if (this.stopPartNumber === null) {
                // stopイベント発火まで何もしない
                logging(debugLevel, {
                  module: 'stopUploader',
                  location: 'wait stop event retry:' + retry,
                  details: `アップロードが完了するまでリトライ:`+retry
                });
              } else {
                const isSinglepartUpload = this.stopPartNumber === 1;
                const uploadMethodText = isSinglepartUpload ? 'シングルパートアップロード' : 'マルチパートアップロード';
                const process: any =
                  this.aborts.length
                    ? {
                      // すべてのパーツのアップロード完了かエラー完了か？
                      isEnd: () => (this.uploadStatus.filter((status) => (status.Completed || status.Errored)).length === this.stopPartNumber),
                      processText: 'アボート',
                    } as any
                    : {
                      // すべてのパーツのアップロード完了か？
                      isEnd: () => (this.uploadStatus.filter((status) => (status.Completed)).length === this.stopPartNumber),
                      processText: '通常アップロード',
                    } as any

                // すべてのパーツのアップロード完了かエラーを待つ
                if (process.isEnd()) {
                  logging(debugLevel, {
                    module: 'stopUploader',
                    location: 'stopped completed:',
                    details: `${uploadMethodText}が${process.processText}が完了`
                  });
                  clearInterval(interval);
                  resolve(false)
                } else {
                  logging(debugLevel, {
                    module: 'stopUploader',
                    location: 'stopped retry:' + retry,
                    details: `${uploadMethodText}が${process.processText}が完了するまでリトライ:` + retry
                  });
                }
              }
            }
          } catch (error) {
            console.error(error);
            logging(debugLevel, {
              module: 'stopUploader',
              location: 'stop error',
              details: 'stop error:' + error
            });
          }
        }, 1000);
      }))
        .then((result) => {
          // 処理が成功するまで、繰り返します
          PromiseUtils.repeatUntilSuccessful(
            () => (this.s3Component as S3Component).finalS3(),
            {}
          )
            .then(() => {
              this.mediaRecorder = null
              this.stopUploaderPromise = null;

              if (this.aborts.length) {
                const e = this.aborts[0].error;
                this.eventHandler.uploadError({error: e, errorString: e.toString()});
              }
              resolve(result)
            })
        })
    })
  }

  /**
   * MediaRecorderのstartイベントのハンドラ
   *
   * @private
   * @param {any} event
   */
  startHandler(event: any) {
    // nop
  }

  /**
   * MediaRecorderのstopイベントのハンドラ
   *
   * @private
   * @param {any} event
   */
  async stopHandler(event: any) {
    console.log("清理队列的逻辑: \t stopHandler被调用了")
    console.log("")
    if (this.stopPartNumber === null) {
      this.stopPartNumber = this.partNumber;
    }

    if(this.queue.length > 0) {
      console.log("清理队列的逻辑: \t 进入了 if判断是否队列的长度大于0")
      console.log("")
      let networkErrTime: number[] = []
      let minTime = 60
      let retry = 0

      const mediaRecorderState = this.mediaRecorder.state;
      const isSinglepartUpload = (mediaRecorderState === 'inactive' && this.partNumber === 0);
      const uploadMethodText = isSinglepartUpload ? 'シングルパートアップロード' : 'マルチパートアップロード';

      for(let i = 0; i < this.queue.length; i++) {
        let item = this.queue[i]
        console.log(`清理队列的逻辑: \t 剩余队列中取出的是 ${item.partNumber} 其内容为: ${item}`)
        console.log("")
        do {
          try {
            await item.fn()
            await PromiseUtils.sleep(1000)
            break
          } catch(error) {
            if (
              (error.code === 'NetworkingError' || error.name === 'NetworkingError')
            ) {
              console.log("清理队列的逻辑: \t 进入了 networkerror 里")
              console.log("")
              // ネットワークエラーが発生した時点(単位: 分)、networkErrTimeの配列に追加します
              let time = Math.floor(+new Date() / 1000 / 60)
              networkErrTime.push(time)
    
              // networkErrTime配列から最小時点と最大時点を取って、持続時間を求める
              let max = Math.max(...networkErrTime)
              let min = Math.min(...networkErrTime)
              let duration = max - min
              
              // もし持続時間 >= 60分　リトライを終了します
              if(duration >= minTime) {
                logging(debugLevel, {
                  module: 'dataAvailableHandler',
                  location: 'NetworkingError!!',
                  details: 'error code:' + error.code + ':' + error.name + ` ${uploadMethodText}ステータス part:${item.partNumber}, min:${min}, max: ${max}, duration: ${duration}, minTime: ${minTime}`,
                });
    
                // アップロード完了とエラー検知がすべて完了するのを待ってから終了します。
                this.uploadStatus[this.uploadStatus.findIndex(v => v.PartNumber == item.partNumber)].Errored = true;
                this.stopUploader({error: error});
                break
              }
              
              // ネットワークエラーの場合は、処理を再度アップロードを試みる
              logging(debugLevel, {
                module: 'dataAvailableHandler',
                location: 'NetworkingError!!',
                details: 'error code:' + error.code + ':' + error.name + ` ${uploadMethodText}ステータス part:${item.partNumber}, retry:${retry}`,
              });
    
              // ネットワークエラーでAPI投げ続けると重くなるのでsleepする
              await PromiseUtils.sleep(1000)
              continue;
    
            } else if (
              (error.code === 'TimeoutError' || error.name === 'TimeoutError') &&
              (retry <= 10)
            ) {
              // タイムアウトエラー(リトライ回数10回以下)の場合は、アップロードを試みる
              logging(debugLevel, {
                module: 'dataAvailableHandler',
                location: 'TimeoutError!!',
                details: 'error code:' + error.code + ':' + error.name + ` ${uploadMethodText}ステータス part:${item.partNumber}, retry:${retry}`,
              });
    
              continue;
    
            } else {
              // ネットワークエラー / タイムアウトエラー(リトライ回数10回以下) 以外
              logging(debugLevel, {
                module: 'dataAvailableHandler',
                location: 'error!!',
                details: 'error code:' + error.code + ':' + error.name + ' ストップイベント実行 part:' + item.partNumber
              });
              this.uploadStatus[this.uploadStatus.findIndex(v => v.PartNumber == item.partNumber)].Errored = true;
    
              // エラーが一度でも発生した場合、対処法がない(わからない)
              // なのでこのマルチパートアップロード(or シングルパートアップロード)をアボートします
              this.stopUploader({error: error});
              break;
            }
          }
        } while(true)
      }

      this.queue = []
    }
  }

  /**
   * MediaRecorderのdataAvailableイベントのハンドラ
   *
   * @private
   * @param {any} event
   */
  async dataAvailableHandler(event: any) {
    console.log("队列改修: \t dataAvailableHandler被调用了")
    console.log("")
    this.lastBlob.push(event.data)
    const mediaRecorderState = this.mediaRecorder.state; // このメソッドは同期的に実行されていないため、このメソッド内でthis.mediaRecorder.stateを参照してはいけない。mediaRecorderStateを使うこと

    // StopとpartNumber===0ならputObjectで一回だけアップロードする
    // この条件については、十分留意すること。stopイベント発火前の一回起こる。
    // ステータスの変更、イベントの発火順序については以下参照
    // @see https://developer.mozilla.org/ja/docs/Web/API/MediaRecorder/stop
    const isSinglepartUpload = (mediaRecorderState === 'inactive' && this.partNumber === 0);
    const uploadMethodLocation = isSinglepartUpload ? 'single parts upload' : 'multi parts upload';
    const uploadMethodText = isSinglepartUpload ? 'シングルパートアップロード' : 'マルチパートアップロード';
    const totalSize = (this.lastBlob.reduce((total, v) => total + v.size, 0))


    if (isSinglepartUpload) {
      // シングルアップロードで処理する場合は、そのまま処理する

      // nop

      logging(debugLevel, {
        module: 'dataAvailableHandler',
        location: 'single part upload start',
        details: 'ストップイベント中でpartsが１なのでputObjectでシングルアップロードする part' + (this.partNumber + 1) + ',ダウンロード間隔:' + this.defaultOptions.timeslice + ', blob size:' + totalSize,
      });
      console.log('ストップイベント中でpartsが１なのでputObjectでシングルアップロードする part' + (this.partNumber + 1) + ',ダウンロード間隔:' + this.defaultOptions.timeslice + ', blob size:' + totalSize)
    } else {
      // マルチアップロードで処理する場合は、最後のパート以外の5M未満のアップロードができないので5M未満である場合、
      // 次のdataAvailableHandlerイベント発火に任せる。
      // ただし、最後のパートについては、サイズの制限はありません。
      // @see https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/dev/qfacts.html
      if (mediaRecorderState === 'inactive') {
        // 最後のパート

        // nop

        logging(debugLevel, {
          module: 'dataAvailableHandler',
          location: 'multi part upload',
          details: 'マルチパートアップロード最後のパートアップロード part' + (this.partNumber + 1) + ', ダウンロード間隔:' + this.defaultOptions.timeslice + ', blob size:' + totalSize,
        });
        console.log('マルチパートアップロード最後のパートアップロード part' + (this.partNumber + 1) + ', ダウンロード間隔:' + this.defaultOptions.timeslice + ', blob size:' + totalSize)
      } else {
        // 最後以外のパート

        if (totalSize >= MINIMUM_SIZE) {
          // 最後以外のパート: 5M以上

          // nop

          logging(debugLevel, {
            module: 'dataAvailableHandler',
            location: 'multi part upload',
            details: 'マルチパートアップロード最後以外のパートアップロード part' + (this.partNumber + 1) + ',ダウンロード間隔:' + this.defaultOptions.timeslice + ', blob size:' + totalSize,
          });
          console.log('マルチパートアップロード最後以外のパートアップロード part' + (this.partNumber + 1) + ',ダウンロード間隔:' + this.defaultOptions.timeslice + ', blob size:' + totalSize)
        } else {
          // 最後以外のパート: 5M未満

          // 次のdataAvailableHandlerイベント発火に任せる。
          return
        }
      }
    }

    this.partNumber++;
    const partNumber = this.partNumber; // このメソッドは同期的に実行されていないため、このメソッド内でthis.partNumberを参照してはいけない。partNumberを使うこと
    this.uploadStatus.push({PartNumber: partNumber, Completed: false, Errored: false});

    const webm = this.lastBlob.length > 1
      ? new Blob(this.lastBlob, {type: this.lastBlob[0].type})
      : this.lastBlob[0]
    this.lastBlob = []

    const uploadToS3 = isSinglepartUpload
      ? async (blob: Blob, partNumber: number) => { await (this.s3Component as S3Component).putObjectVideo(blob) }
      : async (blob: Blob, partNumber: number) => { await (this.s3Component as S3Component).uploadPartVideo(blob, partNumber) }

    const wrapFn = (blob: Blob, partNumber: number): Function => {
      return () => {
        uploadToS3(blob, partNumber)
      }
    }

    let retry = 0;

    // 毎回ネットワークエラーの発生時点、この配列にあつめられます
    let networkErrTime = []

    // 限界値：60分以上になったらリトライを終了
    let minTime = 60

    this.queue.push({flag: false, partNumber, totalSize, fn: wrapFn(webm, partNumber)})
    console.log("队列改修: \t 查看队列的信息", this.queue)
    let total:string = this.queue.reduce((pre, item) => pre + item.totalSize, 0).toFixed(2)
    console.log("队列改修: \t 队列的总长度为", total)
    console.log("")

    do {
      if (retry == 0) {
        logging(debugLevel, {
          module: 'dataAvailableHandler',
          location: `${uploadMethodLocation} start`,
          details: `${uploadMethodText}開始 part:` + partNumber
        });
      } else {
        logging(debugLevel, {
          module: 'dataAvailableHandler',
          location: `${uploadMethodLocation} retry ` + retry + ' start',
          details: `${uploadMethodText}リトライ開始 part:` + partNumber
        });
      }
      retry++;

      try {
        if(!this.temp) {
          this.temp = this.queue.shift() as QueueItem
          console.log("队列改修: 进入到队列上传的 if 逻辑 取出的temp为 \t", this.temp)
          console.log("")
          await this.temp.fn()
          this.uploadStatus[this.uploadStatus.findIndex(v => v.PartNumber == partNumber)].Completed = true;

          logging(debugLevel, {
            module:'dataAvailableHandler',
            location: `${uploadMethodLocation} completed`,
            details: `${uploadMethodText}のアップロードが完了 part` + partNumber
          });

          this.temp.flag = true
          this.temp = null
          console.log("队列改修: 进入到队列上传的 if 逻辑 上传成功后的 temp 为 \t",this.temp)
          console.log("")
          break

        } else if(this.temp && !this.temp.flag) {
          console.log("")
          console.log("队列改修: 进入到队列上传的 elese if 逻辑 失败后重新上传的 temp 为 \t",this.temp)
          console.log("")
          await this.temp.fn()

          this.uploadStatus[this.uploadStatus.findIndex(v => v.PartNumber == partNumber)].Completed = true;

          logging(debugLevel, {
            module:'dataAvailableHandler',
            location: `${uploadMethodLocation} completed`,
            details: `${uploadMethodText}のアップロードが完了 part` + partNumber
          });

          this.temp.flag = true
          this.temp = null
          console.log("队列改修: 进入到队列上传的 elese if 逻辑 再次上传成功的 temp 为 \t",this.temp)
          console.log("")
          break
        }

      } catch(error) {
        if (
          (error.code === 'NetworkingError' || error.name === 'NetworkingError')
        ) {
          console.log("队列改修: 进入networkerror的情况")
          console.log("")
          // ネットワークエラーが発生した時点(単位: 分)、networkErrTimeの配列に追加します
          let time = Math.floor(+new Date() / 1000 / 60)
          networkErrTime.push(time)

          // networkErrTime配列から最小時点と最大時点を取って、持続時間を求める
          let max = Math.max(...networkErrTime)
          let min = Math.min(...networkErrTime)
          let duration = max - min
          
          // もし持続時間 >= 60分　リトライを終了します
          if(duration >= minTime) {
            logging(debugLevel, {
              module: 'dataAvailableHandler',
              location: 'NetworkingError!!',
              details: 'error code:' + error.code + ':' + error.name + ` ${uploadMethodText}ステータス part:${partNumber}, min:${min}, max: ${max}, duration: ${duration}, minTime: ${minTime}`,
            });

            // アップロード完了とエラー検知がすべて完了するのを待ってから終了します。
            this.uploadStatus[this.uploadStatus.findIndex(v => v.PartNumber == partNumber)].Errored = true;
            this.stopUploader({error: error});
            break
          }
          
          // ネットワークエラーの場合は、処理を再度アップロードを試みる
          logging(debugLevel, {
            module: 'dataAvailableHandler',
            location: 'NetworkingError!!',
            details: 'error code:' + error.code + ':' + error.name + ` ${uploadMethodText}ステータス part:${partNumber}, retry:${retry}`,
          });

          // ネットワークエラーでAPI投げ続けると重くなるのでsleepする
          await PromiseUtils.sleep(1000)
          continue;

        } else if (
          (error.code === 'TimeoutError' || error.name === 'TimeoutError') &&
          (retry <= 10)
        ) {
          // タイムアウトエラー(リトライ回数10回以下)の場合は、アップロードを試みる
          logging(debugLevel, {
            module: 'dataAvailableHandler',
            location: 'TimeoutError!!',
            details: 'error code:' + error.code + ':' + error.name + ` ${uploadMethodText}ステータス part:${partNumber}, retry:${retry}`,
          });

          continue;

        } else {
          // ネットワークエラー / タイムアウトエラー(リトライ回数10回以下) 以外
          logging(debugLevel, {
            module: 'dataAvailableHandler',
            location: 'error!!',
            details: 'error code:' + error.code + ':' + error.name + ' ストップイベント実行 part:' + partNumber
          });
          this.uploadStatus[this.uploadStatus.findIndex(v => v.PartNumber == partNumber)].Errored = true;

          // エラーが一度でも発生した場合、対処法がない(わからない)
          // なのでこのマルチパートアップロード(or シングルパートアップロード)をアボートします
          this.stopUploader({error: error});
          break;
        }
      }
    } while(true)
  }

  /**
   *
   *
   * @private
   * @param {optionsType} options
   * @return {optionsType}
   */
  setOptions(options: optionsType): optionsType {
    try {
      logging(debugLevel, {
        module: 'setOptions',
        location: 'defaultOptions set',
        details: 'defaultOptions set'
      });

      this.defaultOptions = Object.assign(this.defaultOptions, options);
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');

      this.defaultOptions.mimeType = 'video/webm;codecs=vp8';
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');
      
      this.defaultOptions.mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');

      this.defaultOptions.mimeType = 'video/mp4';
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');

      this.defaultOptions.mimeType = '';
      return this.defaultOptions;
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e.toString());
      logging(debugLevel, {
        module: 'setOptions',
        location: 'defaultOptions error',
        details: 'Exception while creating MediaRecorder: ' + e.toString()
      });
      this.eventHandler.initializeError({error: e, errorString: e.toString()});
      throw e;
    }
  }
};

/**
 * プラグイン
 */
const s3Plugin: Plugin = (context: Context, inject) => {
  const s3Uploader: S3Uploader = new S3Uploader();

  // logging()にcontextを渡す
  loggerContext = context;

  inject('startUploader', (stream: MediaStream, eventHandler: UploaderEventHandler, options: optionsType): Promise<boolean> => {
    return s3Uploader.startUploader(context, stream, eventHandler, options);
  });
  inject('stopUploader', (): Promise<boolean> => {
    return s3Uploader.stopUploader()
  });
};

export default s3Plugin;
