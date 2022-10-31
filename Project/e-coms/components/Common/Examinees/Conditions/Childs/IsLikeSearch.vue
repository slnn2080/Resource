<template>
  <div class="form-group col-3">
    <div class="custom-control custom-checkbox mt-4">
      <input id="customCheck1" v-model="value" type="checkbox" class="custom-control-input">
      <label class="custom-control-label" for="customCheck1">{{ displayLang.EXAMINEES_CONDITIONS_IS_LIKE_SEARCH }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

export default Vue.extend({
  name: 'IsLikeSearch',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    value: {
      get(): boolean {
        const v:any = this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_IS_LIKE_SEARCH];
        return v == 1;
      },
      set(value: boolean) {
        const convertedValue:number = value ? 1 : 0;
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_IS_LIKE_SEARCH, convertedValue);
      }
    },
  },
});
</script>

<style scoped></style>
