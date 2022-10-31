<template>
  <div>
    <!-- 未割当受験者 -->
    <div class="table-title mt-4">
      <span class="mr-3">{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_SUMMARY }}</span>
    </div>
    <table class="table table-bordered table-striped user-list sticky-user">
      <thead>
        <tr>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_EXAM }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_STATUS }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_AUTH_CHECK }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_USE_MC_PLUS }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_EXAM_URL }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_IS_PROCTOR }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_IS_RECORD }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_IS_SUMMARY }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_MEMO }}</th>
        </tr>
      </thead>
      <tbody>
        <TesterItem
          v-for="(notMatching, index) in selectData.notMatchings"
          :key="index"
          :item="notMatching"
          @unkicked="onUnkickedFromNotMatchingList"
        />
      </tbody>
    </table>

    <!-- 強制退出済み 受験者 -->
    <div class="table-title mt-4">
      <span class="mr-3">{{ displayLang.CHECKERS_MONITORING_KICKED_USER_LIST_SUMMARY }}</span>
    </div>
    <table class="table table-bordered table-striped user-list sticky-user">
      <thead>
        <tr>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_EXAM }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_STATUS }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_AUTH_CHECK }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_USE_MC_PLUS }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_EXAM_URL }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_IS_PROCTOR }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_IS_RECORD }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_IS_SUMMARY }}</th>
          <th>{{ displayLang.CHECKERS_MONITORING_NOT_MATCHING_LIST_HEADER_TEXT_MEMO }}</th>
        </tr>
      </thead>
      <tbody>
        <TesterItem
          v-for="(kickedUser, index) in selectData.kickedUsers"
          :key="index"
          :item="kickedUser"
          @unkicked="onUnkickedFromKickedUserList"
        />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TesterItem from './NotMatchingListChilds/TesterItem.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as pageTypes from '@/store/types/checkersMonitoringPageType';
import { CheckersMonitoringPageAdapter } from '@/store/types/adapters/checkersMonitoringPageAdapter';
import { Tester } from '@/store/types/adapters/checkersMonitoringAdapter';

export default Vue.extend({
  name: 'NotMatchingList',
  components: {
    TesterItem,
  },
  computed: {
    displayLang(): LanguageEnum { 
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    selectData(): CheckersMonitoringPageAdapter {
      return this.$store.getters[pageTypes.GETTER_CHECKERS_MONITORING_PAGE];
    },
  },
  methods: {
    onUnkickedFromNotMatchingList(item: Tester) {
      this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT_AND_CHANGE_STATUS, item.id)
    },
    onUnkickedFromKickedUserList(item: Tester) {
      this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT_AND_FILTER_KICKED_USERS, item.id)
    },
  },
});
</script>

<style scoped>
</style>
