<template>
  <tr>
    <CheckerItem :checker="matching.checker" />
    <TesterItem v-for="(tester, index) in testers" :key="index" :tester="tester" />
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import CheckerItem from './CheckerItem.vue';
import TesterItem from './TesterItem.vue';
import { Matching, Tester } from '@/store/types/adapters/checkersMonitoringAdapter';
export default Vue.extend({
  name: 'MatchingItem',
  components: {
    CheckerItem,
    TesterItem,
  },
  props: {
    matching: {
      type: Matching,
      required: true,
    },
  },
  computed: {
    testers(): Tester[] {
      const testers: Tester[] = [];
      const length = this.matching.testers ? this.matching.testers.length : 0;
      for (let i = 0; i < 5; i++) {
        if (i < length) {
          testers.push(this.matching.testers[i]);
        } else {
          testers.push(new Tester());
        }
      }
      return testers;
    },
  },
});
</script>

<style scoped>
</style>
