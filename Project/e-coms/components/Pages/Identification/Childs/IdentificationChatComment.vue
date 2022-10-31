<template>
  <li class="media" :class="sender">
    <div class="media-image">
      <i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>
    </div>
    <div class="media-body">
      <div class="media-comment">{{ comment }}</div>
    </div>
  </li>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
  props: {
    comment: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  }
});
</script>

<style scoped></style>
