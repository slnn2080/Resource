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
import * as rootTypes from '@/store/types/rootType';
import Index from '@/components/Pages/Logview/Index.vue';

export default Vue.extend({
  components: {
    Index,
  },
  head() {
    return {
      title: (this.$store.getters[rootTypes.GETTER_DISPLAY_LANG] as any).LOGVIEW_TITLE,
    };
  }
});
</script>

<style></style>
