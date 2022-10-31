<template>
  <div class="card-footer text-right">
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!buttonEnabled"
      @click="onClickYes"
    >{{ displayLang.IDENTIFICATION_CHAT_SEND_YES }}</button>
    <button
      type="button"
      class="btn btn-secondary"
      :disabled="!buttonEnabled"
      @click="onClickNo"
    >{{ displayLang.IDENTIFICATION_CHAT_SEND_NO }}</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '@/store/enum/language';
import * as pageTypes from '@/store/types/testerPageType';

export default Vue.extend({
  // eslint-disable-next-line vue/require-prop-types
  data() {
    return {};
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    /**
     * 「はい」「いいえ」ボタンの有効フラグ
     *
     * @return {boolean}
     */
    buttonEnabled(): boolean{
      // コメントアウト
      //
      //// ステータスが「本人認証中」になるまでは押下できないようにする
      //if (!this.$store.getters[pageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_AUTHENTICATING]) {
      //  return false
      //}
      //// 承認が「却下」された場合は押下できないようにする
      //if (this.$store.getters[pageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_REJECTED]) {
      //  return false
      //}
      return true
    },
  },
  methods: {
    onClickYes() {
      // WebRTCでマッチングしている監視者にメッセージ通知を行う。
      console.log('click Yes.');
      this.$emit('answerComment', (this.displayLang as any).IDENTIFICATION_CHAT_SEND_YES);
    },
    onClickNo() {
      // WebRTCでマッチングしている監視者にメッセージ通知を行う。
      console.log('click No.');
      this.$emit('answerComment', (this.displayLang as any).IDENTIFICATION_CHAT_SEND_NO);
    }
  }
});
</script>

<style scoped>
.btn-secondary.disabled:hover, .btn-secondary[disabled]:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>
