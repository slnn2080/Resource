<template>
  <th
    class="sort-th"
    :class="classNames"
    @click="click"
  >
    {{ label }}
    <span class="sort-icon">
      <i v-if="sortKey !== currentSortKey || sortOrder === 1" class="fa fa-caret-up" aria-hidden="true"></i>
      <i v-else class="fa fa-caret-down" aria-hidden="true"></i>
    </span>
  </th>
</template>

<script lang="ts">
import Vue from 'vue';
import * as pageTypes from '@/store/types/analysisRequestPageType';

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
    }
  },
  computed: {
    currentSortKey(): number | null {
      const tableValues = this.$store.getters[pageTypes.GETTER_ANALYSIS_REQUEST_PAGE_GET_TABLE_VALUES];
      return tableValues.sortKey;
    },
    sortOrder(): number | null {
      const tableValues = this.$store.getters[pageTypes.GETTER_ANALYSIS_REQUEST_PAGE_GET_TABLE_VALUES];
      return tableValues.sortOrder;
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
      
      const tableValues = this.$store.getters[pageTypes.GETTER_ANALYSIS_REQUEST_PAGE_GET_TABLE_VALUES];
      tableValues.sortKey = this.sortKey;
      tableValues.sortOrder = sortOrder;
      this.$store.dispatch(pageTypes.ACTION_ANALYSIS_REQUEST_PAGE_SET_TABLE_VALUES, tableValues);
    }
  }
});
</script>

<style scoped>
</style>
