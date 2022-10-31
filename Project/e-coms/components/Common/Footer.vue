<template>
  <div class="footer-container">
    <footer class="footer">
      <div class="container clearfix">
        <div class="footer-nav">
          <ul class="nav">
            <li v-if="isExamee()" class="nav-item">
              <a class="nav-link" href="#" @click="onClickTerm">{{
                displayLang.FOOTER_TERM
              }}</a>
            </li>
            <li v-if="isExamee()" class="nav-item">
              <a class="nav-link" href="https://www.e-coms.co.jp/privacy/" target="_blank">{{
                displayLang.FOOTER_PRIVACY_PLICY
              }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://www.e-coms.co.jp/service/remote-testing/inquery/contact.html" target="_blank">{{
                displayLang.FOOTER_CONTACT
              }}</a>
            </li>
          </ul>
        </div>
        <div class="copyright"><a href="https://www.e-coms.co.jp/" target="_blank">© e-communications,Inc.</a></div>
        <div class="footer-note"> {{ displayLang.FOOTER_NOTE }}</div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StartupAdapter from '../../store/types/adapters/startupAdapter';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '~/store/enum/language';
export default Vue.extend({
  name: 'Footer',
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  },
  methods: {
    isExamee() {
      // TODO: Enum
      return this.inParams.actor === 1; // FIXME: 受験者のみ
    },
    onClickTerm(event: MouseEvent) {
      event.preventDefault();

      // TODO: ここはwindow.$open()を使わなくても問題はないのでそのままにしておく(/termsにはスタートアップパラメータもログインも必要ないため)
      const route = this.$router.resolve({ name: 'terms' });
      window.open(route.href + '/');
    }
  }
});
</script>

<style scoped></style>
