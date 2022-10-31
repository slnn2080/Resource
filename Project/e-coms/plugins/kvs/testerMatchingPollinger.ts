/* eslint-disable no-console */
import { Plugin, Context } from '@nuxt/types';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as loginTypes from '@/store/types/loginType';
import {
  MatchingAdapter,
  ChannelStatusForApi,
  MatchingCommand,
  MatchingDefaultRequestType,
  MatchingPostStatusRequestType,
  MatchingCommandRequestType,
  DeleteMatchingRequestType,
  Matching,
} from '@/store/types/adapters/matchingAdapter';
import * as matchingTypes from '@/store/types/matchingType';
import {
  KvsReconnectAdapter,
  KvsReconnectRequestType,
  KvsReconnectResponseType,
} from '@/store/types/adapters/kvsReconnectAdapter';
import * as kvsReconnectTypes from '@/store/types/kvsReconnectType';
import { TesterState } from '@/store/enum/TesterState';
import * as testerPageTypes from '@/store/types/testerPageType';
import { LogoutMethod } from '@/plugins/global/window';
import { pushMessage } from '@/static/push';
import { KVSConfig } from '@/plugins/kvs/kvsconfig';
import { KVSMaster } from '@/plugins/kvs/master';
import { KvsDataType, KvsCommand, CommandObject, MessageObject } from '@/plugins/kvs/type/sendMessageType';
import { MasterDataMessageType, MasterDataMessage } from '@/components/Mixins/TesterNotificationMixin';
import { PromiseUtils } from '@/utils/PromiseUtils';
import { MediaStreamResultType, MediaStreamHandler } from '@/plugins/global/mediaDevices';


declare module 'vue/types/vue' {
  interface Vue {
    $testerMatchingPollinger: TesterMatchingPollinger;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $testerMatchingPollinger: TesterMatchingPollinger;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $testerMatchingPollinger: TesterMatchingPollinger;
  }
}

/* -------------------------------------------- declare types end -------------------------------------------- */


