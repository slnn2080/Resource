<template>
  <div class="card mb-4">
    <div class="card-header header-light">
      {{ displayLang.CREATE_SHORTURL_LIST_TITLE }}
    </div>
    <div class="card-footer text-right">
      <button
        type="button"
        class="btn btn-sm btn-primary"
        @click.prevent.stop="$emit('click')"
      >
        {{ displayLang.CREATE_SHORTURL_LIST_INSERT_BUTTON_LABEL }}
      </button>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { LanguageEnum } from "~/store/enum/language";
import * as rootTypes from "@/store/types/rootType";

export default Vue.extend({
  name: "Header",
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style></style>
