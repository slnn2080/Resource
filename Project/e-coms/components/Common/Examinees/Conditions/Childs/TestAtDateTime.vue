<template>
  <ValidationObserver ref="testAtDateTimeObserver" v-slot="{ invalid, errors }" slim>
    <div class="form-group col-6">
      <label for="testing_date">{{ displayLang.EXAMINEES_CONDITIONS_TEST_AT_DATETIME }}</label>
      <template v-if="invalid">
        <span class="alert alert-danger validation-message-area" role="alert">
          {{ errors['testAtDateFrom'][0] || errors['testAtTimeFrom'][0] || errors['testAtDateTo'][0] || errors['testAtTimeTo'][0] }}
        </span>
      </template>
      <div class="day-controls">
        <ValidationProvider slim vid="testAtDateFrom" rules="date|datetime_combination:testAtDateFrom,testAtTimeFrom,testAtDateTo,testAtTimeTo">
          <input id="testing_date1" ref="testAtDateFrom" v-model="testAtDateFrom" type="text" class="form-control d-inline-block w30p">
        </validationprovider>
        <ValidationProvider slim vid="testAtTimeFrom" rules="datetime_combination:testAtDateFrom,testAtTimeFrom,testAtDateTo,testAtTimeTo">
          <select ref="testAtTimeFrom" v-model="testAtTimeFrom" class="form-control w-auto d-inline-block">
            <option :value="null">-</option>
            <option v-for="time in conditions.times" :value="time.value">{{ time.value }}</option>
          </select>
        </ValidationProvider>
        ～
        <ValidationProvider slim vid="testAtDateTo" rules="date|datetime_combination:testAtDateFrom,testAtTimeFrom,testAtDateTo,testAtTimeTo">
          <input id="testing_date2" ref="testAtDateTo" v-model="testAtDateTo" type="text" class="form-control d-inline-block w30p">
        </ValidationProvider>
        <ValidationProvider slim vid="testAtTimeTo" rules="datetime_combination:testAtDateFrom,testAtTimeFrom,testAtDateTo,testAtTimeTo">
          <select ref="testAtTimeTo" v-model="testAtTimeTo" class="form-control w-auto d-inline-block">
            <option :value="null">-</option>
            <option v-for="time in conditions.times" :value="time.value">{{ time.value }}</option>
          </select>
        </ValidationProvider>
      </div>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

export default Vue.extend({
  name: 'TestAtDateTime',
  components: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    testAtDateFrom: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TEST_AT_DATE_FROM];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_TEST_AT_DATE_FROM, value);
      },
    },
    testAtTimeFrom: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TEST_AT_TIME_FROM];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_TEST_AT_TIME_FROM, value);
      },
    },
    testAtDateTo: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TEST_AT_DATE_TO];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_TEST_AT_DATE_TO, value);
      },
    },
    testAtTimeTo: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TEST_AT_TIME_TO];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_TEST_AT_TIME_TO, value);
      },
    },
  },
  methods: {
  },
});
</script>

<style scoped>
  .validation-message-area {
    margin-left: 10px;
    padding: 2px;
  }
</style>
