import Vue from 'vue';
import { ComponentOptions } from 'vue/types/options';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '@/store/enum/language';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import { ChatItem, ChatItemSender } from '@/store/enum/ChatItem';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import { MatchingStatus } from '@/store/enum/MatchingStatus';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { KvsDataType, KvsCommand, MessageObject, CommandObject, getMessageUniqueKey } from '@/plugins/kvs/type/sendMessageType';

export default Vue.extend({
  data() {
    return {
    }
  },
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
    monitorPageAdapter(): MonitorPageAdapter {
      return this.$store.getters[monitorPageTypes.GETTER_MONITOR_PAGE]
    },
  },
  methods: {
    /**
     * マッチングを開始します
     *
     * @return {Promise<boolean>}
     */
    startMatching(): Promise<boolean> {
      console.log('[LOG INFO] call CheckerMatchingPollingMixin.startMatching()')

      return this.$checkerMatchingPollinger.startMatchingPolling()
    },
    /**
     * マッチングを停止します
     *
     * @return {Promise<boolean>}
     */
    stopMatching(): Promise<boolean> {
      console.log('[LOG INFO] call CheckerMatchingPollingMixin.stopMatching()')

      return this.$checkerMatchingPollinger.stopMatchingPolling()
    },
    /**
     * マッチング情報を取得します
     *
     * @return {Matching[]}
     */
    getMatchings(): Matching[] {
      return this.$checkerMatchingPollinger.getMatchings()
    },
    /**
     * KVSを接続します
     *
     * @param {Matching | null} matching
     * @return {Promise<boolean>}
     */
    startKvs(matching: Matching | null): Promise<boolean> {
      console.log('[LOG INFO] call CheckerMatchingPollingMixin.startKvs()')

      if (!matching) {
        return Promise.reject(new Error(''))
      }
      return this.$checkerMatchingPollinger.startKvsViewer(matching)
    },
    /**
     * KVSを停止します
     *
     * @param {Matching | null} matching
     * @return {Promise<boolean>}
     */
    stopKvs(monitorObject: MonitorObject): Promise<boolean> {
      console.log('[LOG INFO] call CheckerMatchingPollingMixin.stopKvs()')

      if (!monitorObject.data.matching) {
        return Promise.reject(new Error(''))
      }
      const matching = monitorObject.data.matching! 
      return this.$checkerMatchingPollinger.stopKvsViewer(matching)
    },
    /**
     * KVSを再接続します
     *
     * @param {MonitorObject} monitorObject
     * @return {Promise<KvsReconnectAdapter>}
     */
    restartKvs(monitorObject: MonitorObject): Promise<boolean> {
      console.log('[LOG INFO] call CheckerMatchingPollingMixin.restartKvs()')

      if (!monitorObject.data.matching) {
        return Promise.reject(new Error(''))
      }
      const matching = monitorObject.data.matching! 
      return this.$checkerMatchingPollinger.restartKvsViewer(matching)
    },
    /**
     * メッセージを送信します
     *
     * @param {MonitorObject} monitorObject
     * @param {MonitorObjectActions} monitorObjectActions
     * @param {string} message
     * @param {{
     *          sender: ChatItemSender,
     *          url: string | null,
     *        }} options
     * @param {boolean} testeOnly
     * @return {Promise<MessageObject>}
     */
    sendViewerMessage(
      monitorObject: MonitorObject,
      monitorObjectActions: MonitorObjectActions,
      message: string,
      options: {sender: ChatItemSender, url: string | null;},
      testerOnly: boolean
    ): Promise<MessageObject> {
      if (!monitorObject.data.matching) {
        return Promise.reject(new Error())
      }
      const matching = monitorObject.data.matching! 
      const kvsViewer = this.$checkerMatchingPollinger.getKvsViewer(matching)
      if (!kvsViewer) {
        return Promise.reject(new Error())
      }

      const messageObject: MessageObject = Object.assign(
        {
          dataType: KvsDataType.MESSAGE,
          uniqueKey: getMessageUniqueKey('checker'),
          message: message,
          url: null,
          loginId: this.loginData.loginId as string,
          domainName: this.inParams.target,
        },
        options
      )  
      kvsViewer.sendViewerMessage(messageObject)

      if (!testerOnly) {
        monitorObjectActions.addChatItem(
          monitorObject,
          {
            sender: options.sender,
            message: messageObject.message,
            messageObject: messageObject,
          }
        )
      }

      return Promise.resolve(messageObject)
    },
    /**
     * コマンドを送信します
     *
     * @param {MonitorObject} monitorObject
     * @param {MonitorObjectActions} monitorObjectActions
     * @param {KvsCommand} command
     * @param {{
     *          data?: string,
     *        }} options
     */
    sendViewerCommand(
      monitorObject: MonitorObject,
      monitorObjectActions: MonitorObjectActions,
      command: KvsCommand,
      options: {data?: string;}
    ): void {
      if (!monitorObject.data.matching) {
        return
      }
      const matching = monitorObject.data.matching! 
      const kvsViewer = this.$checkerMatchingPollinger.getKvsViewer(matching)
      if (!kvsViewer) {
        return
      }

      const commandObject: CommandObject = Object.assign(
        {
          dataType: KvsDataType.COMMAND,
          command: command,
        },
        options
      )
      kvsViewer.sendViewerCommand(commandObject)
    },
    /**
     * MediaStreamを取得します
     *
     * @param {MonitorObject} monitorObject
     * @return {MediaStream | null}
     */
    getMediaStream(monitorObject: MonitorObject): MediaStream | null {
      if (!monitorObject.data.matching) {
        return null
      }
      const matching = monitorObject.data.matching! 
      const kvsViewer = this.$checkerMatchingPollinger.getKvsViewer(matching)
      if (!kvsViewer) {
        return null
      }
      return kvsViewer.getMediaStream()
    },
  },
})
