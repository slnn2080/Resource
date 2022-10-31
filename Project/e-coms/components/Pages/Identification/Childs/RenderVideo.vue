<template>
  <div class="auth-video">
    <slot name="preview-image"></slot>
    <div>
      <slot name="video-element"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
export default Vue.extend({
});
</script>
