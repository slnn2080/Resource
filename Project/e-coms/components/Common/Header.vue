<template>
  <div class="header-container">
    <header class="header">
      <div class="container d-flex align-items-center">
        <!-- ヘッダ左 -->
        <div class="header-brand w-50">
          <img src="@/assets/images/common/logo.png" />
        </div>

        <!-- ヘッダ右 -->
        <template v-if="isLoginPage">
          <!-- ログインページ -->
          <div class="header-nav w-50 text-right">
            <div class="badge badge-primary mb-1">{{ target }}</div>
            <div v-if="displayUserName" class="user-id">{{ displayUserName }}</div>
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="onClickClose()"
            >{{ displayLang.HEADER_CLOSE }}</button>
          </div>
        </template>
        <template v-else>
          <!-- ログインページ以外 -->
          <div class="header-nav w-50 text-right">
            <div class="badge badge-primary mb-1">{{ target }}</div>
            <div v-if="displayUserName" class="user-id">{{ displayUserName }}</div>
          </div>
          <template v-if="isDisplayLogout">
            <div class="sign-out">
              <button
                type="button"
                class="btn btn-outline-secondary"
                :disabled="isLogoutButtonDisabled"
                @click="onClickLogout()"
              >
                <i class="fa fa-sign-out-alt" aria-hidden="true"></i>
              </button>
            </div>
          </template>
        </template>

      </div>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LogoutMethod } from '@/plugins/global/window';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import * as testerPageTypes from '@/store/types/testerPageType';
import { Actor } from '@/store/enum/Actor';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import { TesterState } from '@/store/enum/TesterState';

export default Vue.extend({
  name: 'Header',
  data() {
    return {
    }
  },
  computed: {
    displayLang(): any {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
    isLoggedIn(): boolean {
      return this.$store.getters[loginTypes.GETTER_IS_LOGGED_IN]
    },
    target(): string | null {
      const target = this.inParams.target;
      const domain = this.extractDomain(target);
      return domain || this.extractDomain(decodeURIComponent(target));
    },
    /**
     * ログインページか調べます
     *
     * @return {boolean}
     */
    isLoginPage(): boolean {
      return this.$route.name === 'login';
    },
    /**
     * 「ログアウト」ボタン表示の可否
     *
     * @return {boolean}
     */
    isDisplayLogout():boolean {
      if (!this.isLoggedIn) {
        return false
      } else {
        const actor = this.$store.getters[rootTypes.GETTER_STARTUP].actor;
        const name = this.$route.name;

        if (actor == Actor.TESTER) {
          // 受験者

          if (name === 'env-setting') {
            return true;
          } else if (name === 'examining') {
            const testerPage = this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE] as TesterPageAdapter;
            return testerPage.testerState !== TesterState.EXAMING;
          } else {
            return false;
          }
        } else {
          // 受験者以外
          return true
        }
      }
    },
    /**
     * 「ログアウト」ボタンのdisabled
     *
     * @return {boolean}
     */
    isLogoutButtonDisabled(): boolean {
      return !this.isLoggedIn || this.$store.getters[commonTypes.GETTER_COMMON_GET_HEADER_LOGOUT_BUTTON_DISABLED]
    },
    /**
     * 'ユーザ名(ログイン情報)'の文字列を取得します
     *
     * @return {string}
     */
    displayUserName(): string {
      if (this.loginData.examUserName || this.loginData.loginId) {
        // ログイン済み
        return `${this.loginData.examUserName || ''} (${this.loginData.loginId || ''})`
      } else {
        // 未ログイン時
        return '';
      }
    }
  },
  methods: {
    extractDomain(target: string): string | null {
      const match = target.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
      if (match == null || match.length < 2) {
        return null;
      } else {
        return match[1];
      }
    },
    /**
     * ログイン画面 - [閉じる]ボタン
     */
    onClickClose() {
      if (confirm(this.displayLang.CONFIRM_WINDOW_CLOSE)) {
        // このボタンが表示されているときは、ログインしているいないのでログアウト処理は不要
        this.$window.close(LogoutMethod.NONE)
      }
    },
    /**
     * ログイン画面以外 - [ログアウト]ボタン
     */
    onClickLogout() {
      const actor = this.$store.getters[loginTypes.GETTER_LOGIN].actor;
      switch (actor) {
        case Actor.CHECKER:
          if (confirm(this.displayLang.CONFIRM_LOGOUT_CHECKER)) {
            this.$window.cleanup(LogoutMethod.LOGOUT)
          }
          break;

        case Actor.TESTER:
        default:
          if (confirm(this.displayLang.CONFIRM_LOGOUT)) {
            this.$window.cleanup(LogoutMethod.LOGOUT)
          }
          break;
      }
    },
  }
});
</script>

<style scoped></style>
