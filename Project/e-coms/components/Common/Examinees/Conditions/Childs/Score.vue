<template>
  <div class="form-group col-3">
    <label for="illegal_score">{{ displayLang.EXAMINEES_CONDITIONS_SCORE}}</label>
    <div class="level-controls">
      <input
        type="number"
        min="0"
        class="form-control"
        id="illegal_score"
        v-model="value"
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';

export default Vue.extend({
  name: 'Score',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    value: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_SCORE];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_SCORE, value);
      }
    },
  },
});
</script>

<style scoped></style>
