<template>
  <button
    type="button"
    class="btn btn-sm btn-secondary"
    @click="click"
  >{{ displayLang.EXAMINEES_CONDITIONS_BUTTONS_CLEAR }}</button>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';

export default Vue.extend({
  name: 'ClearButton',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
    click() {
      this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_CLEAR_FORM_VALUES);
    },
  },
});
</script>

<style scoped></style>
