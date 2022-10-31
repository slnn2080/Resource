<template>
  <div>
    <main class="main">
      <div class="container">
        <DeleteSettingIndex />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import DeleteSettingIndex from '@/components/Pages/DeleteSetting/Index.vue';

export default Vue.extend({
  components: {
    DeleteSettingIndex,
  },
  head() {
    return {
      title: (this.$store.getters[rootTypes.GETTER_DISPLAY_LANG] as any).DELETE_INFO_TITLE,
    };
  }
});
</script>

<style></style>
