<template>
  <div class="form-group col-3">
    <label for="login_id">{{ displayLang.EXAMINEES_CONDITIONS_LOGIN_ID }}</label>
    <input id="login_id" v-model="value" type="text" class="form-control">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';

export default Vue.extend({
  name: 'LoginId',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    value: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_LOGIN_ID];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_LOGIN_ID, value);
      }
    },
  },
});
</script>

<style scoped></style>
