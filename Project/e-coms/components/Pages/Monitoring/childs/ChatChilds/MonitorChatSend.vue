<template>
  <div>
    <div class="card-footer send-message-form">
      <textarea
        v-model="sendTextArea"
        :placeholder="displayLang.MONITORING_CHAT_SEND_PLACEHOLDER"
        class="form-control message-area"
        rows="2"
      />
      <button
        type="button"
        class="btn btn-primary"
        @click="sendMonitorMessage"
      >
        {{ displayLang.MONITORING_CHAT_SEND }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.message-area {
  resize: none;
}
</style>

<script lang="ts">
import Vue, { PropType } from 'vue';
import * as rootTypes from '@/store/types/rootType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import { LanguageEnum } from '@/store/enum/language';
import { ChatItemSender } from '@/store/enum/ChatItem'
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import { KvsDataType, MessageObject } from '@/plugins/kvs/type/sendMessageType';
import CheckerMatchingPollingMixin from '@/components/Mixins/CheckerMatchingPollingMixin';

export default Vue.extend({
  name: 'MonitorChatSend',
  mixins: [
    CheckerMatchingPollingMixin,
  ],
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
      sendTextArea: '' as string
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    monitorPageAdapter(): MonitorPageAdapter {
      return this.$store.getters[monitorPageTypes.GETTER_MONITOR_PAGE];
    },
  },
  methods: {
    sendMonitorMessage() {
      const sendTextArea = this.sendTextArea.trim();
      if (!sendTextArea || !this.monitorObject.data.matching) {
        return;
      }

      (this as InstanceType<typeof CheckerMatchingPollingMixin>).sendViewerMessage(
        this.monitorObject,
        this.monitorObjectActions,
        sendTextArea, 
        {sender: ChatItemSender.PROCTOR, url: null},
        false
      )
      this.sendTextArea = '';
    }
  }
});
</script>

<style scoped></style>
