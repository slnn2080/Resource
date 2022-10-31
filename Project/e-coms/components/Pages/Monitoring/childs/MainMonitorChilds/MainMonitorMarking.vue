<template>
  <button
    type="button"
    class="btn btn-secondary btn-block"
    @click="markingEvent(type)"
  >{{type.label}}</button>
</template>

<script lang="ts">
import Vue from 'vue';
import { Marks } from '@/store/types/adapters/marksAdapter';

export default Vue.extend({
  name: 'MainMonitorMarking',
  props: {
    type: {
      type: Object,
      required: true
    },
    showMarkingModal: {
      type: Function,
      required: true
    },
  },
  methods: {
    markingEvent(type: Marks) {
      this.$nuxt.$emit('markingEvent', type, new Date().getTime());
      this.showMarkingModal();
    },
  }
});
</script>

<style scoped></style>
