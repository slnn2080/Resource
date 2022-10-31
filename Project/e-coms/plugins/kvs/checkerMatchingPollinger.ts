/* eslint-disable no-console */
import { Plugin, Context } from '@nuxt/types';
import { debounce } from 'lodash';
import { KVSConfig } from '@/plugins/kvs/kvsconfig';
import { KVSViewer } from '@/plugins/kvs/viewer';
import { KvsDataType, KvsCommand, CommandObject, MessageObject } from '@/plugins/kvs/type/sendMessageType';
import * as rootTypes from '@/store/types/rootType';
import {
  MatchingAdapter,
  Matching,
  SignalingChannel,
  ChannelStatusForApi,
  MatchingDefaultRequestType,
  MatchingPostStatusRequestType,
  MatchingCommandRequestType,
  DeleteMatchingRequestType
} from '@/store/types/adapters/matchingAdapter';
import * as matchingTypes from '@/store/types/matchingType';
import {
  KvsReconnectAdapter,
  KvsReconnectRequestType,
  KvsReconnectResponseType,
} from '@/store/types/adapters/kvsReconnectAdapter';
import * as kvsReconnectTypes from '@/store/types/kvsReconnectType';
import {
  KickOutMethod,
  TesterKickOutRequestType,
} from '@/store/types/adapters/testerKickOutAdapter';
import * as testerKickOutTypes from '@/store/types/testerKickOutType';
import { PromiseUtils } from '@/utils/PromiseUtils';

declare module 'vue/types/vue' {
  interface Vue {
    $checkerMatchingPollinger: CheckerMatchingPollinger;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $checkerMatchingPollinger: CheckerMatchingPollinger;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $checkerMatchingPollinger: CheckerMatchingPollinger;
  }
}

/* -------------------------------------------- declare types end -------------------------------------------- */

type ConnectionData = {
  kvsViewer: KVSViewer;
}

export class CheckerMatchingPollinger
{
  private intervalMatching: NodeJS.Timeout | null = null;
  private connectionDataMap: {
    [testerUniqueKey: string]: ConnectionData;
  } = {};

  constructor(
    private context: Context,
  ) {}

  /**
   * マッチング処理が開始されているか調べます
   *
   * @return {boolean}
   */
  isStartedMatchingPolling(): boolean {
    return !! this.intervalMatching
  }

