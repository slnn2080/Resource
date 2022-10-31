<template>
  <div class="mt-4 mb-4">
    <div class="page-title">{{ displayLang.LOGVIEW_TITLE }}</div>

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
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  name: 'Index',
  components: {
    BackButton,
  },
  mounted() {
    // TODO: 未実装
    this.$modals.showErrorAlert('未実装')
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style></style>
