<template>
  <th class="sort-th" :class="classNames" @click="click">
    {{ label }}
    <span class="sort-icon">
      <i v-if="sortKey !== currentSortKey || sortOrder === 1" class="fa fa-caret-up" aria-hidden="true"></i>
      <i v-else class="fa fa-caret-down" aria-hidden="true"></i>
    </span>
  </th>
</template>

<script lang="ts">
import Vue from 'vue';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';

export default Vue.extend({
  name: 'Header',
  props: {
    label: {
      type: String,
      required: true,
    },
    sortKey: {
      type: Number,
      required: true,
    },
    addClass: {
      type: String,
      required: true,
    },
  },
  computed: {
    currentSortKey(): number | null {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_SORT_KEY];
    },
    sortOrder(): number | null {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_SORT_ORDER];
    },
    classNames() {
      const names: string[] = [];
      if (this.sortKey === this.currentSortKey) {
        names.push('active');
      }

      if (this.addClass) {
        names.push(this.addClass);
      }
      return names;
    }
  },
  methods: {
    click() {
      const sortOrder = this.sortKey !== this.currentSortKey ? 1 : this.sortOrder === 1 ? 0 : 1;
      this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_SORT_KEY, this.sortKey)
        .then(() => this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_SORT_ORDER, sortOrder))
        .then(() => this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_GET_TESTERS));
    }
  }
});
</script>

<style scoped>

</style>
