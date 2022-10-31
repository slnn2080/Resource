<template>
  <div :id="bodyId">
    <Header
      v-if="isLayoutVisible"
    />
    <nuxt />
    <Footer
      v-if="isLayoutVisible"
    />
    <Loader />
    <Modals />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import Header from '@/components/Common/Header.vue';
import Footer from '@/components/Common/Footer.vue';
import Loader from '@/components/Common/Loader.vue';
import Modals from '@/components/Common/Modals/Modals.vue';
import * as rootTypes from '@/store/types/rootType';
import * as loginTypes from '@/store/types/loginType';
import * as commonTypes from '@/store/types/commonType';
import { PagePathUtils } from '@/store/enum/pageTransition';
import { Actor } from '@/store/enum/Actor';

export default Vue.extend({
  // TODO: 初期化 & 初期チェックは画面を開いた一度のみ行いたいので、pages/index.vueで行う ここでは行わない
  // middleware: [
  //   'initCheck'
  // ],
  components: {
    Header,
    Footer,
    Loader,
    Modals,
  },
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
    isLoggedIn(): boolean {
      return this.$store.getters[loginTypes.GETTER_IS_LOGGED_IN]
    },
    /**
     * ヘッダとフッタを非表示か調べます
     *
     * @param {boolean}
     */
    isLayoutVisible(): boolean {
      return this.$store.getters[commonTypes.GETTER_COMMON_IS_LAYOUT_VISIBLE]
    },
    /**
     * <body>タグに指定するID
     *
     * @param {string}
     */
    bodyId(): string {
      if (!this.isLayoutVisible) {
        return '';
      }

      console.log(this.$route.path)
      return PagePathUtils.getBodyId(this.isLoggedIn, this.loginData.actor, this.$route.path)
    },
  },
  beforeCreate() {
    console.log('[Layout INFO] beforeCreate');

    // この条件はF5が押された場合
    // 「通知ブロック」や「ポップアップブロック」で/alerting/***画面で押されることを想定していると思われる
    this.$store.dispatch(rootTypes.ACTION_STARTUP_FOR_F5);
  },
  mounted() {
    console.log('[Layout INFO] mount');

    // HTMLの言語設定
    (this.$nuxt.context.app.head as any).htmlAttrs.lang = this.inParams.lang

    // ブラウザの離脱抑制ポップアップの設定
    this.$window.setBeforeUnload(true)

    // アプリ起動時は、画面をスリープさせないようにする
    this.$window.startWakeLock()
  },
});
</script>

<style></style>
