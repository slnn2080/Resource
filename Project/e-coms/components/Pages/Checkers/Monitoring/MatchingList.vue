<template>
  <div>
    <div class="table-title">{{ displayLang.CHECKERS_MONITORING_MATCHING_LIST_SUMMARY }}</div>
    <table class="table table-bordered table-striped user-list sticky-proctor">
      <Header />
      <tbody>
        <MatchingItem v-for="(matching, index) in selectData.matchings" :key="index" :matching="matching" />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './MatchingListChilds/Header.vue';
import MatchingItem from './MatchingListChilds/MatchingItem.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as pageTypes from '@/store/types/checkersMonitoringPageType';
import { CheckersMonitoringPageAdapter } from '@/store/types/adapters/checkersMonitoringPageAdapter';
export default Vue.extend({
  name: 'MatchingList',
  components: {
    Header,
    MatchingItem,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    selectData(): CheckersMonitoringPageAdapter {
      return this.$store.getters[pageTypes.GETTER_CHECKERS_MONITORING_PAGE];
    },
  },
});
</script>

<style scoped>
</style>
