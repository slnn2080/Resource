<template>
  <div class="mt-4 mb-4">
    <div class="page-title">{{ displayLang.CHECKERS_MONITORING_PAGE_TITLE }}</div>
    <!-- 「未割り当て受験者」テーブル -->
    <MatchingList />

    <!-- 「未割り当て受験者」テーブル -->
    <NotMatchingList />

    <BackButton
      :label="displayLang.MANAGEMETN_LINK_BACK"
      @click="$router.replace('/management')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MatchingList from './MatchingList.vue';
import NotMatchingList from './NotMatchingList.vue';
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as pageTypes from '@/store/types/checkersMonitoringPageType';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  name: 'Monitoring',
  components: {
    MatchingList,
    NotMatchingList,
    BackButton,
  },
  data() {
    return {
      interval: {} as NodeJS.Timeout,
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  created() {
    this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_GET_MONITORINGS);
    this.interval = setInterval(() => {
      this.$store.dispatch(pageTypes.ACTION_CHECKERS_MONITORING_PAGE_GET_MONITORINGS);
    }, 3000);
  },
  destroyed() {
    clearInterval(this.interval)
  }
});
</script>

<style scoped></style>
