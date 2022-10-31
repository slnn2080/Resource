<template>
  <button
    type="button"
    class="btn btn-danger btn-block"
    @click="showKickOutModal"
  >{{ displayLang.MONITORING_KICK_OUT }}</button>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  name: 'MainMonitorKickOutButton',
  props: {
    showKickOutModal: {
      type: Function,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style scoped></style>
