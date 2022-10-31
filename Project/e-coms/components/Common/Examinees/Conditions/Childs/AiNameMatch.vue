<template>
  <div class="form-group col-3">
    <label for="ai_name_match">{{ displayLang.EXAMINEES_CONDITIONS_AI_NAME_MATCH }}</label>
    <div class="form-inline">
      <input
        type="number"
        min="0"
        max="100"
        class="form-control"
        id="ai_name_match"
        style="width: 95%"
        v-model="value"
      >%
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '@/store/types/rootType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

export default Vue.extend({
  name: 'AiAnalysisFlag',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    value: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_AI_NAME_MATCH];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_AI_NAME_MATCH, value);
      }
    },
  },
});
</script>

<style scoped></style>
