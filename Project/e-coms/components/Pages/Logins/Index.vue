<template>
  <div class="mt-4 mb-4">
    <div class="page-title">{{ displayLang.LOGINS_TITLE }}</div>
    <Form />
    <Table />
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
import Table from './Childs/Table.vue';
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as loginsPageTypes from '@/store/types/loginsPageType';

export default Vue.extend({
  name: 'Index',
  components: {
    Form,
    Table,
    BackButton,
  },
  created() {
    // この画面は、GETパラメータ付きで呼び出される可能性があるので、それに応じてstoreに値を設定する
    if ('actor_kind' in this.$route.query) {
      this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_ACTOR_KIND, this.$route.query.actor_kind)
    }
    this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_PAGE, 1)
      .then(() => this.$store.dispatch(loginsPageTypes.ACTION_LOGINS_PAGE_CALL_API_GET_LOGINS))
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style></style>
