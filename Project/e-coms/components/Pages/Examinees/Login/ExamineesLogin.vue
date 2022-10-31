<template>
  <div class="section">
    <div class="headline">{{ displayLang.EXAMINEE_LOGIN_TITLE}}</div>
    <div class="row">
      <Detail />
      <LogList />
    </div>
    <nuxt-link to="/checkers/monitoring">{{ displayLang.EXAMINEE_LOGIN_DETAIL_BUTTONS_BACK }}</nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Detail from './Childs/Detail.vue';
import LogList from './Childs/LogList.vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  name: 'ExamineesLogin',
  components: {
    Detail,
    LogList,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style scoped>

</style>
