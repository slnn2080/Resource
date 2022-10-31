<template>
  <div class="card">
    <div class="card-header header-light">{{ displayLang.EXAMINEES_CONDITIONS_HEADER_TITLE }}</div>
    <ValidationObserver ref="conditionsObserver" v-slot="{ invalid }" slim>
      <div class="card-body">
        <Group
          v-if="isSystemManager"
        />
        <div class="form-row">
          <LoginId />
          <ExamName />
          <IsLikeSearch />
        </div>
        <hr class="mt-0">
        <div class="headline-sm">{{ displayLang.EXAMINEES_CONDITIONS_HEADLINE_TITLE }}</div>
        <div class="form-row">
          <TestName />
          <Region />
          <TestAtDateTime />
        </div>
        <div class="form-row">
          <Record />
          <WithMark />
<!--
          <CheatingLevel />
-->
          <Score />
        </div>
        <div class="form-row">
          <AiAnalysisFlag />
          <AiAnalysisBatchFlag />
          <AiNameMatch />
        </div>
        <div class="form-row">
          <MarkId />
        </div>
      </div>
      <div class="card-footer text-right">
        <ClearButton />
        <SearchButton :disabled="invalid" />
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import Group from './Childs/Group.vue';
import ExamName from './Childs/ExamName.vue';
import LoginId from './Childs/LoginId.vue';
import IsLikeSearch from './Childs/IsLikeSearch.vue';
import TestName from './Childs/TestName.vue';
import Region from './Childs/Region.vue';
import TestAtDateTime from './Childs/TestAtDateTime.vue';
import Record from './Childs/Record.vue';
import WithMark from './Childs/WithMark.vue';
import CheatingLevel from './Childs/CheatingLevel.vue';
import Score from './Childs/Score.vue';
import AiAnalysisFlag from './Childs/AiAnalysisFlag.vue';
import AiAnalysisBatchFlag from './Childs/AiAnalysisBatchFlag.vue';
import AiNameMatch from './Childs/AiNameMatch.vue';
import MarkId from './Childs/MarkId.vue';
import ClearButton from './Childs/ClearButton.vue';
import SearchButton from './Childs/SearchButton.vue';
import { Actor } from '@/store/enum/Actor';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import * as loginTypes from '@/store/types/loginType';
import * as rootTypes from '@/store/types/rootType';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';

export default Vue.extend({
  name: 'Conditions',
  components: {
    Group,
    LoginId,
    ExamName,
    IsLikeSearch,
    TestName,
    Region,
    TestAtDateTime,
    Record,
    WithMark,
    CheatingLevel,
    Score,
    AiAnalysisFlag,
    AiAnalysisBatchFlag,
    AiNameMatch,
    MarkId,
    ClearButton,
    SearchButton,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    /**
     * システム管理者か調べます
     *
     * @return {boolean}
     */
    isSystemManager(): boolean {
      const inParams = this.$store.getters[loginTypes.GETTER_LOGIN] as LoginAdapter;
      return inParams.actor == Actor.SYSTEM_MANAGER;
    },
  },
  created() {
    // 検索条件クリア
    // これを行うと、詳細画面から戻るとテーブルがリセットされるので行わない
    // this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_CLEAR_FORM_VALUES)

    // 検索条件の選択肢取得
    this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS)
  },
  mounted() {
    // ValidationObserverがこのタイミングではまだ完了していないので、nextTickで初期化のタイミングを待つ
    // @see https://jp.vuejs.org/v2/api/index.html#mounted
    this.$nextTick(() => {
      const id = window.setTimeout(() => {
        if (!this.$refs.conditionsObserver) {
          return;
        }
        window.clearTimeout(id);

        (this.$refs.conditionsObserver as any).validate(false);
      }, 0);
    });
  },
});
</script>
