<template>
  <li class="media" :class="chatItem.sender">
    <div class="media-image">
      <i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>
    </div>
    <div class="media-body">
      <div class="media-comment">
        {{ message }}
        <template v-if="chatItem.hasError">
          <span class="comment-err-icon"><i class="fa fa-times-circle" aria-hidden="true"></i></span>
        </template>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ChatItem } from '@/store/enum/ChatItem';

export default Vue.extend({
  name: 'MonitorComment',
  props: {
    chatItem: {
      type: Object as PropType<ChatItem>,
      required: true,
    },
  },
  computed: {
    message(): string {
      const format = (num: number) => ('0' + num).slice(-2);

      const hh = format(this.chatItem.sendAt.getHours())
      const mm = format(this.chatItem.sendAt.getMinutes())
      const ss = format(this.chatItem.sendAt.getSeconds())

      return `${hh}:${mm}:${ss}(${this.chatItem.elapsedTime}) ${this.chatItem.message}`
    },
  },
});
</script>

<style scoped></style>
