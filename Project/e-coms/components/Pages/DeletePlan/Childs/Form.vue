<template>
  <div class="form-inline">
    <select
      id="testing_organization"
      class="form-control mr-1"
      v-model="deletePlanKey"
    >
      <option
        v-for="(option, index) in deletePlanKeyOptions"
        :value="option.value"
        :key="index"
      >{{ option.label }}</option>
    </select>
    <input
      type="date"
      class="form-control mr-1"
      v-model="date"
    >
    <button
      type="button"
      class="btn btn-primary"
      :disabled="delayFlg"
      @click="onClickDownload"
    >{{ displayLang.DELETE_PLAN_FORM_CSV_DOWNLOAD }}</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as deletePlanPageTypes from '@/store/types/deletePlanPageType';
import { DeletePlanKey } from '@/store/types/adapters/deletePlanAdapter';

export default Vue.extend({
  name: 'Form',
  components: {
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
    deletePlanKeyOptions(): {value: DeletePlanKey, label: string}[] {
      return [
        {value: DeletePlanKey.TESTER, label: (this.displayLang as any).DELETE_PLAN_FORM_DELETE_PLAN_KEY_TESTER},
        {value: DeletePlanKey.RECORD, label: (this.displayLang as any).DELETE_PLAN_FORM_DELETE_PLAN_KEY_RECORD},
      ]
    },
    deletePlanKey: {
      get(): DeletePlanKey {
        return this.$store.getters[deletePlanPageTypes.GETTER_DELETE_PLAN_PAGE_GET_FORM_VALUES_DELETE_PLAN_KEY]
      },
      set(value: DeletePlanKey) {
        this.$store.dispatch(deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DELETE_PLAN_KEY, value)
      }
    },
    date: {
      get(): string {
        return this.$store.getters[deletePlanPageTypes.GETTER_DELETE_PLAN_PAGE_GET_FORM_VALUES_DATE]
      },
      set(value: string) {
        this.$store.dispatch(deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DATE, value)
      }
    },
  },
  methods: {
    /**
     * 「CSVダウンロード」ボタンのイベントハンドラ
     */
    onClickDownload() {
      let delay = new Promise((resolve, reject) => {
        console.log("DOWNLOADING")
        this.delayFlg = true;
        resolve(true)
      })

      delay.then((flg) => {
        return new Promise((resolve, reject) => {
          const DL = this.$store.dispatch(deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_DOWNLOAD)
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
      }).catch(() => {})
    },
  },
});
</script>

<style></style>


