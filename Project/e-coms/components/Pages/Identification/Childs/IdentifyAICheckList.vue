<script src="../../../../nuxt.config.js"></script>
<template>
  <div class="auth-list ai-auth-list">
    <template v-if="!testerObject.isIdentifyCheckNG">
      <div class="headline">{{ displayLang.IDENTIFY_CHECK_LIST_LABEL }}</div>
      <ol>
        <template v-for="(item, index) in fixedStrAiIdentifyList">
          <IdentifyCheckListItem
            :key="index"
            :text="item.str"
            :item-id="`auth-ai-check-${index}`"
            :checked="item.check"
          />
        </template>
      </ol>
    </template>

    <!-- AI本人認証 -->
    <button
      v-if="nextBtnFlg"
      type="button"
      class="btn btn-light btn-block"
      @click="throttle(onClickNext)"
    ><template>{{ displayLang.IDENTIFY_CHECK_LIST_NEXT }}</template></button>
    <button
      v-else-if="retryLimitedBtnFlg && this.inParams.isAiFaildManual !== 1"
      type="button"
      class="btn btn-light bnt-block"
      @click="throttle(onClickNext)"
    >
      <template v-if="this.inParams.isAiFaildManual === 2">{{
        displayLang.AI_IDENTIFICATION_CHECK_LIST_FOR_CHECKER
        }}</template>
      <template v-else-if="this.inParams.isAiFaildManual === 3">{{
        displayLang.IDENTIFY_CHECK_LIST_NEXT
        }}</template>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { throttle } from 'lodash';
import StartupAdapter from '~/store/types/adapters/startupAdapter';
import { LogoutMethod } from '@/plugins/global/window';
import * as testerPageTypes from '~/store/types/testerPageType';
import * as rootTypes from '~/store/types/rootType';
import * as loginTypes from '~/store/types/loginType';
import * as commonTypes from '~/store/types/commonType';
import * as matchingType from '~/store/types/matchingType';
import * as faceType from '~/store/types/faceType';
import * as idCardType from '~/store/types/idCardType';
import { LanguageEnum } from '~/store/enum/language';
import IdentifyCheckListItem from '~/components/Pages/Identification/Childs/IdentifyCheckListItem.vue';
import { TesterPageAdapter } from '~/store/types/adapters/testerPageAdapter';
import { LoginAdapter } from '~/store/types/adapters/loginAdapter';
import { Endpoint } from '~/store/const/endpoint';
import { TesterState } from '~/store/enum/TesterState';
import { Matching } from '~/store/types/adapters/matchingAdapter';
import { FaceAdapter } from '~/store/types/adapters/faceAdapter';
import { IdCardAdapter } from '~/store/types/adapters/idCardAdapter';
import { TesterAdapter } from '~/store/types/adapters/testerAdapter';
import { StepbarState } from '~/store/enum/StepbarState';
import TesterMatchingPollingMixin from '@/components/Mixins/TesterMatchingPollingMixin';

