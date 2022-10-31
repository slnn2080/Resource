<template>
  <main class="main">
    <Index />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import Index from '@/components/Pages/ExamEnd/Index.vue';

export default Vue.extend({
  middleware: ['guardActorPage'],
  components: {
    Index,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
  },
  head() {
    return {
      title: '試験終了'
    };
  }
});
</script>

<style></style>
