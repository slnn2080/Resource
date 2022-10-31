import Vue from 'vue';
import { ComponentOptions } from 'vue/types/options';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '@/store/enum/language';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import * as testerPageTypes from '@/store/types/testerPageType';
import { MatchingStatus } from '@/store/enum/MatchingStatus';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { KvsDataType, MessageObject, getMessageUniqueKey } from '@/plugins/kvs/type/sendMessageType';

export default Vue.extend({
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
  },
  methods: {
    /**
     * マッチングを開始します
     *
     * @param {{
     *          waitForMatching?:boolean
     *        }} options
     * @return {Promise<boolean>}
     */
    startMatching(options: {waitForMatching?:boolean}): Promise<boolean> {
      if (
        (this.inParams.isAuth != 1)
        && (this.inParams.isProctor != 1)
      ) {
        return Promise.resolve(true)
      }
      console.log('[LOG INFO] call TesterMatchingPollingMixin.startMatching()')

      return new Promise((resolve, reject) => {
        const matchingPromise = this.$testerMatchingPollinger.startMatchingPolling()

        const waitPromise = options.waitForMatching
          ? this.waitForMatching()
          : Promise.resolve(true)

        waitPromise
          .then((result) => resolve(result))
          .catch(reject)
      })
    },
    /**
     * 必要であれば、マッチング等を切断します
     *
     * @return {Promise<boolean>}
     */
    stopMatching(): Promise<boolean> {
      if (
        (this.inParams.isAuth != 1)
        && (this.inParams.isProctor != 1)
      ) {
        return Promise.resolve(true)
      }
      console.log('[LOG INFO] call TesterMatchingPollingMixin.stopMatching()')

      return this.$testerMatchingPollinger.stopMatchingPolling()
    },
    /**
     * 接続の確立を待ちます
     *
     * @return {Promise<boolean>}
     */
    waitForMatching(): Promise<boolean> {
      const isStarted = this.$testerMatchingPollinger.isStartedMatchingPolling()
      if (isStarted) {
        return new Promise((resolve, reject) => {
          const isConnected = ():boolean => {
            const matchings = this.getMatchings()
            return ((matchings.length > 0) && (matchings[0].matchingStatus === MatchingStatus.CONNECTED))
          }

          if (isConnected()) {
            resolve(true)
            return
          }
          let counter = (this.inParams.matchingTimeout * 2)
          let timerId: number | null = window.setInterval(() => {
            try {
              if (isConnected()) {
                if (timerId != null) {
                  window.clearInterval(timerId)
                  timerId = null
                }
                resolve(true)
                return
              }

              // コネクションが確立するまで無限ループ
              // counter --
              // if (counter <= 0) {
              //   throw new Error(`[LOG INFO] マッチング処理を中止します`)
              // }
            } catch (e) {
              if (timerId != null) {
                window.clearInterval(timerId)
                timerId = null
              }
              reject(e)
            }
          }, 500)
        })
      } else {
        return Promise.resolve(true)
      }
    },
    /**
     * マッチング情報を取得します
     *
     * @return {Matching[]}
     */
    getMatchings(): Matching[] {
      return this.$testerMatchingPollinger.getMatchings()
    },
    /**
     * メッセージを送信します
     *
     * @param {string} message
     * @param {{}} options
     * @return {Promise<MessageObject>}
     */
    sendMasterMessage(message: string, options: {}): Promise<MessageObject> {
      const messageObject: MessageObject = Object.assign(
        {
          dataType: KvsDataType.MESSAGE,
          uniqueKey: getMessageUniqueKey('tester'),
          message: message,
          url: null,
          loginId: this.loginData.loginId as string,
          domainName: this.inParams.target
        },
        options
      )
      this.$testerMatchingPollinger.sendMasterMessage(messageObject)

      return Promise.resolve(messageObject)
    },
  },
})
