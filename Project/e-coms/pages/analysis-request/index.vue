<template>
  <div>
    <main class="main">
      <div class="container">
        <AnalysisRequest />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AnalysisRequest from '@/components/Pages/AnalysisRequest/AnalysisRequest.vue';

export default Vue.extend({
  components: {
    AnalysisRequest,
  },
  head() {
    return {
      title: 'AI解析依頼'
    };
  }
});
</script>

<style></style>
