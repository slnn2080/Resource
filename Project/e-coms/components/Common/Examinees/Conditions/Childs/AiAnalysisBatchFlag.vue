<template>
  <div class="form-group col-3">
    <label for="ai_analysis_batch_flag">{{ displayLang.EXAMINEES_CONDITIONS_AI_ANALYSIS_BATCH_FLAG }}</label>
    <select id="ai_analysis_batch_flag" v-model="value" class="form-control">
      <option :value="null">-</option>
      <option v-for="v in conditions.aiAnalysisFlag" :value="v.id">{{ v.value }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '@/store/types/rootType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

export default Vue.extend({
  name: 'AiAnalysisBatchFlag',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    value: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_AI_ANALYSIS_BATCH_FLAG];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_AI_ANALYSIS_BATCH_FLAG, value);
      }
    },
  },
});
</script>

<style scoped></style>
