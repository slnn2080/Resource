<template>
  <div>
    <template v-if="displayCount > 0">
      <div class="row table-option">
        <div class="col-6">
          <div
            class="page-info"
            v-html="displayText"
          ></div>
        </div>
        <TablePaginate
          :is-top="true"
          :page-count="pageCount"
          :page="page"
          @click-pagination="onClickPaginate"
        />
      </div>
      <table class="table table-bordered table-striped user-list">
        <thead>
          <tr>
            <template v-for="item in headers">
              <template v-if="item.smallLabelClass">
                <th :class="item.wpClass"><span :class="item.smallLabelClass">{{ item.label }}</span></th>
              </template>
              <template v-else>
                <th :class="item.wpClass">{{ item.label }}</th>
              </template>
            </template>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="item in list"
          >
            <tr
              class="clickable"
              @click="onClickRecord(item)"
            >
              <td>{{ item.exLoginId }}</td>
              <td>{{ item.group }}</td>
              <td>{{ formatActor(item.actor) }}</td>
              <td>{{ item.target }}</td>
              <td>{{ formatIsUse(item.isMcStartup, item) }}</td>
              <td class="text-center"><span class="text-s12">{{ formatStatus(item.status, item) }}</span></td>
              <td class="text-center">{{ formatIntBool(item.kicked, item) }}</td>
              <td class="text-center">{{ formatIntBool(item.rejected, item) }}</td>
              <td class="text-center">{{ item.updatedAt }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="table-option-bottom">
        <TablePaginate
          :is-top="false"
          :page-count="pageCount"
          :page="page"
          @click-pagination="onClickPaginate"
        />
      </div>
    </template>
    <template v-else>
      <div class="alert alert-success search-result"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>{{ displayLang.LOGINS_TABLE_EMPTY_RESULT_MESSAGE }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import TablePaginate from './TablePaginate.vue';
import * as rootTypes from '@/store/types/rootType';
import { LoginsItem, ActorKind, SortKey, SortOrder } from '@/store/types/adapters/loginsAdapter';
import * as loginsPageTypes from '@/store/types/loginsPageType';
import { Actor, ActorUtils } from '@/store/enum/Actor';

export default Vue.extend({
  name: 'Table',
  components: {
    TablePaginate,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    /**
     * 現在のページ番号
     *
     * @return {number}
     */
    page(): number {
      return this.$store.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_PAGE]
    },
    /**
     * ページ総数
     *
     * @return {number}
     */
    pageCount(): number {
      return this.$store.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_PAGE_COUNT]
    },
    /**
     * レコードの総件数
     *
     * @return {number}
     */
    count(): number {
      return this.$store.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_COUNT]
    },
    /**
     * テーブルに表示するレコード数
     *
     * @return {string}
     */
    displayCount(): number {
      return this.$store.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_LIST].length
    },
    /**
     * '全 NN 件中 NN件〜NN件 を表示'のフォーマットのテキスト
     *
     * @return {string}
     */
    displayText(): string {
      const ZEN = (this.displayLang as any).WORD_J_ZEN,
            KEN_TYUU = (this.displayLang as any).WORD_J_KEN_TYUU,
            KEN = (this.displayLang as any).WORD_J_KEN,
            KARA = (this.displayLang as any).WORD_J_KARA,
            WO_HYOUJI = (this.displayLang as any).WORD_J_WO_HYOUJI;
      const count = this.count,
            page = this.page,
            from = ((page - 1) * 10 + 1),
            to = (from + this.displayCount - 1);

      return `${ZEN} <strong>${count}</strong> ${KEN_TYUU} <strong> ${from}${KEN}${KARA}${to}${KEN}</strong> ${WO_HYOUJI}`
    },
    headers(): {wpClass: string; sortKey: SortKey; label: string; smallLabelClass: string;}[] {
      return [
        {wpClass: 'w10p', sortKey: SortKey.LOGIN_ID,      label: (this.displayLang as any).LOGINS_TABLE_TH_LOGIN_ID,      smallLabelClass: ''},
        {wpClass: 'w10p', sortKey: SortKey.GROUP_ID,      label: (this.displayLang as any).LOGINS_TABLE_TH_GROUP_ID,      smallLabelClass: ''},
        {wpClass: 'w15p', sortKey: SortKey.ACTOR,         label: (this.displayLang as any).LOGINS_TABLE_TH_ACTOR,         smallLabelClass: ''},
        {wpClass: 'w10p', sortKey: SortKey.TARGET,        label: (this.displayLang as any).LOGINS_TABLE_TH_TARGET,        smallLabelClass: ''},
        {wpClass: 'w10p', sortKey: SortKey.IS_MC_STARTUP, label: (this.displayLang as any).LOGINS_TABLE_TH_IS_MC_STARTUP, smallLabelClass: ''},
        {wpClass: 'w10p', sortKey: SortKey.STATUS,        label: (this.displayLang as any).LOGINS_TABLE_TH_STATUS,        smallLabelClass: ''},
        {wpClass: 'w10p', sortKey: SortKey.KICKED,        label: (this.displayLang as any).LOGINS_TABLE_TH_KICKED,        smallLabelClass: 'text-s11'},
        {wpClass: 'w10p', sortKey: SortKey.REJECTED,      label: (this.displayLang as any).LOGINS_TABLE_TH_REJECTED,      smallLabelClass: ''},
        {wpClass: 'w15p', sortKey: SortKey.UPDATED_AT,    label: (this.displayLang as any).LOGINS_TABLE_TH_UPDATED_AT,    smallLabelClass: ''},
      ]
    },
    list(): LoginsItem[] {
      return this.$store.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_LIST]
    },
  },
  methods: {
    /**
     * アクターを文字列に変換します
     *
     * @param {Actor} actor
     * @param {LoginsItem} item
     * @return {string}
     */
    formatActor(actor: Actor): string {
      return ActorUtils.toString(actor, this.displayLang)
    },
    /**
     * 「利用する」「利用しない」に変換します
     *
     * @param {any} value
     * @param {LoginsItem} item
     * @return {string}
     */
    formatIsUse(value: any, item: LoginsItem): string {
      if (item.actor != Actor.TESTER) {
        return ''
      }

      return value
        ? (this.displayLang as any).WORD_USE
        : (this.displayLang as any).WORD_NOT_USE
    },
    /**
     * 「ログイン済み」等に変換します
     *
     * @param {any} value
     * @param {LoginsItem} item
     * @return {string}
     */
    formatStatus(value: any, item: LoginsItem): string {
      if (item.actor != Actor.TESTER) {
        return ''
      }

      const map: {[key:number]: string} = {
        1: (this.displayLang as any).WORD_EXAM_LOGINS_STATUS_01,
        2: (this.displayLang as any).WORD_EXAM_LOGINS_STATUS_02,
        3: (this.displayLang as any).WORD_EXAM_LOGINS_STATUS_03,
        4: (this.displayLang as any).WORD_EXAM_LOGINS_STATUS_04,
        5: (this.displayLang as any).WORD_EXAM_LOGINS_STATUS_05,
        6: (this.displayLang as any).WORD_EXAM_LOGINS_STATUS_06,
        7: (this.displayLang as any).WORD_EXAM_LOGINS_STATUS_07,
      }
      return map[value] || ''
    },
    /**
     * 「0」「1」に変換します
     *
     * @param {any} value
     * @param {LoginsItem} item
     * @return {string}
     */
    formatIntBool(value: any, item: LoginsItem): string {
      if (item.actor != Actor.TESTER) {
        return ''
      }

      return value
        ? '1'
        : '0'
    },
    /**
     * ページネーションのイベントハンドラ
     */
    onClickPaginate(page: number) {
      // ページ数を設定
      this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_PAGE, page)
        .then(() => this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_CALL_API_GET_LOGINS))
    },
    /**
     * レコードクリックのイベントハンドラ
     */
    onClickRecord(item: LoginsItem) {
      if (item.actor != Actor.TESTER) {
        return
      }

      const actorKind = this.$store.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_FORM_VALUES_ACTOR_KIND]
      this.$window.openChildWindow(`/examinees/${item.examUserId}?disabledBackButton=1`, {examUserId: item.examUserId}, 'childwin')
    },
  },
});
</script>

<style></style>

