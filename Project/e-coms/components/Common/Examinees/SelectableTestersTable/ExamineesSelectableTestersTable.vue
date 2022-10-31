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
  name: 'ExamineesSelectableTestersTable',
  components: {
    TestersTablePaginate,
    TesterList,
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
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_SELECTABLE_TESTERS].length;
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
  },
  methods: {
    /**
     * ページネーションのイベントハンドラ
     */
    onClickPaginate(page: number) {
      this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_PAGE, page)
        .then(() => this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_GET_TESTERS));
    },
  },
});
</script>

<style></style>
