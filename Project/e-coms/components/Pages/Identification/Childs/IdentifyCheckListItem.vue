<template>
  <li class="check-item">
    {{ text }}
    <div class="custom-control custom-checkbox">
      <input
        :id="itemId"
        v-model="checked"
        type="checkbox"
        class="custom-control-input"
        disabled
      />
      <label class="custom-control-label" :for="itemId"></label>
    </div>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'def'
    },
    itemId: {
      type: String,
      default: 'def'
    },
    checked: Boolean
  }
});
</script>
