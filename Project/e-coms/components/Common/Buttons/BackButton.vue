<template>
  <button
    type="button"
    class="btn btn-secondary"
    @click.prevent.stop="$emit('click')"
  ><i class="fa fa-chevron-circle-left"></i> {{ label }}</button>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  name: 'BackButton',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    displayLang(): any {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style scoped>
</style>