  /**
   * マッチングポーリング処理開始
   *
   * @return {Promise<boolean>}
   */
  public startMatchingPolling(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      new Promise((resolve: (adapter: MatchingAdapter) => any) => {
        // matching
        let first: boolean = false
        const func = () => {
          this.requestMatching({} as MatchingDefaultRequestType)
            .then((adapter: MatchingAdapter) => {
              if (!first) {
                first = true
                resolve(adapter)
              }
            })
        }
   
        func()
        this.intervalMatching = setInterval(
          func,
          this.context.store.getters[rootTypes.GETTER_STARTUP].matchingTimeout * 1000
        )
      })
      .then(() => resolve(true))
      .catch(reject)
    })
  }

  /**
   * マッチングポーリング停止
   *
   * @return {Promise<boolean>}
   */
  public stopMatchingPolling(): Promise<boolean> {
    return new Promise((resolve) => {
      new Promise((resolve) => {
        if (this.intervalMatching) {
          clearInterval(this.intervalMatching)
          this.intervalMatching = null
        }

        let startTime = Date.now()
        const wait = () => {
          // matching.phpのアクセスがすべて完了することを監視する
          const isAccessing = this.context.store.getters[matchingTypes.GETTER_IS_ACCESSING]
          // TODO: 不具合がありmatching.phpのアクセスの監視で停止してしまうので、一定期間経過した場合はこの監視のループを抜けるようにする
          const cond = ((Date.now() - startTime) <= (10 * 1000))
          if (isAccessing && cond) {
            setTimeout(wait, 100)
            return
          }

          resolve(true)
        }
        wait()
      })
      .then(() => {
        resolve(true)
      })
    })
  }

  /**
   * マッチング処理取得
   *
   * @param {MatchingDefaultRequestType | MatchingPostStatusRequestType | MatchingCommandRequestType} request
   * @return {Promise<MatchingAdapter>}
   * @private
   */
  public requestMatching(
    request: (MatchingDefaultRequestType | MatchingPostStatusRequestType | MatchingCommandRequestType)
  ): Promise<MatchingAdapter> {
    return this.context.store.dispatch(matchingTypes.ACTION_MATCHING, request)
  }

  /**
   * マッチング処理を削除します 
   *
   * @param {DeleteMatchingRequestType} request
   * @return {Promise<boolean>}
   */
  public requestDeleteMatching(request: DeleteMatchingRequestType): Promise<boolean> {
    return this.context.store.dispatch(matchingTypes.ACTION_DELETE_MATCHING, request)
  }

  /**
   * マッチング情報取得
   *
   * @return {Matching[]}
   */
  public getMatchings(): Matching[] {
    return this.context.store.getters[matchingTypes.GETTER_MATCHING] || [] 
  }

  /**
   * KVS開始処理(KVS接続)
   *
   * @param {Matching} matching
   * @return {Promise<boolean>}
   */
  public startKvsViewer(matching: Matching): Promise<boolean> {
    const testerUniqueKey = Matching.generateTesterUniqueKey(matching)
    if (this.connectionDataMap[testerUniqueKey]) {
      return Promise.resolve(true)
    }

    return new Promise((resolve, reject) => {
      // KVSの切断処理 正常系の場合に事前通知を取得したかのフラグ
      let beforeCloseCommandReceived: boolean = false

      const kvsViewer = this.context.app.$kvsViewer(
        {
          /**
           * KVSのopenが完了したときに呼び出されるイベントハンドラ 
           */
          onOpened: () => {
            const channelStatus = ChannelStatusForApi.OPEN

            console.log('[LOG INFO] viewer KVS open', channelStatus);
            this.requestMatching({
              tester_id: matching.testerId,
              channel_status: channelStatus,
            } as MatchingPostStatusRequestType);
          },
          /**
           * KVSのクローズが完了したときに呼び出されるイベントハンドラ 
           */
          onClosed: () => {
            const channelStatus = ChannelStatusForApi.CLOSE

            console.log('[LOG INFO] viewer KVS close', channelStatus);
            this.requestMatching({
              tester_id: matching.testerId,
              channel_status: channelStatus,
            } as MatchingPostStatusRequestType);
          },
          /**
           * コネクションの変更を監視します
           *
           * @param {RTCPeerConnection} event
           * @param {connectionState} string
           * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onconnectionstatechange
           */
          onConnectionStateChange: (event: RTCPeerConnection, connectionState: string) => {
            console.log('[LOG INFO]: onConnectionStateChange', connectionState)
            switch (connectionState) {
              case 'new':
                break;

              case 'connecting':
                break;

              case 'connected':
                break;

              case 'disconnected':
                //break;

              case 'failed':
              case 'closed':
                if (beforeCloseCommandReceived) {
                  // KVSの切断処理の正常系 通知が来ているので、強制ログアウトしない
                  // ただし、一定期間マッチングしている場合は、やっぱり不具合の可能性があるので閉じる
                  window.setTimeout(
                    () => {
                      const matchings = this.getMatchings()
                      if (matchings.find((v) => ((v.testerId == matching.testerId) && (v.matchingConnectedTime == matching.matchingConnectedTime)))) {
                        // KVSの切断処理の異常系 通知が来ていないので、ブラウザ「x」閉じと判断し強制ログアウトする
                        //this.context.store.dispatch(testerKickOutTypes.ACTION_TESTER_KICK_OUT, {tester_id: matching.testerId, method: KickOutMethod.DISCONNECT})
                        // TODO: 強制ログアウトは不具合になる可能性があるので、マッチング削除
                        this.requestDeleteMatching({tester_id: matching.testerId} as DeleteMatchingRequestType)
                      }
                    },
                    (this.context.store.getters[rootTypes.GETTER_STARTUP].matchingTimeout * 1000) * 4
                  )
                } else {
                  // KVSの切断処理の異常系 通知が来ていないので、ブラウザ「x」閉じと判断し強制ログアウトする
                  //this.context.store.dispatch(testerKickOutTypes.ACTION_TESTER_KICK_OUT, {tester_id: matching.testerId, method: KickOutMethod.DISCONNECT})
                  // TODO: 強制ログアウトは不具合になる可能性があるので、マッチング削除
                  this.requestDeleteMatching({tester_id: matching.testerId} as DeleteMatchingRequestType)
                }
                break;
            }
          },
          /**
           *
           *
           */
          onTrack: (mediaStream: MediaStream | null) => {
            const func = /*debounce(*/(mediaStream: MediaStream | null) => {
              console.log('[LOG INFO] viewer KVS tack', mediaStream);
              this.context.app.$kvsEventBus.$emit('viewer-track', {matching: matching, mediaStream});
            }/*, 500);*/

            func(mediaStream);
          },
          /**
           *
           *
           */
          onAudioProcess: (audioSize: number) => {
            this.context.app.$kvsEventBus.$emit('viewer-audioProcess', {matching: matching, audioSize});
          },
          /**
           * メッセージの送受信
           *
           * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/datachannel_event
           */
          onRemoteDataMessage: (event: any) => {
            console.log('[LOG INFO]: receive dataChannel message', event);

            const parsedData = JSON.parse(event.data)
            switch (parsedData.dataType) {
              case KvsDataType.COMMAND:
                const commandObject = parsedData as CommandObject
                switch (commandObject.command) {
                  // メッセージ送信完了確認
                  case KvsCommand.MESSAGE_RECEIVED:
                    const data = JSON.parse(commandObject.data!)
                    this.context.app.$kvsEventBus.$emit('viewer-dataMessage-done', {matching: matching, messageObject: data.messageObject});
                    break;

                  case KvsCommand.BEFORE_CLOSE:
                    beforeCloseCommandReceived = true
                    kvsViewer.sendViewerCommand({dataType: KvsDataType.COMMAND, command: KvsCommand.BEFORE_CLOSE_OK})
                    break;

                  default:
                    console.error('[KVS ERROR] unknown command error!!', event);
                }
                break;

              case KvsDataType.MESSAGE:
                const messageObject = parsedData as MessageObject
                this.context.app.$kvsEventBus.$emit('viewer-dataMessage', {matching: matching, messageObject});

                // メッセージの受信完了を通知する
                const data = {
                  messageObject: messageObject,
                };
                kvsViewer.sendViewerCommand({dataType: KvsDataType.COMMAND, command: KvsCommand.MESSAGE_RECEIVED, data: JSON.stringify(data)})
                break;
              
              default:
                console.error('[KVS ERROR] unknown dataType error!!', event);
            }
          },
        }
      );
 
      PromiseUtils.repeatUntilSuccessful(
        () => {
          const { accessKeyId, channelName, region, secretAccessKey, sessionToken } = matching.signalingChannel;
          const kvsConfig = new KVSConfig({
            region,
            accessKeyId,
            channelName,
            secretAccessKey,
            sessionToken,
            clientId: channelName,
          })

          return kvsViewer.startViewer(kvsConfig)
        },
        {
          interval: 0,
          retryMax: 3,
          dispose: () => {
          },
        }
      )
      .then(() => {
        this.connectionDataMap[testerUniqueKey] = {kvsViewer: kvsViewer}

        resolve(true)
      })
      .catch(() => {
        this.requestDeleteMatching({tester_id: matching.testerId} as DeleteMatchingRequestType)
          .finally(() => {
            reject(new Error(''))
          })
      })
    })
  }

  /**
   * KVS停止処理(KVS接続)
   *
   * @param {Matching} matching
   * @return {Promise<boolean>}
   */
  public stopKvsViewer(matching: Matching): Promise<boolean> {
    const testerUniqueKey = Matching.generateTesterUniqueKey(matching)
    if (!this.connectionDataMap[testerUniqueKey]) {
      return Promise.resolve(false)
    }

    this.connectionDataMap[testerUniqueKey].kvsViewer.stopViewer()
    delete this.connectionDataMap[testerUniqueKey]

    return Promise.resolve(true)
  }

  /**
   * KVSを再接続します
   *
   * @param {Matching} matching
   * @return {Promise<boolean>}
   */
  public restartKvsViewer(matching: Matching): Promise<boolean> {
    const testerUniqueKey = Matching.generateTesterUniqueKey(matching)

    return new Promise((resolve, reject) => {
      this.context.store.dispatch(kvsReconnectTypes.ACTION_KVS_RECONNECT, { tester_id: matching.testerId as number} as KvsReconnectRequestType)
        .then((adapter: KvsReconnectAdapter) => {
          this.stopKvsViewer(matching)
            .then(() => {
              const margedMatching: Matching = Object.assign(
                {},
                matching,
                adapter.matchingLikeObject!
              )
              this.startKvsViewer(margedMatching)
                .then(() => resolve(true))
                .catch(reject)
            })
        })
        .catch(reject)
    })
  }

  /**
   * KVSを取得します
   *
   * @return {KVSViewer | null}
   */
  public getKvsViewer(matching: Matching): KVSViewer | null {
    const testerUniqueKey = Matching.generateTesterUniqueKey(matching)
    if (!this.connectionDataMap[testerUniqueKey]) {
      return null
    }

    return this.connectionDataMap[testerUniqueKey].kvsViewer
  }
}

const plugin: Plugin = (context: Context, inject) => {
  const pollinger = new CheckerMatchingPollinger(context)

  inject('checkerMatchingPollinger', pollinger)
};
export default plugin
