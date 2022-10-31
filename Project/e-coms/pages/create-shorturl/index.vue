<template>
  <div>
    <main class="main">
      <div class="container">
        <CreateShorturl />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CreateShorturl from '@/components/Pages/CreateShorturl/CreateShorturl.vue';

export default Vue.extend({
  components: {
    CreateShorturl,
  },
  head() {
    return {
      title: 'URL登録 / Remote Testing'
    };
  }
});
</script>

<style></style>