export class TesterMatchingPollinger
{
  private intervalMatching: NodeJS.Timeout | null = null;
  private kvsMaster: KVSMaster | null = null;

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
      .then((adapter: MatchingAdapter) => {
        // KVSの処理開始
        this.startKvsMaster(this.getMatchings()[0])
          .then(() => resolve(true))
          .catch(reject)
      })
    })
  }

  /**
   * マッチングポーリング停止
   *
   * @return {Promise<boolean>}
   */
  public stopMatchingPolling(): Promise<boolean> {
    const matchings = this.getMatchings()
    if (!matchings[0]) {
      return Promise.reject(false)
    }
    const testerId = matchings[0].testerId

    return new Promise((resolve) => {
      new Promise((resolve) => {
        if (this.intervalMatching) {
          clearInterval(this.intervalMatching)
          this.intervalMatching = null
        }

        let startTime = Date.now()
        const deleteMatching = () => {
          // matching.phpのアクセスがすべて完了することを監視する
          const isAccessing = this.context.store.getters[matchingTypes.GETTER_IS_ACCESSING]
          // TODO: 不具合がありmatching.phpのアクセスの監視で停止してしまうので、一定期間経過した場合はこの監視のループを抜けるようにする
          const cond = ((Date.now() - startTime) <= (10 * 1000))
          if (isAccessing && cond) {
            console.log('[LOG] matching.phpにアクセス中です!!')

            setTimeout(deleteMatching, 100)
            return
          }

          PromiseUtils.repeatUntilSuccessful(
            () => {
              return this.requestDeleteMatching({
                tester_id: testerId,
              } as DeleteMatchingRequestType)
            },
            {}
          )
          .finally(() => {
            console.log('[LOG] delete matching finished!!')

            resolve(true)
          })
        }
        deleteMatching()
      })
      .then(() => {
        // KVSの処理停止
        this.stopKvsMaster()
          .finally(() => {
            console.log('[LOG] stopKvsMaster finished!!')

            resolve(true)
          })
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
   * KVS開始処理
   *
   * @param {Matching} matching
   */
  private startKvsMaster(matching: Matching) {
    const kvsMaster = this.kvsMaster
    if (kvsMaster) {
      return Promise.resolve(true)
    }

    return this.context.app.$mediaDevices.createFrontCameraMediaStream(true, true)
    .then((mediaStreamResult: MediaStreamResultType) => new Promise((resolve, reject) => {
      const mediaStream = mediaStreamResult.mediaStream
      const testerId = matching.testerId

      const kvsMaster = this.context.app.$kvsMaster(
        mediaStream!, // TODO: いずれ修正
        {
          /**
           * KVSのopenが完了したときに呼び出されるイベントハンドラ 
           */
          onOpened: () => {
            console.log('[LOG INFO] master KVS open');

            const channelStatus = ChannelStatusForApi.OPEN
            this.requestMatching({
              tester_id: testerId,
              channel_status: channelStatus,
            } as MatchingPostStatusRequestType)
              .then((adapter: MatchingAdapter) => {
                console.log('[LOG INFO] master matching post request success! :', 'open');
              })
              .catch((err) => {
                console.log('<<<<>>>>' + err);
                console.log(err);
              });
          },
          /**
           * KVSのクローズが完了したときに呼び出されるイベントハンドラ 
           */
          onClosed: () => {
            console.log('[LOG INFO] master KVS close');
        
            // TODO: 要検証
            // TODO: 要検証
            // TODO: 要検証
            // TODO: 何もしてはいけない このイベントはWebSocketのoncloseイベントからも呼び出される
            // これはブラウザ依存の可能性もあるが、ブラウザ(Chrome,Edge)のネットワークの瞬断によって起こされるらしい
            return;

            const channelStatus = ChannelStatusForApi.CLOSE
            this.requestMatching({
              tester_id: testerId,
              channel_status: channelStatus,
            } as MatchingPostStatusRequestType)
            .then((adapter: MatchingAdapter) => {
              console.log('[LOG INFO] master matching post request success! :');
            })
            .catch(err => {
              console.log('<<<<>>>>' + err);
              console.log(err);
            });
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
                break;

              case 'failed':
              case 'closed':
                break;
            }
          },
          /**
           * メッセージの送受信
           *
           * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/datachannel_event
           */
          onRemoteDataMessage: (event: any) => {
            const parsedData = JSON.parse(event.data)

            switch (parsedData.dataType) {
              case KvsDataType.COMMAND:
                const commandObject = parsedData as CommandObject
                switch (commandObject.command) {
                  // メッセージ送信完了確認
                  case KvsCommand.MESSAGE_RECEIVED:
                    const data = JSON.parse(commandObject.data!)
                    this.context.app.$kvsEventBus.$emit('master-dataMessage-done', {messageObject: data.messageObject});
                    break;

                  // 強制ログアウト (kickout)
                  case KvsCommand.KICK_OUT:
                    // 強制ログアウトを食らったので、速やかにmatching.phpのポーリング処理を停止する
                    this.stopMatchingPolling()
                      .then(() => {

                        const displayLang = this.context.store.getters[rootTypes.GETTER_DISPLAY_LANG];
                        const loginData = this.context.store.getters[loginTypes.GETTER_LOGIN];
                        const inParams = this.context.store.getters[rootTypes.GETTER_STARTUP];
                        const message = StartupAdapter.isJtStartUp(inParams)
                          ? (displayLang as any).FORCE_CLOSE_PAGE  // J-Testing の場合
                          : (displayLang as any).FORCE_LOGOUT      // J-Testing 以外の場合

                        pushMessage(
                          {
                            alert: message,
                            loginId: loginData.loginId as string,
                            domainName: inParams.target
                          }
                        );
                        this.context.app.$window.cleanup(LogoutMethod.KICK_OUT_PUT_MYSELF)
                      })
                    break;

                  case KvsCommand.BEFORE_CLOSE_OK:
                    this.context.app.$kvsEventBus.$emit('master-beforeCloseOk')
                    break;

                  case KvsCommand.IDENTIFICATION_AUTHENTICATING:
                    this.context.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_CHANGE_IDENTIFICATION_AUTHENTICATING)
                    break;

                  case KvsCommand.IDENTIFICATION_ACCEPTED:
                    // サーバ側のテスターステータスの変更が完了するまで待つ
                    const func = () => {
                      // ここでは、最新のテスター情報が欲しいので、常に最新のmatching情報を取得する
                      const matchings = this.getMatchings()
                      const matching = matchings[0]
                      if (matching.testerStatus === TesterState.IDENTIFICATED) {
                        // テスターステータスの変更が完了していれば終わり

                        this.context.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_CHANGE_IDENTIFICATION_ACCEPTED)
                      } else {
                        // 変更されるまで監視を続ける

                        setTimeout(func, 1000)
                      }
                    };

                    func()
                    break;

                  case KvsCommand.IDENTIFICATION_REJECTED:
                    this.context.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_CHANGE_IDENTIFICATION_REJECTED)
                    break;

                  default:
                    console.error('[KVS ERROR] unknown command error!!', event);
                }
                break;
                
              case KvsDataType.MESSAGE:
                const messageObject = parsedData as MessageObject
                this.context.app.$kvsEventBus.$emit('master-dataMessage', {masterDataMessageType: MasterDataMessageType.DEFAULT, messageObject: messageObject} as MasterDataMessage);

                // メッセージの受信完了を通知する
                const data = {
                  messageObject: messageObject,
                };
                kvsMaster.sendMasterCommand({dataType: KvsDataType.COMMAND, command: KvsCommand.MESSAGE_RECEIVED, data: JSON.stringify(data)})
                break;
              
              default:
                console.error('[KVS ERROR] unknown dataType error!!', event);
            }
          }
        }
      );


      PromiseUtils.repeatUntilSuccessful(
        () => {
          // ここでは、シグナリングチャンネルの再発行に備えて常に最新のmatching情報を取得する
          const matchings = this.getMatchings()
          const matching = matchings[0]
          const { accessKeyId, region, channelName, secretAccessKey, sessionToken } = matching.signalingChannel;
          const kvsConfig = new KVSConfig({
            region,
            accessKeyId,
            channelName,
            secretAccessKey,
            sessionToken,
          })

          return kvsMaster.startMaster(kvsConfig)
        },
        {
          interval: 0,
          dispose: () => {
            return new Promise((resolve) => {
              Promise.all([
                // シグナリングチャンネルを再発行させる
                new Promise((resolve, reject) => {
                  this.requestMatching({
                    tester_id: testerId,
                    matching_command: MatchingCommand.RESET_SIGNALING_CHANNEL,
                  } as MatchingCommandRequestType)
                })
              ])
              .finally(() => resolve(true))
            })
          },
        }
      )
      .then(() => {
        this.kvsMaster = kvsMaster

        resolve(true)
      })
    }));
  }

  /**
   * KVS停止処理
   */
  stopKvsMaster() {
    return new Promise((resolve, reject) => {
      const kvsMaster = this.kvsMaster
      if (!kvsMaster) {
        console.error('[ERROR] kvs is not started!!')
        return resolve(true)
      }

      // 「監視者」側に正常に閉じるための通知を行う
      // 正常に閉じる処理は以下の流れになる
      // 監視がない場合には、このBEFORE_CLOSE/BEFORE_CLOSE_OKの送受信を行う必要がないが、
      // この処理を行わないようにしているので問題はない
      // とも思ったが、接続が切れている場合、終了処理が行えないので、一定期間BEFORE_CLOSE_OKが来なかったら、
      // そのまま後始末を行う
      //
      // 受験者                                監視者
      //    |                                    |
      //    |  KvsCommand.BEFORE_CLOSEを送信     |
      //    |----------------------------------->|
      //    |                                    |
      //    |  KvsCommand.BEFORE_CLOSE_OKを送信  |
      //    |<-----------------------------------|
      //    |                                    |
      //    |  kvsMaster.stopMaster()を呼び出す  |

      console.log('[log info] master matching post request success!');

      this.kvsMaster!.sendMasterCommand({dataType: KvsDataType.COMMAND, command: KvsCommand.BEFORE_CLOSE} as CommandObject)

      // もし一定期間「監視者」から応答がなかった場合、終了処理を継続できるようにします
      // 「監視者」から応答があった場合は、コマンド応答側でkvsMaster.stopMaster()をコールするのでここでは何もしない
      let intervalTimer: NodeJS.Timeout | null = setTimeout(
        () => {
          this.context.app.$kvsEventBus.$emit('master-beforeCloseOk')
        },
        (this.context.store.getters[rootTypes.GETTER_STARTUP].matchingTimeout * 1000) * 2
      )

      this.context.app.$kvsEventBus.$on('master-beforeCloseOk', (result: boolean) => {
        this.context.app.$kvsEventBus.$off('master-beforeCloseOk')

        if (intervalTimer) {
          clearTimeout(intervalTimer)
          intervalTimer = null
        }

        this.kvsMaster!.stopMaster()
        this.kvsMaster = null

        resolve(true)
      })
    })
  }

  /**
   * KVSを再接続します
   *
   * @param {Matching} matching
   * @return {Promise<boolean>}
   */
  public restartKvsMaster(matching: Matching): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.context.store.dispatch(kvsReconnectTypes.ACTION_KVS_RECONNECT, { tester_id: matching.testerId as number} as KvsReconnectRequestType)
        .then((adapter: KvsReconnectAdapter) => {
          this.stopKvsMaster()
            .then(() => {
              const margedMatching: Matching = Object.assign(
                {},
                matching,
                adapter.matchingLikeObject!
              )
              this.startKvsMaster(margedMatching)
                .then(() => resolve(true))
                .catch(reject)
            })
        })
        .catch(reject)
    })
  }

  /**
   * メッセージを送信します
   *
   * @param {MessageObject} message
   */
  sendMasterMessage(data: MessageObject) {
    const kvsMaster = this.kvsMaster
    if (kvsMaster) {
      kvsMaster.sendMasterMessage(data)
    } else {
      console.error('[ERROR] kvs is not started!!')
    }
  }

  /**
   * KVSを取得します
   *
   * @return {KVSMaster | null}
   */
  getKvsMaster(matching: Matching): KVSMaster | null {
    return this.kvsMaster
  }
}

const plugin: Plugin = (context: Context, inject) => {
  const pollinger = new TesterMatchingPollinger(context)

  inject('testerMatchingPollinger', pollinger)
};
export default plugin
