<template>
  <div class="col-6">
    <div class="auth-photo-frame id-auth no-photo" style="position: relative; overflow: hidden">
      <slot></slot>
      <div class="no-connect-item">
        <div class="no-connect-icon"><i class="fa fa-id-card" aria-hidden="true"></i></div>
        <div class="no-connect-label">{{ displayLang.AI_IDENTIFICATION_ID_IMAGE }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import * as testerPageTypes from '@/store/types/testerPageType';
import * as testerTypes from '@/store/types/testerType';
import * as matchingType from '@/store/types/matchingType';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { LanguageEnum } from '@/store/enum/language';

export default Vue.extend({
  name: 'IDImage',
  components: {},
  data() {
    return {};
  },
  computed: {
    testerPage(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  }
});
</script>

