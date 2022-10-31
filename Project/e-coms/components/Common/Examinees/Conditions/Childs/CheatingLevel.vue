<template>
  <div class="form-group col-3">
    <label for="cheating_level">{{ displayLang.EXAMINEES_CONDITIONS_CHEATING_LEVEL }}</label>
    <div class="level-controls">
      <CheatingLevelFrom />
      ～
      <CheatingLevelTo />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CheatingLevelFrom from './CheatingLevelFrom.vue';
import CheatingLevelTo from './CheatingLevelTo.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

export default Vue.extend({
  name: 'CheatingLevel',
  components: {
    CheatingLevelFrom,
    CheatingLevelTo,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style scoped></style>
