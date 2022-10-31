<template>
  <div class="mt-4 mb-4">
    <div class="page-title">{{ displayLang.DELETE_PLAN_TITLE }}</div>

    <Form />

    <div class="mt-4">
      <BackButton
        :label="displayLang.MANAGEMETN_LINK_BACK"
        @click="$router.replace('/management')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Form from './Childs/Form.vue';
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as deletePlanPageTypes from '@/store/types/deletePlanPageType';

export default Vue.extend({
  name: 'Index',
  components: {
    Form,
    BackButton,
  },
  created() {
    // この画面は、GETパラメータ付きで呼び出される可能性があるので、それに応じてstoreに値を設定する
    if ('delete_plan_key' in this.$route.query) {
      this.$store.dispatch(deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DELETE_PLAN_KEY, this.$route.query.delete_plan_key)
    }
    if ('date' in this.$route.query) {
      this.$store.dispatch(deletePlanPageTypes.ACTION_DELETE_PLAN_PAGE_SET_FORM_VALUES_DATE, this.$route.query.date)
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style></style>
