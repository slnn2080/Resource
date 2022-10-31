<template>
  <div>
    <Monitoring />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Monitoring from '../../components/Pages/Monitoring/Monitoring.vue';
import * as rootTypes from '@/store/types/rootType';
export default Vue.extend({
  middleware: ['guardActorPage'],
  components: {
    Monitoring
  },
  computed: {
    ...mapGetters({ inParams: rootTypes.GETTER_STARTUP })
  },
  mounted() {},
  methods: {},
  head() {
    return {
      title: '監視'
    };
  }
});
</script>

<style scoped></style>
