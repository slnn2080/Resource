<template>
  <div class="card">
    <div class="card-body">
      <ol class="page-navigation">
        <li><a href="#anchor01"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_USER_INFOMATION }}</a></li>
        <li><a href="#anchor02"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_HEADLINE }}</a></li>
        <li><a href="#anchor03"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_TEST_INFORMATION }}</a></li>
        <li><a href="#anchor11"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_EXCHANGES_TITLE }}</a></li>
        <li><a href="#anchor21"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_MARKING_SUMMARIES }}</a></li>
        <li><a href="#anchor22"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_MARKINGS }}</a></li>
        <li><a href="#anchor31"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_AI_MARKING_SUMMARIES }}</a></li>
        <li><a href="#anchor32"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i>{{ displayLang.EXAMINEE_DETAIL_AI_MARKINGS }}</a></li>
      </ol>

      <!-- 受験者情報/受験者ログ/試験情報 -->
      <ExamInfo >
        <template v-slot:user-infomation-anchor><a :id="'anchor01'"></a></template>
        <template v-slot:examinee-log-anchor>   <a :id="'anchor02'"></a></template>
        <template v-slot:test-infomation-anchor><a :id="'anchor03'"></a></template>
      </ExamInfo>

      <!-- 本人認証時コメント -->
      <a :id="'anchor11'"></a>
      <Exchanges
      />

      <!-- 不正情報一覧/ダウンロード/不正報告情報 -->
      <Markings
        :is-download="true"
        :marking-summaries="testerDetail.markingSummaries"
        :score="testerDetail.markingTotalScore"
        :markings="testerDetail.markings"
        :records="testerDetail.records"
      >
        <template v-slot:marking-summaries-anchor><a :id="'anchor21'"></a></template>
        <template v-slot:markings-anchor>         <a :id="'anchor22'"></a></template>

        <template v-slot:marking-summaries-headline>{{ displayLang.EXAMINEE_DETAIL_MARKING_SUMMARIES }}</template>
        <template v-slot:markings-headline>{{ displayLang.EXAMINEE_DETAIL_MARKINGS }}</template>
      </Markings>

      <!-- AI解析不正情報一覧/AI解析不正報告情報 -->
      <Markings
        :is-download="false"
        :marking-summaries="testerDetail.aiMarkingSummaries"
        :score="testerDetail.aiMarkingTotalScore"
        :markings="testerDetail.aiMarkings"
        :records="testerDetail.records"
        :count-label="displayLang.EXAMINEE_DETAIL_AI_COUNT_LABEL"
        :score-label="displayLang.EXAMINEE_DETAIL_AI_SCORE_LABEL"
      >
        <template v-slot:marking-summaries-anchor><a :id="'anchor31'"></a></template>
        <template v-slot:markings-anchor>         <a :id="'anchor32'"></a></template>

        <template v-slot:marking-summaries-headline>{{ displayLang.EXAMINEE_DETAIL_AI_MARKING_SUMMARIES }}</template>
        <template v-slot:markings-headline>{{ displayLang.EXAMINEE_DETAIL_AI_MARKINGS }}</template>
      </Markings>
    </div>

    <div
      v-if="!this.disabledBackButton"
      class="card-footer text-left"
    >
      <button
        type="button"
        class="btn btn-sm btn-secondary"
        @click.prevent="$router.push('/examinees')"
      >
        {{ displayLang.EXAMINEE_DETAIL_BUTTONS_BACK }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import ExamInfo from './Childs/ExamInfo.vue';
import Exchanges from './Childs/Exchanges.vue';
import Markings from './Childs/Markings.vue';
import * as rootTypes from '@/store/types/rootType';
import * as examineeDetailPageTypes from '@/store/types/examineeDetailPageType';
import { TesterDetailAdapter, TesterDetailRequestType, TesterDetailParamLatestMode } from '@/store/types/adapters/testerDetailAdapter';

export default Vue.extend({
  name: 'ExamineeDetail',
  components: {
    ExamInfo,
    Exchanges,
    Markings,
  },
  data() {
    return {
      disabledBackButton: false as boolean,
    }
  },
  created() {
    // URLにクエリがある場合の処理
    try {
      // クエリをパースする
      let decodedQueries = {} as any
      if (location.search.length > 0) {
        location.search
          .slice(1)
          .split('&')
          .forEach(s => {
            const a = s.split('=')
            decodedQueries[a[0]] = JSON.parse(decodeURIComponent(a[1]))
          })
      }

      // 「戻る」ボタン非表示設定
      if (decodedQueries['disabledBackButton']) {
        this.disabledBackButton = true
      }
    } catch (e) {
      // nop
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerDetail(): TesterDetailAdapter {
      return this.$store.getters[examineeDetailPageTypes.GETTER_EXAMINEE_DETAIL_PAGE_GET_TESTER_DETAIL];
    },
  },
  methods: {
  },
});
</script>

<style scoped></style>
