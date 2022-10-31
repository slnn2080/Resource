<template>
  <div class="stepbar">
    <ul class="nav nav-tabs">
      <li class="active">{{ displayLang.STEPBAR_ENV_SETTING }}</li>
      <li :class="setActiveClassWithTermAgree()">
        {{ displayLang.STEPBAR_AGREE }}
      </li>
      <li v-if="showIdentification()" :class="setActiveClassWithIdentity()">
        {{ displayLang.STEPBAR_IDENTITY }}
      </li>
      <li>{{ displayLang.STEPBAR_EXAMING }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import * as pageTypes from '@/store/types/testerPageType';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '~/store/enum/language';
import { StepbarState } from '@/store/enum/StepbarState';
export default Vue.extend({
  name: 'Stepbar',
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    selectData(): TesterPageAdapter {
      return this.$store.getters[pageTypes.GETTER_TESTER_PAGE];
    }
  },
  methods: {
    setActiveClassWithTermAgree() {
      if (
        this.selectData.stepbarState === StepbarState.TERM_AGREE ||
        this.selectData.stepbarState === StepbarState.IDENTIFICATION
      ) {
        return 'active';
      }
    },
    setActiveClassWithIdentity() {
      if (this.selectData.stepbarState === StepbarState.IDENTIFICATION) {
        return 'active';
      }
    },
    showIdentification() {
      return this.inParams.isAuth === 1;
    }
  }
});
</script>
<style scoped></style>
