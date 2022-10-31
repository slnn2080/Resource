<template>
  <div>
    <a v-if="visibleForgetPassword()" :href="link" target="_blank">
      <i class="fa fa-lock" aria-hidden="true"></i>
      {{ displayLang.LOGIN_FORGET_PASSWORD }}
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '~/store/enum/language';
export default Vue.extend({
  name: 'ForgetPassword',
  data() {
    return {
      link: '' as string,
      // TODO: 定数ファイルを整理・ローカライズ対応
      //MASTER_CBT_FORGET_PASSWORD_LINK: '/exam/password_remind/?lang=' as string,
      //J_TESTING_FORGET_PASSWORD_LINK: 'https://j-testing.jp/Account/reissue/pw' as string,
      //FORGET_URL_IS_MASTER_CBT: 2 as number
    };
  },
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  },
  created() {
    this.setPasswordLink();
  },
  methods: {
    setPasswordLink() {
      this.link = decodeURIComponent(this.inParams.passwordUrl) + '?lang=' + this.inParams.lang;
    },
    visibleForgetPassword() {
      return (this.inParams.passwordUrl !== undefined && this.inParams.passwordUrl);
    }
  }
});
</script>
