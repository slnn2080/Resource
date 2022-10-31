<template>
  <div class="container">
    <div class="mt-4 mb-4">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-6">
              <div class="headline">{{ displayLang.MANAGEMENT_MENU }}</div>
              <div class="list-group list-anchor-primary list-size-lg">
                <nuxt-link to="/examinees" class="list-group-item list-group-item-action d-flex justify-content-between">
                  {{ displayLang.MANAGEMENT_EXAMINEES }}
                  <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                </nuxt-link>
                <nuxt-link to="/checkers/monitoring" class="list-group-item list-group-item-action d-flex justify-content-between">
                  {{ displayLang.CHECKERS_MONITORING }}
                  <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                </nuxt-link>
                <nuxt-link to="/analysis-request" class="list-group-item list-group-item-action d-flex justify-content-between">
                  {{ displayLang.MANAGEMENT_ANALYSIS_REQUEST }}
                  <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                </nuxt-link>
                <nuxt-link to="/access-limit" class="list-group-item list-group-item-action d-flex justify-content-between">
                  {{ displayLang.MANAGEMENT_ACCESS_LIMIT }}
                  <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                </nuxt-link>
                <nuxt-link to="/create-shorturl-list" class="list-group-item list-group-item-action d-flex justify-content-between">
                  {{ displayLang.MANAGEMENT_SHORT_URL }}
                  <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                </nuxt-link>
              </div>
            </div>
            <div class="col-6">
              <div class="headline">{{ displayLang.MANAGEMENT_SUMMARY }}</div>
              <table class="table table-bordered summary-data">
                <tbody>
                  <tr>
                    <th rowspan="2" class="item-name">{{ displayLang.MANAGEMENT_SUMMARY_LOGIN_COUNT }}</th>
                    <td>{{ displayLang.MANAGEMENT_SUMMARY_LOGIN_COUNT_TESTER }}</td>
                    <td><nuxt-link :to="makeLoginsUrl('TESTER')" class="link-style"><span class="summary-txt">{{ loginsTesterCount }}</span> {{ displayLang.WORD_J_KEN }}</nuxt-link></td>
                  </tr>
                  <tr>
                    <td>{{ displayLang.MANAGEMENT_SUMMARY_LOGIN_COUNT_OTHER }}</td>
                    <td><nuxt-link :to="makeLoginsUrl('OTHER')" class="link-style"><span class="summary-txt">{{ loginsOtherCount }}</span> {{ displayLang.WORD_J_KEN }}</nuxt-link></td>
                  </tr>
                  <template v-if="this.isSystemAdmin">
                    <tr>
                      <th rowspan="2" class="item-name">{{ displayLang.MANAGEMENT_SUMMARY_DELETE_PLAN }}
                        <div class="mt-2 setting-button"><nuxt-link to="/delete-setting" class="btn btn-secondary"><i class="fa fa-cog" aria-hidden="true"></i> {{ displayLang.MANAGEMENT_SUMMARY_DELETE_PLAN_SETTING }}</nuxt-link></div>
                      </th>
                      <td>
                        <nuxt-link :to="makeDeletePlanUrl('TESTER')" class="link-style">{{ displayLang.MANAGEMENT_SUMMARY_DELETE_PLAN_TESTER }}</nuxt-link>
                      </td>
                      <td>
                        <a
                        href="#"
                        class="link-style"
                        @click.prevent="onClickDownload('TESTER')"
                        >
                          <span class="summary-txt">{{ deletePlanTesterCount }}</span> {{ displayLang.WORD_J_KEN }}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td><nuxt-link :to="makeDeletePlanUrl('RECORD')" class="link-style">{{ displayLang.MANAGEMENT_SUMMARY_DELETE_PLAN_RECORD }}</nuxt-link></td>
                      <td><a
                        href="#"
                        class="link-style"
                        @click.prevent="onClickDownload('RECORD')"
                      ><span class="summary-txt">{{ deletePlanRecordCount }}</span> {{ displayLang.WORD_J_KEN }}</a></td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <th rowspan="2" class="item-name">{{ displayLang.MANAGEMENT_SUMMARY_DELETE_PLAN }}</th>
                      <td>
                        {{ displayLang.MANAGEMENT_SUMMARY_DELETE_PLAN_TESTER }}
                      </td>
                      <td>
                        <a
                        href="#"
                        class="link-style"
                        @click.prevent="onClickDownload('TESTER')"
                        >
                          <span class="summary-txt">{{ deletePlanTesterCount }}</span> {{ displayLang.WORD_J_KEN }}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>{{ displayLang.MANAGEMENT_SUMMARY_DELETE_PLAN_RECORD }}</td>
                      <td>
                        <a
                        href="#"
                        class="link-style"
                        @click.prevent="onClickDownload('RECORD')">
                          <span class="summary-txt">{{ deletePlanRecordCount }}</span> {{ displayLang.WORD_J_KEN }}
                        </a>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as managementPageTypes from '@/store/types/managementPageType';
import { ActorKind, SortKey, SortOrder } from '@/store/types/adapters/loginsAdapter';
import { DeletePlanKey } from '@/store/types/adapters/deletePlanAdapter';
import * as deletePlanTypes from '@/store/types/deletePlanType'
import {
  DeletePlanRequestType,
} from '@/store/types/adapters/deletePlanAdapter';
import { Formatter } from '@/utils/Formatter'
import * as commonTypes from '@/store/types/commonType';
import * as proctorAdminPermissionIpTypes from '@/store/types/proctorAdminPermissionIpType';

