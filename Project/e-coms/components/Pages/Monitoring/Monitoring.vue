<template>
  <div>
    <main class="main">
      <div class="container">
        <div class="row mb-3 sub-monitor-area">
          <template v-for="(monitorObject, index) in subMonitorObjects">
            <!-- sub monitors -->

            <template v-if="monitorObject.data.matching">
              <SubMonitor
                :connect="true"
                :monitor-object="monitorObject"
                :monitor-object-actions="monitorObjectActions"
              />
            </template>
            <template v-else>
              <template v-if="monitorObject.activation">
                <SubMonitorDisconnected
                  :monitor-object="monitorObject"
                  :monitor-object-actions="monitorObjectActions"
                />
              </template>
              <template v-else>
                <SubMonitorNoAllocation
                  :monitor-object="monitorObject"
                  :monitor-object-actions="monitorObjectActions"
                />
              </template>
            </template>
          </template>
        </div>
        <!-- main monitor -->
        <MainView
          :monitor-object="mainMonitorObject"
          :monitor-object-actions="monitorObjectActions"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SubMonitor from './childs/SubMonitor.vue';
import SubMonitorDisconnected from './childs/SubMonitorDisconnected.vue';
import SubMonitorNoAllocation from './childs/SubMonitorNoAllocation.vue';
import MainView from './childs/MainView.vue';
import * as rootTypes from '@/store/types/rootType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import * as matchingTypes from '@/store/types/matchingType';
import * as monitorActivateTypes from '@/store/types/monitorActivateType';
import * as monitorActivateListType from '@/store/types/monitorActivateListType';
import * as aiAuthStatusType from '@/store/types/aiAuthStatusType';
import { LanguageEnum } from '@/store/enum/language';
import { MonitorActivateListAdapter, MonitorActivateListResponseType } from '@/store/types/adapters/monitorActivateListAdapter';
import { MonitorActivateAdapter, MonitorActivateRequestType, MonitorActivateResponseType } from '@/store/types/adapters/monitorActivateAdapter';
import { ChatItemSender, ChatItem } from '@/store/enum/ChatItem';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import { Matching, SignalingChannel, MatchingCommand, MatchingRequestType, DeleteMatchingRequestType } from '@/store/types/adapters/matchingAdapter';
import { AiAuthStatusAdapter } from '@/store/types/adapters/aiAuthStatusAdapter';
import { Message, WebRTCMessageGetAdapter, WebRTCMessageGetRequestType } from '@/store/types/adapters/webrtcMessageAdapter';
import * as webrtcMessageTypes from '@/store/types/webrtcMessageType';
import * as testerTypes from '@/store/types/testerType';
import CheckerMatchingPollingMixin from '@/components/Mixins/CheckerMatchingPollingMixin';
import { MessageObject, CommandObject } from '@/plugins/kvs/type/sendMessageType';
import { TesterState } from '@/store/enum/TesterState';
import {
  TesterHeadShotAdapter,
  TesterHeadShotPostRequestType,
  TesterHeadShotGetRequestType,
} from '@/store/types/adapters/testerHeadShotAdapter';
import * as testerHeadShotTypes from '@/store/types/testerHeadShotType';

type MonitoringTesterCache = {
  chatItems: ChatItem[];
}

