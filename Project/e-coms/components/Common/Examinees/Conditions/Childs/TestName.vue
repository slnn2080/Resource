<template>
  <div class="form-group col-3">
    <label for="testing_neme">{{ displayLang.EXAMINEES_CONDITIONS_TEST_NAME }}</label>
    <select id="testing_neme" v-model="value" class="form-control">
      <option :value="null">-</option>
      <option v-for="testName in conditions.testNames" :value="testName.value">{{ testName.value }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

export default Vue.extend({
  name: 'TestName',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    value: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TEST_NAME];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_TEST_NAME, value);
      }
    },
  },
});
</script>

<style scoped></style>
