<template>
  <div class="form-group col-10">
    <label for="marking_type">{{ displayLang.EXAMINEES_CONDITIONS_MARK_ID }}</label>
    <select id="marking_type" v-model="value" size="3" multiple class="form-control">
      <option v-for="mark in conditions.marks" :value="mark.id">{{ mark.value }}</option>
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
  name: 'MarkId',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    value: {
      get(): number[] {
        const mark_id = this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_MARK_ID];
        return (mark_id) || [];
      },
      set(value: number[]) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_MARK_ID, value);
      }
    },
  },
});
</script>

<style scoped></style>
