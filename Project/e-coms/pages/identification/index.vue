<template>
  <div>
    <Identification />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Identification from '@/components/Pages/Identification/Identification.vue';
export default Vue.extend({
  middleware: ['guardActorPage'],
  components: {
    Identification
  },
  head() {
    return {
      title: '本人認証'
    };
  }
});
</script>

<style scoped></style>
