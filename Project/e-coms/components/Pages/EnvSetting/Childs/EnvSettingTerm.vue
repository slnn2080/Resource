<template>
  <div>
    <div class="headline">{{ displayLang.ENV_SETTING_TERM_OF_USE }}</div>
    <div class="card mb-3">
      <div class="card-body terms-text" @scroll="onScroll">
        <div v-html="envSettingNotesAndAgreementsText"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as pageTypes from '@/store/types/testerPageType';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '@/store/enum/language';
export default Vue.extend({
  name: 'EnvSettingTerm',
  computed: {
    selectData(): TesterPageAdapter {
      return this.$store.getters[pageTypes.GETTER_TESTER_PAGE];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    envSettingNotesAndAgreementsText(): string {
      return this.displayLang.ENV_SETTING_NOTES_AND_AGREEMENTS_TEXT.replace(/\n/g, '<br/>');
    }
  },
  methods: {
    onScroll(event: Event) {
      const target = event.currentTarget as HTMLDivElement;
      if (Math.ceil(target.scrollTop) >= (target.scrollHeight - target.clientHeight)*0.95) {
        this.$store.dispatch(
          pageTypes.ACTION_TESTER_PAGE_PROCTER_TERM_READ,
          true
        );
      }
    },
  }
});
</script>
