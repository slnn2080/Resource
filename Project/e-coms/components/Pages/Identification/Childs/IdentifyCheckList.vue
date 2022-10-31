<template>
  <div class="auth-list">
    <template v-if="!selectData.isIdentifyCheckNG">
      <div class="headline">{{ displayLang.IDENTIFY_CHECK_LIST_LABEL }}</div>
      <ol>
        <IdentifyCheckListItem :text="displayLang.IDENTIFY_CHECK_ITEM_LICENSE" item-id="auth-check1" :checked="true" />
        <IdentifyCheckListItem
          :text="displayLang.IDENTIFY_CHECK_ITEM_PENDING"
          item-id="auth-check2"
          :checked="isAuthenticating"
        />
        <IdentifyCheckListItem
          :text="displayLang.IDENTIFY_CHECK_ITEM_FINISHED"
          item-id="auth-check3"
          :checked="selectData.isIdentityCheckFinished"
        />
      </ol>
    </template>
    <button v-if="enableNextButton" type="button" class="btn btn-light btn-block" :disabled="selectData.disconnect" @click="onClickNext()">
      {{ displayLang.IDENTIFY_CHECK_LIST_NEXT }}
    </button>
    <template v-if="enableLogoutButton">
      <div>{{ displayLang.IDENTIFY_CHECK_LIST_REJECTED }}</div>
      <button type="button" class="btn btn-light btn-block" @click="onClickLogout()">
        {{ displayLang.IDENTIFY_CHECK_LIST_LOGOUT }}
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LanguageEnum } from '@/store/enum/language';
import { LogoutMethod } from '@/plugins/global/window';
import { TesterState } from '@/store/enum/TesterState';
import * as testerPageTypes from '@/store/types/testerPageType';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import * as testerKickOutTypes from '@/store/types/testerKickOutType';
import IdentifyCheckListItem from '@/components/Pages/Identification/Childs/IdentifyCheckListItem.vue';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import TesterMatchingPollingMixin from '@/components/Mixins/TesterMatchingPollingMixin';

export default Vue.extend({
  components: {
    IdentifyCheckListItem
  },
  mixins: [
    TesterMatchingPollingMixin,
  ],
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    selectData(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
    /**
     * 「認証中」か調べます
     *
     * @return {boolean}
     */
    isAuthenticating(): boolean {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_AUTHENTICATING]
    },
    /**
     * [次へ]ボタン表示フラグ マッチングしている「監視者」が「承認」をしたことでフラグが変更されます
     *
     * @return {boolean}
     */
    enableNextButton(): boolean {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_ACCEPTED]
    },
    /**
     * [ログイン]ボタン表示フラグ マッチングしている「監視者」が「拒否」をしたことでフラグが変更されます
     *
     * @return {boolean}
     */
    enableLogoutButton(): boolean {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_REJECTED]
    },
  },
  watch: {
    /**
     * [次へ]ボタン表示フラグの変更を監視します。マッチングしている「監視者」が「承認」をしたことでフラグが変更されます
     *
     * @param {boolean} newValue
     * @param {boolean} oldValue
     * @return {boolean}
     */
    enableNextButton(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        // 監視なしの場合はここで、KVSとmatching.phpのポーリングを止める
        if (this.inParams.isProctor === 0) {
          (this as InstanceType<typeof TesterMatchingPollingMixin>).stopMatching()
        }
      }
    },
    /**
     * [ログアウト]ボタン表示フラグの変更を監視します。マッチングしている「監視者」が「拒否」をしたことでフラグが変更されます
     *
     * @param {boolean} newValue
     * @param {boolean} oldValue
     */
    enableLogoutButton(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        // 監視ありなしにかかわらず、KVSとmatching.phpのポーリングを止める
        (this as InstanceType<typeof TesterMatchingPollingMixin>).stopMatching()
      }
    },
  },
  methods: {
    /**
     * 「次へ」ボタン押下時のイベントハンドラ
     */
    onClickNext() {
      // 「次へ」ボタン等押下できないようにローディングフィルタをかける
      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          // 「試験」画面への遷移の場合は、テスターステータスを「試験前」に変更する必要がある
          this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_SET_TESTER_STATE, TesterState.BEFORE_EXAM)
            .then(() => this.$router.replace('/examining'))
            .then(() => resolve(true))
            .catch(reject)
        }))
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
    },
    /**
     * 「ログアウト」ボタン押下時のイベントハンドラ
     */
    onClickLogout() {
      this.$window.cleanup(LogoutMethod.LOGOUT)
    },
  }
});
</script>
