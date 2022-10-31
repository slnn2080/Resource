<template>
  <div>
    <main class="main">
      <div class="container">
        <div class="mt-4 mb-4">
          <Index />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Index from '@/components/Pages/ExamineeSearch/Detail/Index.vue';
import * as pageTypes from '@/store/types/examineeDetailPageType';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  components: {
    Index,
  },
  head() {
    const displayLang = this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    return {
      title: displayLang.EXAMINEE_DETAIL_TITLE,
    };
  }
});
</script>

<style></style>
