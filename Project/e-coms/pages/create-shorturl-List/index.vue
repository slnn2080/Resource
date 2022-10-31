<template>
  <div>
    <main class="main">
      <div class="container">
        <CreateShorturlList />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CreateShorturlList from '@/components/Pages/CreateShorturlList/CreateShorturlList.vue';

export default Vue.extend({
  components: {
    CreateShorturlList,
  },
  head() {
    return {
      title: 'URL登録一覧 / Remote Testing'
    };
  }
});
</script>

<style></style>