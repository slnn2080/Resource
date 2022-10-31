<template>
  <div class="mt-4 mb-4">

    <div class="card mb-4">
      <div class="card-header header-light">
        {{ displayLang.ACCESS_LIMIT_TITLE }}
      </div>
      <Form />
    </div>

    <Table />

    <BackButton
      :label="displayLang.MANAGEMETN_LINK_BACK"
      @click="$router.replace('/management')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import Form from './Childs/Form.vue';
import Table from './Childs/Table.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from "~/store/types/commonType";
import * as pageTypes from '@/store/types/accessLimitPageType';

export default Vue.extend({
  name: 'Index',
  components: {
    Form,
    Table,
    BackButton,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  mounted() {
    // 一覧取得
    this.$store.dispatch(pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_SELECT)
      .then(() => {
      })
      .catch(() => {
        // エラーモーダル表示
        this.$modals.showErrorAlert('一覧の更新に失敗しました。')
      })
  },
});
</script>

<style></style>
