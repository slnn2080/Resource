<template>
  <td>
    {{ checker.exLoginId }}
    <br>
    ({{ checker.adminName }})
  </td>
</template>

<script>
import Vue from 'vue';
import { Checker } from '@/store/types/adapters/checkersMonitoringAdapter';
export default Vue.extend({
  name: 'CheckerItem',
  props: {
    checker: {
      type: Checker,
      required: true,
    },
  },
});
</script>

<style scoped>
</style>