export default Vue.extend({
  name: 'Index',
  components: {
    
  },
  data() {
    return {
      pollingTimer: null as (NodeJS.Timeout | null),
    } as any
  },
  created() {
    Promise.all([
      this.$store.dispatch(managementPageTypes.ACTION_MANAGEMENT_PAGE_GET_INITIAL_PARAM)
    ])
    .then(() => {
      const run = () => {
        this.$store.dispatch(managementPageTypes.ACTION_MANAGEMENT_PAGE_GET_SUMMARY)
      }

      run()
      this.pollingTimer = window.setInterval(() => {
        run()
      }, 60000)
    })
  },
  mounted() {
    // PROCTOR_ADMIN_PERMISSION_IP APIを叩いて、responseを取得してログ参照メニューの表示/非表示を判別する。
    new Promise((resolve, reject) => {
      this.$store.dispatch(proctorAdminPermissionIpTypes.ACTION_PROCTOR_ADMIN_PERMISSION_IP_PAGE_CALL_API_SELECT)
      .catch(() => {
        // エラーモーダル表示
        this.$modals.showErrorAlert('PROCTOR_ADMIN_PERMISSION_IP APIの結果取得に失敗しました')
        .finally(() => {
          reject();
        })
      })
      .then(() => {
        resolve
      });
    });
  },
  destroyed() {
    if (this.pollingTimer) {
      window.clearInterval(this.pollingTimer)
      this.pollingTimer = null
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    /**
     * ログイン者数(受験者)を取得します
     *
     * @return {number}
     */
    loginsTesterCount(): number {
      return this.$store.getters[managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_LOGINS_TESTER_COUNT]
    },
    /**
     * ログイン者数(受験者以外)を取得します
     *
     * @return {number}
     */
    loginsOtherCount(): number {
      return this.$store.getters[managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_LOGINS_OTHER_COUNT]
    },
    /**
     * 本日の削除予定数(受験者)を取得します
     *
     * @return {number}
     */
    deletePlanTesterCount(): number {
      return this.$store.getters[managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_DELETE_PLAN_TESTER_COUNT]
    },
    /**
     * 本日の削除予定数(動画)を取得します
     *
     * @return {number}
     */
    deletePlanRecordCount(): number {
      return this.$store.getters[managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_DELETE_PLAN_RECORD_COUNT]
    },
    /**
     * 接続元のIPアドレスから、ログ参照および本日削除予定の歯車ボタンの表示/非表示を判定して取得します
     *
     * @return {boolean}
     */
    isSystemAdmin(): boolean {
      return this.$store.getters[proctorAdminPermissionIpTypes.GETTER_PROCTOR_ADMIN_PERMISSION_IP_PAGE_GET_IS_VALID_IP] === 200;
    },
  },
  methods: {
    /**
     * /loginsページへのURLを生成します
     *
     * @param {string} actorKindString アクターを識別するための文字列('TESTER': ActorKind.TESTER, 'OTHER': ActorKind.OTHER) vue.jsのtemplateで定数が使えない？ので、暫定
     * @return {string}
     */
    makeLoginsUrl(actorKindString: string): string {
      const map = {
        TESTER: ActorKind.TESTER,
        OTHER: ActorKind.OTHER,
      } as any

      return `/logins?actor_kind=${map[actorKindString]}`
    },
    /**
     * /delete-planページへのURLを生成します
     *
     * @param {string} deletePlanKeyString 削除予定種別を識別するための文字列('TESTER': DeletePlanKey.TESTER, 'RECORD': DeletePlanKey.OTHER) vue.jsのtemplateで定数が使えない？ので、暫定
     * @return {string}
     */
    makeDeletePlanUrl(deletePlanKeyString: string): string {
      const map = {
        TESTER: DeletePlanKey.TESTER,
        RECORD: DeletePlanKey.RECORD,
      } as any
      let date = new Date()
      date.setDate(date.getDate() +1) 
      const tomorrowDate = Formatter.date('yyyy-MM-dd', date)
      return `/delete-plan?delete_plan_key=${map[deletePlanKeyString]}&date=${tomorrowDate}`
    },
    /**
     * 削除予定CSVダウンロードのリンククリックのイベントハンドラ
     *
     * @param {string} deletePlanKeyString 削除予定種別を識別するための文字列('TESTER': DeletePlanKey.TESTER, 'RECORD': DeletePlanKey.OTHER) vue.jsのtemplateで定数が使えない？ので、暫定
     */
    onClickDownload(deletePlanKeyString: string) {
      const map = {
        TESTER: DeletePlanKey.TESTER,
        RECORD: DeletePlanKey.RECORD,
      } as any

      let date = new Date()
      date.setDate(date.getDate() +1) 
      const tomorrowDate = Formatter.date('yyyy-MM-dd 00:00:00', date)

      const request = {
        key: map[deletePlanKeyString],
        execution_time: tomorrowDate,
      } as DeletePlanRequestType

      this.$store.dispatch(deletePlanTypes.ACTION_DELETE_PLAN_DOWNLOAD, request)
        .catch((e: any) => {
          const message = (e instanceof Error)
            ? e.message
            : (this.displayLang as any).WORD_CSV_DOWNLOAD_ERROR

          // モーダル表示
          this.$modals.showErrorAlert(message)
        })
    },
  },
});
</script>

<style></style>
