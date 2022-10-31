<template>
  <div class="container">
    <p></p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import * as types from '@/store/types/rootType';

export default Vue.extend({
  middleware: [
    'initCheck'
  ],
  computed: {
    ...mapGetters({ inParams: types.GETTER_STARTUP })
  },
  created() {},
  head() {
    return {
      title: 'Remote Testing'
    };
  }
});
</script>

<style></style>
