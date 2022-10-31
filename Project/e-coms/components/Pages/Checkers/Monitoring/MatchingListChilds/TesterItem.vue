<template>
  <td>
    <table
      v-if="tester.id"
      class="table-borderless table-column"
    >
      <tbody>
        <tr>
          <td>
            <a
              href="#"
              @click.stop="onClickName"
            >
              {{ tester.exLoginId }}
              <br />
              ({{ tester.examName }})
            </a>
          </td>
          <td>
            <a
              href="#"
              class="btn btn-outline-danger btn-sm"
              @click.stop="onClickKickOut"
            >{{ displayLang.MONITORING_KICK_OUT }}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</template>

<script lang="ts">
import Vue from 'vue';
import { Tester } from '~/store/types/adapters/checkersMonitoringAdapter';
import { LanguageEnum } from '~/store/enum/language';
import * as pageTypes from '@/store/types/checkersMonitoringPageType';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from "~/store/types/commonType";
import * as examineeLoginPageTypes from '@/store/types/examineeLoginPageType';
import { TesterDetailRequestType, TesterDetailParamLatestMode } from '@/store/types/adapters/testerDetailAdapter';

export default Vue.extend({
  name: 'TesterItem',
  props: {
    tester: {
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
    onClickName() {
      const examUserId = this.tester.id;

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
    onClickKickOut() {
      const displayLang = this.displayLang as any;
      if (confirm(displayLang.MONITORING_KICK_OUT_CONFIRM)) {
        this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_KICK_OUT, this.tester.id)
          .then(() => this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_GET_MONITORINGS));
      }
    }
  }
});
</script>

<style scoped>
</style>
