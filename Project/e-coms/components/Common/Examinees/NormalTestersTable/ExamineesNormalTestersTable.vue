<template>
  <div>
    <template v-if="displayCount > 0">
      <div class="row table-option">
        <div class="col-6">
          <div
            class="page-info"
          >
            <span
              v-html="displayText"
            >
            </span>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="!canDownload || delayFlg"
              @click="onClickDownload"
            >{{ displayLang.EXAMINEES_TABLE_CSV_DOWNLOAD }}</button>
          </div>
        </div>
        <TestersTablePaginate
          :is-top="true"
          :page-count="pageCount"
          :page="page"
          @click-pagination="onClickPaginate"
        />
      </div>
      <TesterList />
      <div class="table_option-bottom">
        <TestersTablePaginate
          :is-top="false"
          :page-count="pageCount"
          :page="page"
          @click-pagination="onClickPaginate"
        />
      </div>
    </template>
    <template v-else>
      <div class="row table-option">
        <div class="col-6">
          <div class="page-info">
            <button
              type="button"
              class="btn btn-primary"
              :disabled="!canDownload || delayFlg"
              @click="onClickDownload"
            >{{ displayLang.EXAMINEES_TABLE_CSV_DOWNLOAD }}</button>
          </div>
        </div>
      </div>
      <div class="alert alert-success search-result"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>{{ displayLang.EXAMINEES_TABLE_EMPTY_RESULT_MESSAGE }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TestersTablePaginate from '../TestersTableCommon/TestersTablePaginate.vue';
import TesterList from './Childs/TesterList.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';

export default Vue.extend({
  name: 'ExamineesNormalTestersTable',
  components: {
    TestersTablePaginate,
    TesterList,
  },
  data() {
    return {
      delayFlg: false,
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    /**
     * レコードの総件数
     *
     * @return {number}
     */
    count(): number {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_COUNT];
    },
    /**
     * ページ総数
     *
     * @return {number}
     */
    pageCount(): number {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_PAGE_COUNT];
    },
    /**
     * 現在のページ番号
     *
     * @return {number}
     */
    page(): number {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_PAGE];
    },
    /**
     * テーブルに表示するレコード数
     *
     * @return {string}
     */
    displayCount(): number {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_NORMAL_TESTERS].length;
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
    /**
     * 「検索」ボタンを押下したか
     *
     * 「CSVダウンロード」ボタン押下を行う前に「検索」ボタンが押下を行わなければいけないため
     * @see https://e-coms.backlog.jp/view/AI_PROCTOR-1548
     */
    canDownload(): boolean {
      return (this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_FORM_VALUES_FOR_DOWNLOAD] != null)
        && (this.count > 0)
    },
  },
  methods: {
    /**
     * ページネーションのイベントハンドラ
     */
    onClickPaginate(page: number) {
      this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_PAGE, page)
        .then(() => this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_GET_TESTERS));
    },
    /**
     * ダウンロードボタンのイベントハンドラ
     */
    onClickDownload() {
      let delay = new Promise((resolve, reject) => {
        console.log("DOWNLOADING")
        this.delayFlg = true;
        resolve(true)
      })

      delay.then((flg) => {
        return new Promise((resolve, reject) => {
          const DL = this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_DOWNLOAD_TESTERS)
          .catch((e) => {
            const message = (e instanceof Error)
              ? e.message
              : (this.displayLang as any).WORD_CSV_DOWNLOAD_ERROR

            // モーダル表示
            this.$modals.showErrorAlert(message)
              .finally(() => reject(e))
          })
          setTimeout(() => {
            resolve(flg = DL)
          }, 50)
        })
      }).then((flg) => {
        setTimeout(() => {
        console.log("DONE")
        this.delayFlg = false 
        }, 3000)
        return flg
      })
    },
  },
});
</script>

<style></style>