export default Vue.extend({
  components: {
    SubMonitor,
    SubMonitorDisconnected,
    SubMonitorNoAllocation,
    MainView,
  },
  mixins: [
    CheckerMatchingPollingMixin,
  ],
  data() {
    return {
      timeInterval: null as (NodeJS.Timeout | null),
      monitorObjects: {
        1: new MonitorObject(1),
        2: new MonitorObject(2),
        3: new MonitorObject(3),
        4: new MonitorObject(4),
        5: new MonitorObject(5),
      } as { [monitorId: number] : MonitorObject},
      monitoringTesterCacheMap: {} as {[testerId: number]: MonitoringTesterCache},
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    monitorPageAdapter(): MonitorPageAdapter {
      return this.$store.getters[monitorPageTypes.GETTER_MONITOR_PAGE];
    },
    mainMonitorObject(): MonitorObject {
      return this.monitorObjects[1]
    },
    subMonitorObjects(): MonitorObject[] {
      return [
        this.monitorObjects[2],
        this.monitorObjects[3],
        this.monitorObjects[4],
        this.monitorObjects[5],
      ]
    },
    monitorObjectActions(): MonitorObjectActions {
      return {
        changeMainMonitor: this.changeMainMonitor,
        setActivation: this.setActivation,
        addChatItem: this.addChatItem,
        setAuthenticating: this.setAuthenticating,
        setAccepted: this.setAccepted,
        setRejected: this.setRejected,
        setMuted: this.setMuted,
        isNeedUpdateHeadShot: this.isNeedUpdateHeadShot,
        updateHeadShot: this.updateHeadShot,
      }
    },
    matchings(): Matching[] {
      return (this as InstanceType<typeof CheckerMatchingPollingMixin>).getMatchings()
    },
  },
  watch: {
    // pooling API「受験・監視マッチング」APIのmachings配列変化を感知する
    matchings: {
      deep: true,
      handler: function (newMatchings: Matching[], oldMatchings: Matching[]) {
        console.log('watch new matchings: ', newMatchings);
        // console.log('watch old matchings: ', oldMatchings);

        // 新規に含まれていない既存のマッチングは削除する
        Object.values(this.monitorObjects)
          .forEach((monitorObject: MonitorObject) => {
            if (!monitorObject.data.matching) {
              return
            }

            if (!newMatchings.find((matching: Matching) => Matching.equals(matching, monitorObject.data.matching!))) {
              console.log('[LOG] remove monitor object', monitorObject.data.matching!)
              this.removeMonitorObjectIfExists(monitorObject.data.matching!)
            }
          })

        // 既存は更新する/新規は作成する
        newMatchings
          .forEach((newMatching: Matching) => {
            const monitorObject = this.findMonitorObjectByMatching(newMatching)
            if (monitorObject) {
              // 既存
              console.log('[LOG] update monitor object', newMatching)

              const oldMatching = monitorObject.data.matching!
              this.updateMonitorObject(monitorObject, {data: {matching: newMatching}})

              // もし、signalingChannelが変更されていたらKVSを繋ぎなおす
              if (!SignalingChannel.equals(newMatching.signalingChannel, oldMatching.signalingChannel)) {
                console.log('[KVS LOG] change signalingchannel', newMatching.signalingChannel);
                (this as InstanceType<typeof CheckerMatchingPollingMixin>).restartKvs(monitorObject)
              }
            } else {
              // 新規
              console.log('[LOG] add monitor object', newMatching)

              // もし、シグナリングチャンネルが妥当でない場合は、一度マッチングを解除する
              // これは前回のマッチング処理のゴミ情報と思われる ログアウト処理を正しく行わなかった場合に残るもの
              if (!SignalingChannel.isValid(newMatching.signalingChannel)) {
                console.log('[KVS LOG] invalid signalingchannel', newMatching.signalingChannel)
                this.$store.dispatch(matchingTypes.ACTION_DELETE_MATCHING, {tester_id: newMatching.testerId} as DeleteMatchingRequestType)
                return
              }

              this.addMonitorObject(newMatching)
            }
          })
      },
    },
  },
  created() {
    let monitorActivateListAdapter: MonitorActivateListAdapter | null = null
    Promise.all([
      // マーキング初期取得
      this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_MARKS),
      // 固定文言初期取得
      this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_NOTIFY_LIST),
      // 「モニター割当禁止」情報取得
      new Promise((resolve, reject) => {
        this.$store.dispatch(monitorActivateListType.ACTION_MONITOR_ACTIVATE_LIST_GET_REQEUST)
          .then((adapter: MonitorActivateListAdapter) => {
            monitorActivateListAdapter = adapter

            resolve(true)
          })
          .catch(reject)
      }),
    ])
    .finally(() => {
      // モニターオブジェクトを初期化
      Object.values(this.monitorObjects).forEach((monitorObject) => {
        this.clearMonitorObject(monitorObject)
        if (monitorActivateListAdapter) {
          this.updateMonitorObject(monitorObject, {activation: monitorActivateListAdapter.monitors.includes(monitorObject.monitorId)})
        }
      })

      this.$kvsEventBus.$on('viewer-dataMessage', (event: {matching: Matching, messageObject: MessageObject}) => {
        const monitorObject = this.findMonitorObjectByMatching(event.matching)
        if (!monitorObject) {
          return
        }

        this.addChatItem(
          monitorObject!,
          {
            sender: ChatItemSender.EXAMINEE,
            message: event.messageObject.message,
            messageObject: event.messageObject,
          }
        )
      })
      this.$kvsEventBus.$on('viewer-dataMessage-done', (event: {matching: Matching, messageObject: MessageObject}) => {
        const monitorObject = this.findMonitorObjectByMatching(event.matching)
        if (!monitorObject) {
          return
        }

        this.changeChatItemChatItemSentAt(monitorObject!, {messageObject: event.messageObject})
      })
      this.$kvsEventBus.$on('viewer-track', (event: {matching: Matching, mediaStream: MediaStream | null}) => {
        const monitorObject = this.findMonitorObjectByMatching(event.matching)
        if (!monitorObject) {
          return
        }
        this.updateMonitorObject(monitorObject!, {data: {mediaStream: event.mediaStream}})
      })
      this.$kvsEventBus.$on('viewer-audioProcess', (event: {matching: Matching, audioSize: number}) => {
        const monitorObject = this.findMonitorObjectByMatching(event.matching)
        if (!monitorObject) {
          return
        }
        this.updateMonitorObject(monitorObject!, {data: {audioSize: event.audioSize}})
      })

      // モニターオブジェクトを更新するポーリング処理を実行する
      const func = () => {
        Object.values(this.monitorObjects).forEach((monitorObject) => {
          if (!monitorObject.data.matching) {
            return
          }

          this.updateMonitorObject(monitorObject, {data: {elapsedTime: Matching.generateElapsedTime(monitorObject.data.matching!)}})
        })
      }
      func()
      this.timeInterval = setInterval(func, 1000)
    })
    .finally(() => {
      // マッチングを開始する
      (this as InstanceType<typeof CheckerMatchingPollingMixin>).startMatching()
    })
  },
  beforeDestroy() {
    this.$kvsEventBus.$off('viewer-dataMessage')
    this.$kvsEventBus.$off('viewer-dataMessage-done')
    this.$kvsEventBus.$off('viewer-track')
    this.$kvsEventBus.$off('viewer-audioProcess')

    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null
    }

    (this as InstanceType<typeof CheckerMatchingPollingMixin>).stopMatching()
  },
  methods: {
    /**
     * モニターオブジェクトを追加します
     *
     * @param {Matching} matching
     */
    addMonitorObject(matching: Matching): Promise<boolean> {
      // 空いているモニターを検索する
      const isEmpty = (monitorObject: MonitorObject | null): boolean => {
        if (!monitorObject) {
          return false
        }
        return !monitorObject!.data.matching && monitorObject!.activation 
      }
      let found = Object.values(this.monitorObjects).find((monitorObject: MonitorObject) => isEmpty(monitorObject)) as (MonitorObject | null)
      if (!found) {
        return Promise.reject(new Error('[LOG] 割り当てられるモニターが開いていません'))
      }
      const monitorObject = found!

      this.clearMonitorObject(monitorObject);
      this.updateMonitorObject(monitorObject, {data: {matching: matching}})
      if (!this.monitoringTesterCacheMap[matching.testerId]) {
        this.monitoringTesterCacheMap[matching.testerId] = {chatItems: []}
      }

      return new Promise((resolve, reject) => {
        Promise.all([
          // MediaStream
          new Promise((resolve, reject) => {
            (this as InstanceType<typeof CheckerMatchingPollingMixin>).startKvs(matching)
              .then(() => {

                this.updateMonitorObject(monitorObject, {data: {mediaStream: (this as InstanceType<typeof CheckerMatchingPollingMixin>).getMediaStream(monitorObject)}})
                resolve(true)
              })
              .catch(reject)
          }),
          // 認証画像
          new Promise((resolve, reject) => {
            const loadAiHeadShot = () => {
              return new Promise((resolve, reject) => {
                const testerId = matching.testerId
                this.$store.dispatch(aiAuthStatusType.ACTION_REQUEST_GET_AI_AUTH_STATUS, testerId)
                  .then((adapter: AiAuthStatusAdapter) => {
                    if (!monitorObject.data.matching || monitorObject.data.matching!.testerId != testerId) {
                      reject(new Error(''))
                      return
                    }

                    if(adapter.status === 3) {
                      const headShotUrl = adapter.faceUrl
                      if (headShotUrl) {
                        this.updateMonitorObject(monitorObject, {data: {headShotUrl: headShotUrl, headShotUrlLastUpdatedAt: Date.now()}})
                      }
                      const idCardUrl = adapter.idCardUrl
                      if (idCardUrl) { 
                        this.updateMonitorObject(monitorObject, {data: {idCardUrl: idCardUrl, idCardUrlLastUpdatedAt: Date.now()}})
                      }
                      resolve(true)
                    } else {
                      resolve(false)
                    }
                  })
                  .catch((err: any) => {
                    console.error(err);
                    reject(err)
                  })
              })
            };
            const loadHeadShot = () => {
              return new Promise((resolve, reject) => {
                const testerId = matching.testerId
                this.$store.dispatch(testerHeadShotTypes.ACTION_TESTER_HEAD_SHOT_GET, {
                  tester_id: testerId,
                } as TesterHeadShotGetRequestType)
                  .then((adapter: TesterHeadShotAdapter) => {
                    if (!monitorObject.data.matching || monitorObject.data.matching!.testerId != testerId) {
                      reject(new Error(''))
                      return
                    }

                    if (!adapter.url) {
                      return resolve(false)
                    }
                    const headShotUrl = adapter.url!

                    this.updateMonitorObject(monitorObject, {data: {headShotUrl: headShotUrl, headShotUrlLastUpdatedAt: Date.now()}})
                    resolve(true)
                  })
                  .catch((e: any) => {
                    reject(e)
                  })
              })
            };

            if (matching.startupParameters.isProctor) {
              // 監視ありの場合
              if (matching.startupParameters.isAiAuth == 2) {
                // 「AI本人認証」の場合、認証画像を読み込む
                return loadAiHeadShot()
              } else if (matching.testerStatus >= TesterState.IDENTIFICATED) {
                // 受験者ステータスが「認証済み」以上の場合、
                return loadHeadShot()
              } else {
                return Promise.resolve(true)
              }
            } else {
              return Promise.resolve(true)
            }
          }),
          // ChatItem
          new Promise((resolve, reject) => {
            const cache = this.monitoringTesterCacheMap[matching.testerId]
            if (!cache) {
              resolve(true)
            }
            const chatItems = ([] as ChatItem[]).concat(
              cache!.chatItems,
              monitorObject.data.chatItems
            )
            this.updateMonitorObject(monitorObject, {data: {chatItems: chatItems}})

            resolve(true)
          })
        ])
        .then(() => resolve(true))
        .catch(reject)
      })
    },
    /**
     * モニターオブジェクトを削除します
     *
     * @param {Matching} matching
     */
    removeMonitorObjectIfExists(matching: Matching) {
      const monitorObject = this.findMonitorObjectByMatching(matching)
      if (!monitorObject) {
        return
      }

      (this as InstanceType<typeof CheckerMatchingPollingMixin>).stopKvs(monitorObject)
      //.then(() => {
        this.clearMonitorObject(monitorObject)
      //})
    },
    /**
     * モニターオブジェクトを検索します
     *
     * @param {Matching} matching
     * @return {MonitorObject | null}
     */
    findMonitorObjectByMatching(matching: Matching): MonitorObject | null {
      return Object.values(this.monitorObjects).find((monitorObject: MonitorObject) => {
        return monitorObject.data.matching && Matching.equals(monitorObject.data.matching!, matching)
      }) as (MonitorObject | null)
    },
    /**
     * モニターオブジェクトを更新します
     *
     * TODO: 怪しい実装なので注意すること
     *
     * @param {MonitorObject} monitorObject
     * @param {{
     *          @see MonitorObject
     *        }}
     */
    updateMonitorObject(
      monitorObject: MonitorObject,
      params: {
        monitorId?: number | null;
        activation?: boolean;
        data?: {
          matching?: Matching | null;
          chatItems?: ChatItem[];
          authenticating?: boolean;
          accepted?: boolean;
          rejected?: boolean;
          elapsedTime?: string;
          mediaStream?: MediaStream | null;
          muted?: boolean;
          audioSize?: number;
          headShotUrl?: string;
          headShotUrlLastUpdatedAt?: number | null;
          idCardUrl?: string;
          idCardUrlLastUpdatedAt?: number | null;
        };
      }
    ) {
      const update = (object: any, params: any, keyPathes: string[]) => {
        for (const [k, v] of Object.entries(params)) {
          if (
            !{}.hasOwnProperty.call(object, k)
            || !{}.hasOwnProperty.call(params, k)
          ) {
            continue
          }
          const fullPathKey = keyPathes.concat([k]).join('.')
          if (fullPathKey == 'data') {
            update(object[k], v, keyPathes.concat([k]))
          } else {
           this.$set(object, k, v)
          }
        }
      }

      update(monitorObject, params, [])
    },
    /**
     * モニターオブジェクトをクリアします
     *
     * @param {MonitorObject} monitorObject
     */
    clearMonitorObject(monitorObject: MonitorObject) {
      this.updateMonitorObject(
        monitorObject,
        {
          //monitorId: monitorObject.monitorId,
          //activation: monitorObject.activation,
          data: {
            matching: null,
            chatItems: [] as ChatItem[],
            authenticating: false,
            accepted: false,
            rejected: false,
            elapsedTime: '--:--:--',
            mediaStream: null,
            muted: false,
            audioSize: 0,
            headShotUrl: '',
            headShotUrlLastUpdatedAt: null,
            idCardUrl: '',
            idCardUrlLastUpdatedAt: null,
          },
        }
      )
    },
    /**
     * サブモニタクリック時のイベントハンドラ サブとメインを入れ替える
     *
     * @param {MonitorObject} monitorObject
     * @return {Promise<boolean>}
     */
    changeMainMonitor(monitorObject: MonitorObject): Promise<boolean> {
      if (this.monitorPageAdapter.inAuth) {
        return Promise.resolve(false)
      }

      const mainMonitorObject = this.monitorObjects[1]
      if (monitorObject !== mainMonitorObject) {
        // 対象がメイン以外ならばスワップする

        // モニターアクティベートが異なるならばスワップする
        if (monitorObject.activation !== mainMonitorObject.activation) {
          const mainActivation = mainMonitorObject.activation
          const activation = monitorObject.activation

          this.setActivation(monitorObject, mainActivation)
          this.setActivation(mainMonitorObject, activation)
        }

        const mainData = mainMonitorObject.data
        const data = monitorObject.data
        this.$set(monitorObject, 'data', mainData)
        this.$set(mainMonitorObject, 'data', data)
      }

      return Promise.resolve(true)
    },
    /**
     * 「割りあて禁止」の設定/解除を行います
     *
     * @param {MonitorObject} monitorObject
     * @param {boolean} activation
     * @return {Promise<boolean>}
     */
    setActivation(monitorObject: MonitorObject, activation: boolean): Promise<boolean> {
      const oldActivation = monitorObject.activation
      // TODO: API待ちすると遅いので暫定対応
      //this.updateMonitorObject(monitorObject, {activation: activation})

      return new Promise((resolve, reject) => {
        this.$store.dispatch(monitorActivateTypes.ACTION_MONITOR_ACTIVATE_POST_REQEUST, {
          monitor_id: monitorObject.monitorId,
          activation: activation,
        } as MonitorActivateRequestType)
          .then((adapter: MonitorActivateAdapter) => {
            // TODO: なんかちらつくので、暫定
            this.updateMonitorObject(monitorObject, {activation: adapter.activation})
            resolve(true)
          })
          .catch((err: any) => {
            console.error(err)
            // TODO: 書き戻さない、監視から消えたタイミングでサーバー側に更新をかける
            //this.updateMonitorObject(monitorObject, {activation: oldActivation})

            reject(err)
          })
      })
    },
    /**
     * チャットアイテムを追加します
     *
     * @param {MonitorObject} monitorObject
     * @param {{
     *          message: string;
     *          sender: ChatItemSender;
     *          messageObject: MessageObject;
     *        }} params
     * @return {Promise<boolean>}
     */
    addChatItem(
      monitorObject: MonitorObject,
      params: {
        message: string;
        sender: ChatItemSender;
        messageObject: MessageObject
      }
    ): Promise<boolean> {
      const chatItem = {
        sender: params.sender,
        message: params.message,
        elapsedTime: Matching.generateElapsedTime(monitorObject.data.matching),

        sendAt: new Date(),
        sentAt: ((params.sender == ChatItemSender.EXAMINEE) ? new Date() : null),
        hasError: false,

        relationalMessageObject: params.messageObject,
      } as ChatItem;

      monitorObject.data.chatItems.push(chatItem)
      this.monitoringTesterCacheMap[monitorObject.data.matching!.testerId]!.chatItems.push(chatItem)

      if (
        (chatItem.sender == ChatItemSender.PROCTOR)
        && (chatItem.sentAt == null)
      ) {
        // 追加されてから一定時間、送信完了時間がnullから変更されない場合、送信が成功していないと判定する
        setTimeout(() => {
          if (chatItem.sentAt == null) {
            const setError = () => {
              this.$set(chatItem, 'hasError', true)
            }

            // 念のため、DBに格納されているデータを確認 送信されているか確認する
            // TODO: DBにはユニークキーが存在しないので厳密に完全一致したデータかを調べる手段はない
            // TODO: また、chatItem.sendAtはフロントPCの時間でmessage.createdAtはサーバーの時間なのでただ行く比較できる保証がない
            this.$store.dispatch(webrtcMessageTypes.ACTION_WEBRTC_MESSAGE_GET, {tester_id: monitorObject.data.matching!.testerId} as WebRTCMessageGetRequestType)
              .then((adapter: WebRTCMessageGetAdapter) => {
                const found = adapter.messages
                  .find((v: Message) => ((v.message === chatItem.message) && ((new Date(v.createdAt).getTime()) >= chatItem.sendAt.getTime())))

                if (!found) {
                  setError()
                }
              })
              .catch(() => {
                setError()
              })
          }
        },  5000)
      }

      return Promise.resolve(true)
    },
    /**
     * チャットアイテムの送信時間を変更します
     *
     * @param {MonitorObject} monitorObject
     * @param {{
     *          messageObject: MessageObject;
     *        }} params
     * @return {Promise<boolean>}
     */
    changeChatItemChatItemSentAt(monitorObject: MonitorObject, params: {messageObject: MessageObject;}): Promise<boolean> {
      const found = monitorObject.data.chatItems.find((chatItem: ChatItem) => chatItem.relationalMessageObject.uniqueKey == params.messageObject.uniqueKey)
      if (found) {
        const chatItem = found!

        this.$set(chatItem, 'sentAt', Date.now())
        this.$set(chatItem, 'hasError', false)
      }

      return Promise.resolve(true)
    },
    /**
     * 認証中の設定/解除を行います
     *
     * @param {MonitorObject} monitorObject
     * @param {boolean} muted
     * @return {Promise<boolean>}
     */
    setAuthenticating(monitorObject: MonitorObject, authenticating: boolean): Promise<boolean> {
      this.updateMonitorObject(monitorObject, {data: {authenticating: authenticating}})
      return Promise.resolve(true)
    },
    /**
     * acceptedの設定/解除を行います
     *
     * @param {MonitorObject} monitorObject
     * @param {boolean} muted
     * @return {Promise<boolean>}
     */
    setAccepted(monitorObject: MonitorObject, accepted: boolean): Promise<boolean> {
      this.updateMonitorObject(monitorObject, {data: {accepted: accepted}})
      return Promise.resolve(true)
    },
    /**
     * rejectedの設定/解除を行います
     *
     * @param {MonitorObject} monitorObject
     * @param {boolean} muted
     * @return {Promise<boolean>}
     */
    setRejected(monitorObject: MonitorObject, rejected: boolean): Promise<boolean> {
      this.updateMonitorObject(monitorObject, {data: {rejected: rejected}})
      return Promise.resolve(true)
    },
    /**
     * muteの設定/解除を行います
     *
     * @param {MonitorObject} monitorObject
     * @param {boolean} muted
     * @return {Promise<boolean>}
     */
    setMuted(monitorObject: MonitorObject, muted: boolean): Promise<boolean> {
      this.updateMonitorObject(monitorObject, {data: {muted: muted}})
      return Promise.resolve(true)
    },
    /**
     * 認証画像の更新が必要か
     *
     * @param {MonitorObject} monitorObject
     * @return {boolean}
     */
    isNeedUpdateHeadShot(monitorObject: MonitorObject): boolean {
      // TODO:「認証画像」を更新しない
      return false;

      if (!monitorObject.data.matching) {
        return false
      }
      if (monitorObject.data.matching!.startupParameters.isProctor) {
        // 「監視あり」の場合のみ

        if (monitorObject.data.matching!.startupParameters.isAiAuth == 2) {
          // AI
          return false
        } else {
          // 「承認画像」更新から一定時間過ぎている場合
          if (
            (monitorObject.data.headShotUrlLastUpdatedAt != null)
            && (Date.now() - monitorObject.data.headShotUrlLastUpdatedAt!) >= (60 * 60 * 1000)
          ) {
            return true
          }

          return false
        }
      } else {
        return false
      }
    },
    /**
     * 認証画像の更新を行います
     *
     * @param {MonitorObject} monitorObject
     * @param {{
     *          image: string;
     *          contentType: string;
     *        }} params
     * @return {Promise<boolean>}
     */
    updateHeadShot(monitorObject: MonitorObject, params: {image: string, contentType: string}): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.$store.dispatch(testerHeadShotTypes.ACTION_TESTER_HEAD_SHOT_POST, {
          tester_id: monitorObject.data.matching!.testerId,
          image: params.image,
          content_type: params.contentType
        } as TesterHeadShotPostRequestType)
          .then((headShotAdapter: TesterHeadShotAdapter) => {
            if (!monitorObject.data.matching) {
              return
            }

            if (monitorObject.data.matching!.startupParameters.isProctor) {
              const headShotUrl = headShotAdapter.url!
              this.updateMonitorObject(monitorObject, {data: {headShotUrl: headShotUrl, headShotUrlLastUpdatedAt: Date.now()}})
            }
            resolve(true)
          })
          .catch((e: any) => {
            reject(e)
          })
      })
    },
  }
});
</script>
