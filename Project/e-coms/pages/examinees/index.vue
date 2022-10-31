<template>
  <div>
    <main class="main">
      <div class="container">
        <Examinees />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import Examinees from '@/components/Pages/Examinees/Examinees.vue';

export default Vue.extend({
  components: {
    Examinees,
  },
  head() {
    return {
      title: (this.$store.getters[rootTypes.GETTER_DISPLAY_LANG] as any).MANAGEMENT_EXAMINEES,
    };
  }
});
</script>

<style></style>
