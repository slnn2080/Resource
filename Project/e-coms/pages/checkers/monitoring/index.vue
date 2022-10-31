<template>
  <div>
    <main class="main">
      <div class="container">
        <Monitoring />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Monitoring from '@/components/Pages/Checkers/Monitoring/Monitoring.vue';
export default Vue.extend({
  components: {
    Monitoring,
  },
  head() {
    return {
      title: '監視者マッチング状況'
    };
  }
});
</script>

<style scoped>

</style>
