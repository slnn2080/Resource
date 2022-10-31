import Vue from 'vue';
import { ComponentOptions } from 'vue/types/options';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LoginAdapter } from '~/store/types/adapters/loginAdapter';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import * as testerPageTypes from '@/store/types/testerPageType';
import { pushMessage } from '@/static/push';
import { KvsDataType, MessageObject, getMessageUniqueKey } from '@/plugins/kvs/type/sendMessageType';

export enum MasterDataMessageType {
  DEFAULT = 0,
  NETWORK_ERROR,
}
export type MasterDataMessage = {
  masterDataMessageType: MasterDataMessageType;
  messageObject: MessageObject;
}

export default Vue.extend({
  data() {
    return {
      intervalTimer: null as NodeJS.Timeout | null,
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
    isDisconnect(): boolean {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_DISCONNECT]
    },
  },
  watch: {
    isDisconnect(newValue, oldValue) {
      if (newValue && (newValue != oldValue)) {
        this.sendNotification(
          MasterDataMessageType.NETWORK_ERROR,
          {
            dataType: KvsDataType.MESSAGE,
            uniqueKey: getMessageUniqueKey('tester'),
            message: (this.displayLang as any).IDENTIFICATION_DISCONNECT_NETWORK,
            url: null,
            loginId: this.loginData.loginId as string,
            domainName: this.inParams.target
          }
        );
      }
    },
  },
  created() {
    const func = () => {
      this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_SET_DISCONNECT, false)
    }

    func()
    this.intervalTimer = setInterval(func, (this.inParams.matchingTimeout * 1000))
  },
  destroyed() {
    if (this.intervalTimer != null) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }
  },
  methods: {
    /**
     * Notificationの通知を開始します
     *
     * @param {(masterDataMessageType: MasterDataMessageType, messageObject: MessageObject) => void} callback
     * @return {Promise<boolean>}
     */
    startNotification(callback: (masterDataMessageType: MasterDataMessageType, messageObject: MessageObject) => void): Promise<boolean> {
      // 「ネットワーク」エラーを通知するので、「監視利用」の有無は考慮せず無条件にNotificationは実行する
      // if (this.inParams.isProctor) {
        return new Promise((resolve) => {
          this.$kvsEventBus.$on('master-dataMessage', (event: any) => {
            const masterDataMessageType = event.masterDataMessageType
            const messageObject = event.messageObject as MessageObject

            callback(masterDataMessageType, messageObject)
          });
          resolve(true)
        })
      // } else {
      //   return Promise.resolve(true)
      // }
    },
    /**
     * Notificationの通知を終了します
     *
     * @return {Promise<boolean>}
     */
    stopNotification(): Promise<boolean> {
      // 「ネットワーク」エラーを通知するので、「監視利用」の有無は考慮せず無条件にNotificationは実行する
      // if (this.inParams.isProctor) {
        return new Promise((resolve) => {
          this.$kvsEventBus.$off('master-dataMessage');
          resolve(true)
        })
      // } else {
      //   return Promise.resolve(true)
      // }
    },
    /**
     * Notificationの通知にメッセージ送信をします
     *
     * @param {MasterDataMessageType} masterDataMessageType
     * @param {MessageObject} data
     */
    sendNotification(masterDataMessageType: MasterDataMessageType, messageObject: MessageObject): void {
      // ネットワークエラーを通知するので、「監視利用」の有無は考慮せず無条件にNotificationは実行する
      // if (this.inParams.isProctor) {
        this.$kvsEventBus.$emit('master-dataMessage', {masterDataMessageType: masterDataMessageType, messageObject: messageObject} as MasterDataMessage)
      // } else {
      //  // nop
      // }
    },
  },
})
