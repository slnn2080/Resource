<template>
  <main class="main">
    <div class="container">
      <div class="mt-5 mb-5">
        <div class="card">
          <div class="card-body section-document">
            <div class="heading-underline">
              <h2 class="heading-text">{{ displayLang.TERMS_TITLE }}</h2>
            </div>
            <div v-html="envSettingTermOfUseText"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from "~/store/enum/language";
import * as rootTypes from "~/store/types/rootType";
export default Vue.extend({
  data() {
    return {};
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    envSettingTermOfUseText(): string {
      return this.displayLang.ENV_SETTING_TERM_OF_USE_TEXT.replace(/\n/g, '<br/>');
    }
  },
  methods: {}
});
</script>
