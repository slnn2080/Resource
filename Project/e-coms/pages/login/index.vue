<template>
  <main class="main">
    <Login />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Login from '../../components/Pages/Login/Login.vue';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  middleware: ['loginAuth'],
  components: {
    Login
  },
  computed: {
    ...mapGetters({ inParams: rootTypes.GETTER_STARTUP })
  },
  head() {
    return {
      title: 'ログイン'
    };
  }
});
</script>

<style lang="scss" scoped></style>
