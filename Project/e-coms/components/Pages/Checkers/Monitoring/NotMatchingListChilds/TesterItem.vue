<template>
  <tr class="clickable" @click="onClickTr">
    <td>
      {{ item.exLoginId }}
      <br />
      ({{ item.examName }})
    </td>
    <td>
      <span class="mr-3">{{ formatMatchingStatus(this.item.matchingStatus) }}</span>
      <a
        v-if="item.kicked"
        href="#"
        class="btn btn-outline-danger btn-sm"
        @click.prevent.stop="$emit('unkicked', item)"
      >{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_DELETE_BUTTON_LABEL }}</a>
    </td>
    <td class="text-center">{{ formatIsUse(item.startupParameters.isAuth) }}</td>
    <td class="text-center">{{ formatIsUse(item.isMcStartup) }}</td>
    <td style="word-break: break-all;"><a v-if="!!item.examUrl" :href="item.target" target="_blank" @click.stop="">{{ item.examUrl }}</a></td>
    <td class="text-center">{{ formatIsUse(item.startupParameters.isProctor) }}</td>
    <td class="text-center">{{ formatIsUse(item.startupParameters.isRecord) }}</td>
    <td class="text-center">{{ formatIsUse(item.startupParameters.isSummary) }}</td>
    <td style="word-break: break-word;">{{ item.startupParameters.memo }}</td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as pageTypes from '@/store/types/checkersMonitoringPageType';
import * as commonTypes from "~/store/types/commonType";
import { TesterDetailRequestType, TesterDetailParamLatestMode } from '@/store/types/adapters/testerDetailAdapter';
import * as examineeLoginPageTypes from '@/store/types/examineeLoginPageType';
import { Tester } from '@/store/types/adapters/checkersMonitoringAdapter';
import TesterDetailFormatMixin from '@/components/Mixins/TesterDetailFormatMixin';

export default Vue.extend({
  name: 'TesterItem',
  mixins: [
    TesterDetailFormatMixin,
  ],
  props: {
    item: {
      type: Tester,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
    onClickTr() {
      const examUserId = this.item.id;

      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => {
          return Promise.all([
            this.$store.dispatch(examineeLoginPageTypes.ACTION_EXAMINEE_LOGIN_PAGE_GET_TEST, {user_id: examUserId, test_id: null, latest_mode: TesterDetailParamLatestMode.EXAMINING_LATEST } as TesterDetailRequestType),
          ])
            .then(() => this.$router.push('/examinees/' + examUserId + '/login'))
            .catch(() => {});
        })
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false));
    },
    onClickDeleteButton() {
      this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT, this.item.id)
        .then(() => this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_GET_MONITORINGS));
    },
    /**
     * 「割当待ち」「保留」に変換します
     *
     * @param {any} matchingStatus
     * @return {string}
     */
    formatMatchingStatus(matchingStatus: any): string {
      let r = '';
      if (matchingStatus == 1) {
        r += (this.displayLang as any).CHECKERS_MONITORING_NOT_MATCHING_LIST_MATCHING_STATE_WAIT
      } else {
        r += (this.displayLang as any).CHECKERS_MONITORING_NOT_MATCHING_LIST_MATCHING_STATE_ON_HOLD
      }
      if (this.item.loginId == null) {
          r += '(未ログイン)'
      } else {
          r += '(ログイン済み)'
      }
      return r;
    },
  },
});
</script>

<style scoped>
</style>
