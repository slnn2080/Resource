<template>
  <div class="card-body list-log-scroll">
    <dl v-for="(message, index) in messages" :key="index" class="list-log">
      <dt class="log-date">{{ message.createdAt }}</dt>
      <dd class="log-comment">{{ message.message }}</dd>
    </dl>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Message } from '@/store/types/adapters/webrtcMessageAdapter';
export default Vue.extend({
  name: 'MessageDetailList',
  props: {
    messages: {
      type: Array,
      required: true,
    }
  }
});
</script>

<style scoped></style>
