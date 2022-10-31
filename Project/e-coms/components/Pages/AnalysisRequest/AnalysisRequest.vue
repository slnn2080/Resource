<template>
  <div class="mt-4 mb-4">
    <ExamineesConditions />
    <AnalysisRequestTable />
    <ExamineesSelectableTestersTable />
    <AnalysisRequestForm />

    <BackButton
      :label="displayLang.MANAGEMETN_LINK_BACK"
      @click="$router.replace('/management')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ExamineesConditions from '@/components/Common/Examinees/Conditions/ExamineesConditions.vue';
import ExamineesSelectableTestersTable from '@/components/Common/Examinees/SelectableTestersTable/ExamineesSelectableTestersTable.vue';
import AnalysisRequestTable from './AnalysisRequestTable.vue';
import AnalysisRequestForm from './AnalysisRequestForm.vue';
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import * as pageTypes from '@/store/types/analysisRequestPageType';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '~/store/enum/language';

export default Vue.extend({
  name: 'AnalysisRequest',
  components: {
    ExamineesConditions,
    ExamineesSelectableTestersTable,
    AnalysisRequestTable,
    AnalysisRequestForm,
    BackButton,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  created() {
    // 「AI解析依頼」画面の初期化時に「AI解析サーバ」のドメイン等を取得しておく
    this.$store.dispatch(pageTypes.ACTION_ANALYSIS_REQUEST_PAGE_CALL_API_ANALYSIS_REQUEST_INITIAL_PARAM);
  },
});
</script>

<style></style>
