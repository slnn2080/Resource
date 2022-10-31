<template>
  <div class="form-group col-3">
    <label for="video_data">{{ displayLang.EXAMINEES_CONDITIONS_RECORD }}</label>
    <select id="video_data" v-model="value" class="form-control">
      <option :value="null">-</option>
      <option v-for="record in conditions.records" :value="record.id">{{ record.value }}</option>
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
  name: 'Record',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    value: {
      get(): number {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_RECORD];
      },
      set(value: number) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_RECORD, value);
      }
    },
  },
});
</script>

<style scoped></style>
