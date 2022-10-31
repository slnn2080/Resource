<template>
  <div class="form-group col-3">
    <label for="marking_date">{{ displayLang.EXAMINEES_CONDITIONS_WITH_MARK }}</label>
<!--
    <div class="marking-controls">
      <div class="custom-control custom-radio custom-control-inline">
        <input type="radio" id="marking_date1" name="marking_date" class="custom-control-input" v-model="value" />
        <label class="custom-control-label" for="marking_date1">{{ displayLang.EXAMINEES_CONDITIONS_YES }}</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
        <input type="radio" id="marking_date2" name="marking_date" class="custom-control-input" v-model="value" />
        <label class="custom-control-label" for="marking_date2">{{ displayLang.EXAMINEES_CONDITIONS_NO }}</label>
      </div>
    </div>
-->
    <select id="marking_date" v-model="value" class="form-control">
      <option :value="null">-</option>
      <option v-for="withMark in conditions.withMarks" :value="withMark.id">{{ withMark.value }}</option>
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
  name: 'WithMark',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    value: {
      get(): number {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_WITH_MARK];
      },
      set(value: number) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_WITH_MARK, value);
      }
    },
  },
});
</script>

<style scoped></style>
