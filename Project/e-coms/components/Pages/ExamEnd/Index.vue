<template>
  <div class="container">
    <div class="mt-5 mb-5">
      <div class="card">
        <div class="card-header text-center header-normal">
          <i class="fa fa-ban" aria-hidden="true"></i>
          {{ displayLang.EXAM_END_TERM }}
        </div>
        <div class="card-body">
          <template v-if="hasMark">
            <ExamEndMarking
              :score="testerPage.markingTotalScore"
              :markings="testerPage.markings"
              :records="testerPage.records"
            />
          </template>
          <template v-else>
            <ExamEnd />
          </template>
        </div>
        <div class="card-footer text-center">
          <button
            type="button"
            class="btn btn-primary"
            @click.once="onClickLogout()"
          >{{ displayLang.EXAM_END_LOGOUT }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { LanguageEnum } from '@/store/enum/language';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LogoutMethod } from '@/plugins/global/window';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from "@/store/types/commonType";
import * as loginTypes from '@/store/types/loginType';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import * as testerPageTypes from '@/store/types/testerPageType';
import ExamEndMarking from '@/components/Pages/ExamEnd/ExamEndMarking.vue';
import ExamEnd from '@/components/Pages/ExamEnd/ExamEnd.vue';
import { ModalOptions } from '@/plugins/global/modals';

export default Vue.extend({
  name: 'Index',
  components: {
    ExamEndMarking,
    ExamEnd,
  },
  data() {
    return {};
  },
  mounted() {
    const query = this.$route.query
    if (query) {
      switch (query.reason) {
        case 'auth_error':
        case 'timeout':
          this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
            .then(() => this.$store.dispatch(loginTypes.ACTION_LOGOUT)) // モーダルを表示する前にログアウトを行う
            .then(() => new Promise((resolve, reject) => {
              const text = query.reason == 'auth_error'
                ? (this.displayLang as any).EXAMINING_MODAL_AUTH_ERROR_TEXT
                : (this.displayLang as any).EXAMINING_MODAL_TIMEOUT_TEXT
              this.$modals.showErrorAlert(text, {title: (this.displayLang as any).EXAMINING_MODAL_TITLE, hideBackdrop: true} as ModalOptions)
                .finally(() => resolve(true))
            }))
            .then(() => {
              return new Promise((resolve, reject) => {
                // すでにログアウトをしているので、ログアウト処理は行わない
                this.$window.cleanup(LogoutMethod.NONE)
                  .finally(() => {
                    resolve()
                  })
              })
            })
            .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false));
          break;

        default:
          // nop
      }
    }
  },
  computed: {
    ...mapGetters({ inParams: rootTypes.GETTER_STARTUP }),
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerPage(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
    hasMark(): boolean {
      return this.testerPage.markings && this.testerPage.markings.length > 0
    },
  },
  methods: {
    onClickLogout() {
      this.$window.cleanup(LogoutMethod.LOGOUT)
    },
  },
});
</script>
