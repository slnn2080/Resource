<template>
  <table class="table table-bordered table-striped user-list">
    <thead>
      <tr>
        <Header add-class="w15p" :sort-key="1" :label="displayLang.EXAMINEES_TABLE_GROUP" />
        <Header add-class="w15p" :sort-key="2" :label="displayLang.EXAMINEES_TABLE_TEST_NAME" />
        <Header add-class="w15p" :sort-key="3" :label="displayLang.EXAMINEES_TABLE_REGION" />
        <Header add-class="w15p" :sort-key="4" :label="displayLang.EXAMINEES_TABLE_TEST_DATETIME" />
        <Header add-class="w10p" :sort-key="5" :label="displayLang.EXAMINEES_TABLE_EXAM_NAME" />
        <Header add-class="w10p" :sort-key="6" :label="displayLang.EXAMINEES_TABLE_WITH_MARK" />
        <Header add-class="w10p" :sort-key="9" :label="displayLang.EXAMINEES_TABLE_SCORE" />
        <Header add-class="w10p" :sort-key="7" :label="displayLang.EXAMINEES_TABLE_RECORD" />
      </tr>
    </thead>
    <tbody>
      <TesterItem v-for="(tester, index) in testers" :key="index" :tester="tester" />
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './Header.vue';
import TesterItem from './TesterItem.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';
import { Tester } from "~/store/types/adapters/testersAdapter";

export default Vue.extend({
  name: 'TesterList',
  components: {
    Header,
    TesterItem
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testers(): Tester[] {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_NORMAL_TESTERS];
    },
  },
});
</script>

<style scoped></style>
