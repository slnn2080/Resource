<template>
  <button
    type="button"
    class="btn btn-sm btn-primary"
    :disabled="disabled || delayFlg"
    @click="click"
  >{{ displayLang.EXAMINEES_CONDITIONS_BUTTONS_SEARCH }}</button>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';

export default Vue.extend({
  name: 'SearchButton',
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
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
  },
  methods: {
    click() {
      let delay = new Promise((resolve, reject) => {
        console.log("SEARCHING")
        this.delayFlg = true;
        resolve(true)
      })

      delay.then((flg) => {
        return new Promise((resolve, reject) => {
          this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_PAGE, 1)
          const testers = this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_GET_TESTERS)
          .catch((e) => {
            const message = (e instanceof Error)
              ? e.message
              : (this.displayLang as any).WORD_CSV_SEARCH_ERROR

            // モーダル表示
            this.$modals.showErrorAlert(message)
              .finally(() => reject(e))
          })
          setTimeout(() => {
            resolve(flg = testers)
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

<style scoped></style>
