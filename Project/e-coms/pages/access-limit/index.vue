<template>
  <div>
    <main class="main">
      <div class="container">
        <Index />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import Index from '@/components/Pages/AccessLimit/Index.vue';

export default Vue.extend({
  components: {
    Index,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  head() {
    return {
      title: (this.$store.getters[rootTypes.GETTER_DISPLAY_LANG] as any).ACCESS_LIMIT,
    };
  }
});
</script>

<style></style>
