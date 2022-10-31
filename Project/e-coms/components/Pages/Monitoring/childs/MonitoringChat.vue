<template>
  <div>
    <div class="headline">{{ testerComment }}</div>
    <div class="card media-list">
      <div class="card-body" ref="scroll">
        <ul class="list-unstyled mb-0">
          <MonitorComment
            v-for="(chatItem, index) in monitorObject.data.chatItems"
            :key="index"
            :chat-item="chatItem"
          />
        </ul>
      </div>
      <MonitorChatSend
        :monitor-object="monitorObject"
        :monitor-object-actions="monitorObjectActions"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import MonitorComment from './ChatChilds/MonitorComment.vue';
import MonitorChatSend from './ChatChilds/MonitorChatSend.vue';
import * as rootTypes from '@/store/types/rootType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import { LanguageEnum } from '@/store/enum/language';
import { ChatItem } from '@/store/enum/ChatItem';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import { Matching } from '@/store/types/adapters/matchingAdapter';

export default Vue.extend({
  name: 'MonitoringChat',
  components: {
    MonitorComment,
    MonitorChatSend,
  },
  props: {
    monitorObject: {
      type: Object as PropType<MonitorObject>,
      required: true,
    },
    monitorObjectActions: {
      type: Object as PropType<MonitorObjectActions>,
      required: true,
    },
  },
  data() {
    return {
    } as any;
  },
  computed: {
    displayLang(): any {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerComment(): string {
      if (!this.monitorObject.data.matching) {
        return this.displayLang.MONITOR_NO_CONNECT;
      }
      if (!this.monitorObject.data.matching!.examName) {
        return this.displayLang.MONITOR_NO_CONNECT;
      }

      return this.monitorObject.data.matching!.examName + this.displayLang.MONITORING_CHAT_LABEL;
    }
  },
  updated() {
    const scroll = this.$refs['scroll'] as HTMLDivElement;
    scroll.scrollTop = scroll.scrollHeight;
  }
});
</script>

<style scoped></style>