export default Vue.extend({
  name: 'IdentifyAICheckList',
  components: {
    IdentifyCheckListItem
  },
  mixins: [
    TesterMatchingPollingMixin,
  ],
  props: {
    identifyIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      prevFaceStatus: 0,
      prevIdCardStatus: 0,
      nextBtnFlg: false,
      isOneTime: true,
      throttle: throttle((fn) => fn(), 3000)
    };
  },
  computed: {
    retryLimitedBtnFlg(): boolean {
      const faceRetryNumber = this.faceObject.faceRetry;
      const idCardRetryNumber = this.idCardObject.idCardRetry;
      const limitNumberOfFace = this.inParams.aiFaceRetry;
      const limitNumberOfIdCard = this.inParams.aiIdcardRetry;
      const countRetryNum = this.testerObject.countRetryNum;
      const limitAllNumber = this.inParams.aiAllRetry;

      const f_status = this.faceObject.status;
      const i_status = this.idCardObject.status;
      const status = (this.faceObject.updatedAt > this.idCardObject.updatedAt) ? this.faceObject.status : this.idCardObject.status;

      if ((faceRetryNumber >= limitNumberOfFace && (status===0 || status===2)) ||
        (faceRetryNumber > limitNumberOfFace && status === 1) ||
        (idCardRetryNumber >= limitNumberOfIdCard && status < 2) ||
        (idCardRetryNumber > limitNumberOfIdCard && status === 2) ||
        (countRetryNum >= limitAllNumber && status !== 3)) {
        if (this.inParams.isAiFaildManual === 1) {
          setTimeout(() => this.forcedLogout(), 3000);
        }
        return true;
      }
      return false;
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerObject(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
    faceObject(): FaceAdapter {
      return this.$store.getters[faceType.GETTER_FACE];
    },
    idCardObject(): IdCardAdapter {
      return this.$store.getters[idCardType.GETTER_ID_CARD];
    },
    fixedStrAiIdentifyList(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE].fixedStrAiIdentifyList;
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
    matchings(): Matching[] {
      return (this as InstanceType<typeof TesterMatchingPollingMixin>).getMatchings()
    }
  },
  created() {
    this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_FIXED_STR_AI_DISPLAY, this.identifyIndex);
    this.$nuxt.$on('identifyNextBtnHandler', (bool: boolean) => {
      this.nextBtnFlg = bool;
    });
  },
  methods: {
    nextToExaminingPage() {
      // 「監視なしand本人認証なし」 or「監視なし」は、マッチングしないで受験前ページへ
      if (this.inParams.isProctor === 0 && this.inParams.isAuth === 0 || this.inParams.isProctor === 0) {
        this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
          .then(() => new Promise((resolve, reject) => {
            // 「試験」画面への遷移の場合は、テスターステータスを「試験前」に変更する必要がある
            this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.BEFORE_EXAM)
              .then(() => this.$router.replace('/examining'))
              .then(() => resolve(true))
              .catch(reject)
          }))
          .catch((error) => this.displayError(error))
          .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
      } else {
        this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
          .then(() => new Promise((resolve, reject) => {
            (this as InstanceType<typeof TesterMatchingPollingMixin>).startMatching({waitForMatching: false})
              .then((bool) => {
                // 「試験」画面への遷移の場合は、テスターステータスを「試験前」に変更する必要がある
                this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.BEFORE_EXAM)
                  .then(() => this.$router.replace('/examining'))
                  .then(() => resolve(true))
                  .catch(reject)
              })
              .catch(reject)
          }))
          .catch((error) => this.displayError(error))
          .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
      }
    },
    nextToIdentifyPage() {
      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          (this as InstanceType<typeof TesterMatchingPollingMixin>).startMatching({waitForMatching: false}) // 「認証」画面遷移の場合は、「認証」画面側でマッチングの完了を待つ
            .then((bool) => {
              // このタイミングでは、matching.phpの初回呼び出しで、TesterState.MATCHEDにステータス変更が行われている。
              //this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.MATCHED);
              Promise.resolve(true)
                .then(() => this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_STEPBAR_STATE, StepbarState.IDENTIFICATION))
                .then(() => this.$router.replace('/identification'))
                .then(() => resolve(true))
                .catch(reject)
            })
            .catch(reject)
        }))
        .catch((error) => this.displayError(error))
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
    },
    onClickNext() {
      if (this.isOneTime) {
        this.isOneTime = false;
        if (!this.retryLimitedBtnFlg && this.nextBtnFlg) {
          // 1. AI本人認証の正常パターン
          this.nextToExaminingPage();
        } else if (this.retryLimitedBtnFlg && this.inParams.isAiFaildManual === 2) {
          // 2. AI本人認証がNGでリトライ回数を超えたとき監視者へつなぐ処理と、通常の「本人認証」ページ遷移のパターン
          this.nextToIdentifyPage();
        } else if (this.retryLimitedBtnFlg && this.inParams.isAiFaildManual === 3) {
          // 3. AI本人認証がNGでリトライ回数を超えたとき「受験前」ページへ続行するパターン
          this.nextToExaminingPage();
        }
      }
    },
    displayError(error: any) {
      console.log(error);
    },
    forcedLogout() {
      // 強制ログアウト(強制退出)
      this.$window.cleanup(LogoutMethod.KICK_OUT_PUT_MYSELF_AI)
    }
  }
});
</script>
