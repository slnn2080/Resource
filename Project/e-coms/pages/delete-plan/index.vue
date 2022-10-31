<template>
  <div>
    <main class="main">
      <div class="container">
        <DeletePlanIndex />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import DeletePlanIndex from '@/components/Pages/DeletePlan/Index.vue';

export default Vue.extend({
  components: {
    DeletePlanIndex,
  },
  head() {
    return {
      title: (this.$store.getters[rootTypes.GETTER_DISPLAY_LANG] as any).DELETE_PLAN_TITLE,
    };
  }
});
</script>

<style></style>
