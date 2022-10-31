<template>
  <ValidationObserver ref="analysisRequestFormObserver" v-slot="{ invalid, errors }" slim>
    <div class="card mt-4 mb-4">
      <div class="card-body">
        <div v-if="getErrorMessage(errors)" class="row">
          <div class="col-3"></div>
          <div class="col-6">
            <div class="alert alert-danger">
            {{ getErrorMessage(errors) }}
            </div>
          </div>
          <div class="col-3"></div>
        </div>

        <div class="form-row">
          <div class="col-3"></div>

          <ValidationProvider vid="analysysInseq" :name="displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_NUMBER" rules="required|numeric" slim>
            <div class="form-group col-3">
              <label for="request_number">{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_NUMBER }}</label>
              <input id="request_number" v-model="analysisInseq" type="text" class="form-control">
            </div>
          </ValidationProvider>

          <ValidationProvider vid="analysisStatus" :name="displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_LEVEL" rules="required" slim>
            <div class="form-group col-3">
              <label for="analysis_point">{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_LEVEL }}</label>
              <select id="analysis_point" v-model="analysisStatus" class="form-control">
                <option :value="null">-</option>
                <option value="1">{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_LEVEL_01 }}</option>
                <option value="2">{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_LEVEL_02 }}</option>
                <option value="3">{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_LEVEL_03 }}</option>
                <option value="4">{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_LEVEL_04 }}</option>
                <option value="5">{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_REQUEST_LEVEL_05 }}</option>
              </select>
            </div>
          </ValidationProvider>

          <div class="col-3"></div>
        </div>
      </div>
      <div class="card-footer text-center">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="invalid"
          @click.prevent.stop="onClickSubmit"
        >{{ displayLang.ANALYSIS_REQUEST_PAGE_REQUEST_FORM_SUBMIT_LABEL }}</button>
      </div>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as pageTypes from '@/store/types/analysisRequestPageType';
import {
  AnalysisRequestFormValues,
  AnalysisRequestPageAdapter,
} from '@/store/types/adapters/analysisRequestPageAdapter';
import {AnalysisRequestRequestApiAdapter} from "~/store/types/adapters/analysisRequestRequestApiAdapter";

export default Vue.extend({
  name: 'AnalysisRequestForm',
  props: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    formValues: {
      get(): AnalysisRequestFormValues {
        return this.$store.getters[pageTypes.GETTER_ANALYSIS_REQUEST_PAGE_GET_FORM_VALUES];
      },
      set(value: AnalysisRequestFormValues) {
        this.$store.dispatch(pageTypes.ACTION_ANALYSIS_REQUEST_PAGE_SET_FORM_VALUES, value);
      },
    },
    analysisInseq: {
      get(): number | null {
        return this.formValues.analysisInseq;
      },
      set(value: number | null) {
        this.formValues.analysisInseq = value;
      },
    },
    analysisStatus: {
      get(): number | null {
        return this.formValues.analysisStatus;
      },
      set(value: number | null) {
        this.formValues.analysisStatus = value;
      },
    },
  },
  created() {
    this.$store.dispatch(pageTypes.ACTION_ANALYSIS_REQUEST_PAGE_CLEAR_FORM_VALUES);
  },
  methods: {
    getErrorMessage(errors: {[key:string]:string[];}): string {
      for (const inputName in errors) {
        const messages = errors[inputName];
        if (messages.length > 0) {
          return messages[0];
        }
      }
      return '';
    },
    onClickSubmit() {
      const formValues = this.$store.getters[pageTypes.GETTER_ANALYSIS_REQUEST_PAGE_GET_FORM_VALUES];
      const selectedTesters = this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_SELECTED_TESTERS];
      // 受験者が選択されていなければ、エラーメッセージを表示しリクエストAPIは実行しない
      if (selectedTesters.length === 0) {
        const message = (this.displayLang as any).ANALYSIS_REQUEST_PAGE_REQUEST_MESSAGE_PLEASE_SELECT_EXAM_USER;

        // モーダル表示
        this.$modals.showErrorAlert(message)

        return;
      }

      this.$store.dispatch(pageTypes.ACTION_ANALYSIS_REQUEST_PAGE_CALL_API_ANALYSIS_REQUEST_REQUEST)
        .then((adapter: AnalysisRequestRequestApiAdapter) => {
          // モーダル表示
          if (!adapter.message) {
            this.$modals.showSuccessAlert('解析依頼は成功しました。')
          } else {
            this.$modals.showCautionAlert('一部の解析依頼のみ成功しました。\n以下のファイルは依頼から除外されました。\n' + adapter.message)
          }
        })
        .catch((adapter: AnalysisRequestRequestApiAdapter) => {
          // モーダル表示
          this.$modals.showErrorAlert('解析依頼は失敗しました。\nエラー内容\n' + adapter.message)
        })
    },
  },
});
</script>

<style></style>
