<template>
  <thead>
    <tr>
      <th>{{ displayLang.CHECKERS_MONITORING_MATCHING_LIST_HEADER_TEXT_MONITOR }}</th>
      <th>{{ displayLang.CHECKERS_MONITORING_MATCHING_LIST_HEADER_TEXT_TESTER_01 }}</th>
      <th>{{ displayLang.CHECKERS_MONITORING_MATCHING_LIST_HEADER_TEXT_TESTER_02 }}</th>
      <th>{{ displayLang.CHECKERS_MONITORING_MATCHING_LIST_HEADER_TEXT_TESTER_03 }}</th>
      <th>{{ displayLang.CHECKERS_MONITORING_MATCHING_LIST_HEADER_TEXT_TESTER_04 }}</th>
      <th>{{ displayLang.CHECKERS_MONITORING_MATCHING_LIST_HEADER_TEXT_TESTER_05 }}</th>
    </tr>
  </thead>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  name: 'Header',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style scoped>
</style>
