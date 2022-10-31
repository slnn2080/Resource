<template>
  <main class="main">
    <ManagementIndex />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '@/store/enum/language';
import ManagementIndex from '@/components/Pages/Management/Index.vue';

export default Vue.extend({
  components: {
    ManagementIndex,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style scoped>

</style>
