<template>
  <th class="sort-th" :class="classNames" @click.stop="onClickCell">
    <input v-model="selected" type="checkbox" @click.stop="">
  </th>
</template>

<script lang="ts">
import Vue from 'vue';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';

export default Vue.extend({
  name: 'CheckboxHeader',
  props: {
    addClass: {
      type: String,
      required: true,
    },
  },
  computed: {
    classNames() {
      const names: string[] = [];
      names.push(this.addClass);
      return names;
    },
    selected: {
      get(): boolean {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_HEADER_SELECTED];
      },
      set(value: boolean) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_HEADER_SELECTED, value);
      },
    },
  },
  methods: {
    onClickCell() {
      this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_HEADER_SELECTED, !this.selected);
    },
  },
});
</script>

<style scoped>

</style>
