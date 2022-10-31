<template>
  <div>
    <Terms />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Terms from '@/components/Pages/Terms/Terms.vue';
export default Vue.extend({
  components: {
    Terms
  },
  head() {
    return {
      title: '利用規約'
    };
  }
});
</script>

<style scoped></style>
