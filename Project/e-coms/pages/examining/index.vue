<template>
  <div style="width:100%; height:100%;">
    <Examining />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Examining from '@/components/Pages/Examining/Examining.vue';
export default Vue.extend({
  middleware: ['guardActorPage'],
  components: {
    Examining
  },
  head() {
    return {
      title: '試験中'
    };
  }
});
</script>

<style scoped>
</style>
