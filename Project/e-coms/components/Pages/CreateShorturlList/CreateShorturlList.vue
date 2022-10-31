<template>
  <div class="mt-4 mb-4">
    <Header @click="$router.replace('/create-shorturl')" />
    <CreateShorturlListTable />

    <BackButton
      :label="displayLang.MANAGEMETN_LINK_BACK"
      @click="$router.replace('/management')"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { LanguageEnum } from "~/store/enum/language";
import * as rootTypes from "@/store/types/rootType";
import BackButton from "@/components/Common/Buttons/BackButton.vue";
import Header from "@/components/Pages/CreateShorturlList/Header.vue";
import CreateShorturlListTable from "@/components/Pages/CreateShorturlList/CreateShorturlListTable.vue";

export default Vue.extend({
  name: "CreateShorturlList",
  components: {
    BackButton,
    Header,
    CreateShorturlListTable,
  },
  props: {},
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style></style>
