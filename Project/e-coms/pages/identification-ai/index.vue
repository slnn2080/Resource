<template>
  <div>
    <IdentificationAI />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import IdentificationAI from '@/components/Pages/Identification/IdentificationAI.vue';
export default Vue.extend({
  middleware: ['guardActorPage'],
  components: {
    IdentificationAI
  },
  head() {
    return {
      title: 'AI本人認証'
    };
  }
});
</script>

<style scoped></style>
