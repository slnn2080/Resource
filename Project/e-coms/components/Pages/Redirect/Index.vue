<template>
  <div class="mt-4 mb-4">
    <div class="page-title">{{ displayLang.REDIRECT_TITLE }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as examineeDetailPageTypes from '@/store/types/examineeDetailPageType';
import { TesterDetailAdapter, TesterDetailRequestType, TesterDetailParamLatestMode } from '@/store/types/adapters/testerDetailAdapter';
import { GetTestPassRequestType } from '@/store/types/adapters/testPassAdapter';
import { pagePathInfoMap } from '@/store/enum/pageTransition';

export default Vue.extend({
  name: 'Index',
  components: {
  },
  created() {
    // この画面は別ウィンドウで開かれることがあるので、GETパラメータをチェックし分岐を行う
    this.$window.startupChildWindow()
      .then((obj) => {
        const url = obj.url as any
        const params = obj.params as any

        const path = url.split('?')[0].split('#')[0]

        if (
          pagePathInfoMap.LOGIN_PAGE.match(pagePathInfoMap.LOGIN_PAGE, path) || 
          pagePathInfoMap.LOGIN_PAGE.match(pagePathInfoMap.ENV_SETTING_PAGE, path)
        ) {
          // 共通 「ログイン」画面    - 外部試験のため(window.resize()/window.move()関数を使用するため)
          // 受験者 「環境設定」画面  - 外部試験のため(window.resize()/window.move()関数を使用するため)

          this.$router.replace(url)

        } else if (pagePathInfoMap.LOGIN_PAGE.match(pagePathInfoMap.EXAM_END_PAGE, path)) {
          // 受験者 「試験終了」画面  - 外部試験「試験終了」時のウィンドウリサイズ処理のため
          //                          - ただし、不具合回避のため(@see front/components/Pages/Examining/Examining.vue resizeWindowAndFocusWindow())

          // 子ウィンドウで開かれた場合は、ログアウトできないようにする
          this.$store.dispatch(commonTypes.ACTION_COMMON_SET_HEADER_LOGOUT_BUTTON_DISABLED, true) // これはいらない気がするが、検証してないのでそのままにしておく

          this.$router.replace(url)

        } else if (pagePathInfoMap.EXAMINEES_DETAIL_PAGE.match(pagePathInfoMap.EXAMINEES_DETAIL_PAGE, path)) {
          // 管理者/管理者「結果詳細」画面 - ※利便性のために別窓を利用している

          // 子ウィンドウで開かれた場合は、ログアウトできないようにする
          this.$store.dispatch(commonTypes.ACTION_COMMON_SET_HEADER_LOGOUT_BUTTON_DISABLED, true)

          // 画面遷移や、ブラウザ「x」閉じるボタンでダイアログが表示されないようにする
          this.$window.setBeforeUnload(false)

          // 「結果詳細」ページ
          const userId = params.examUserId

          this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
            .then(() => {
              return this.$store.dispatch(examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_GET_TESTER_DETAIL, {user_id: userId, test_id: null, latest_mode: TesterDetailParamLatestMode.EXAMINING_LATEST } as TesterDetailRequestType)
                .then((detail) => {
                  return new Promise((resolve) => {
                    // ローカル環境で、このAPIは動かないので失敗しても画面遷移を行う
                    return this.$store.dispatch(examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_GET_TEST_PASS, { testId: detail.testId } as GetTestPassRequestType)
                      .finally(() => {
                        this.$router.replace(url)
                        resolve()
                      });
                  });
                })
                .catch((e) => {
                  console.error(e)
                  this.$modals.showErrorAlert('受験者詳細APIでエラーが発生しました')
                })
            })
            .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
        }
      })
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style></style>
