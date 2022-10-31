<template>
  <iframe
    ref="iframe"
    width="100%"
    height="100%"
    frameborder="0"
    allow="camera;microphone"
    :src="iframeSrc"
  ></iframe>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LogoutMethod } from '@/plugins/global/window';
import * as rootTypes  from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import { pagePathInfoMap } from '@/store/enum/pageTransition';
import { Endpoint } from '@/store/const/endpoint';

export default Vue.extend({
  name: 'Index',
  components: {
  },
  data() {
    return {
      iframeSrc: '' as string,
    }
  },
  created() {
    // レイアウトヘッダ/フッタを非表示にする
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LAYOUT_VISIBLE, false);

    // この画面は、GETパラメータ付きで呼び出される可能性があるので、それに応じてstoreに値を設定する
    if ('page' in this.$route.query) {
      const page = this.$route.query.page

      switch (page) {
        // 「checker」画面
        case 'checker':
          // リロード時のモーダル表示をoffにする
          //
          // 「checker」画面は「リロード」ボタン以外のブラウザのリロード機能やF5も許可する
          //
          // このアプリ(SPA)は本来、リロードやF5は行ってはいけないがぎりぎり、「ログイン」画面とこの画面については可能
          // メモリ(ストア)内にデータがない状態であるログイン前に限り許容されている状況
          // window.sessionStorage.getItem('startup')で初期状態に復帰できるため
          // startup.phpからの初期化とF5を押したときの処理の流れも微妙に異なるので以下のファイルの関数がどのように起動するか見ておいてください
          //
          // @see front/store/rootStore.ts
          // @see front/layouts/default.vue
          // @see front/pages/index.vue
          // @see front/middleware/initCheck.ts
          this.$window.setBeforeUnload(false)

          this.openCheckerPage()
          break;

        default:
          console.error('[ERROR] pageパラメータが不正です', page)
      }
    }
  },
  destroyed() {
    // レイアウトヘッダ/フッタを表示にする
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LAYOUT_VISIBLE, true);

    if ('page' in this.$route.query) {
      const page = this.$route.query.page

      switch (page) {
        // 「checker」画面
        case 'checker':
          // リロード時のモーダル表示をonにする
          this.$window.setBeforeUnload(true)
          break;
      }
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
  },
  methods: {
    /**
     * 「checker」画面を開きます
     */
    openCheckerPage() {
      const inServer = this.inParams.inServer
      const receiveMessage = (event: any) => {
        if (event.origin !== inServer) {
          return;
        }

        const request = event.data ? event.data.request : ''
        switch (request) {
          // ログイン画面へ
          case 'login':
            window.removeEventListener('message', receiveMessage, false)
            this.$window.reload(LogoutMethod.NONE)
            break;

          // ポップアップテスト
          case 'popup_check':
            {
              const callback = (result: boolean) => {
                const iframe = this.$refs.iframe as HTMLIFrameElement
                (iframe as any).contentWindow.postMessage({result: result}, '*')
              };

              /**
               * ここの処理はchecker画面と同じです。またinitCheck.tsとも等価です 
               *
               * @see srv/services/proctor/application/checker/js/index.js
               * @see srv/services/proctor/application/nchecker/js/index.js
               * @see front/middleware/initCheck.ts
               */
              setTimeout(function() {
                var popUp = window.open('', '_blank', 'top=-100,left=-100,width=100,height=100,menubar=no,toolbar=no,location=no,resizable=no,directories=no');
                if (popUp === null || typeof popUp === 'undefined') {
                  callback(false);
                } else {
                  popUp.close();
                  callback(true);
                }
              }, 1);
            }
            break;
        }
      };

      window.addEventListener('message', receiveMessage, false);
      this.$set(this, 'iframeSrc', `${inServer}${Endpoint.CHECKER.url}?iframe=1`)
    },
  },
});
</script>

<style></style>
