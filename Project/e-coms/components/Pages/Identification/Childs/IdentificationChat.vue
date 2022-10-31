<template>
  <div>
    <div class="headline">{{ displayLang.IDENTIFICATION_CHAT_LABEL }}</div>
    <div class="card media-list">
      <div class="alert alert-danger" v-if="isMatching && chatFlg">{{ displayLang.IDENTIFICATION_AFTER_MATCHNG }}</div>
      <div class="card-body" ref="scroll">
        <ul class="list-unstyled mb-0">
          <IdentificationChatComment
            v-for="(item, index) in chatItems"
            :key="index"
            :comment="item.message"
            :sender="item.sender"
          />
        </ul>
      </div>
      <IdentificationChatSend @answerComment="answerComment" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import * as testerPageTypes from '@/store/types/testerPageType';
import * as matchingType from '@/store/types/matchingType';
import { LanguageEnum } from '@/store/enum/language';
import IdentificationChatComment from '@/components/Pages/Identification/Childs/IdentificationChatComment.vue';
import IdentificationChatSend from '@/components/Pages/Identification/Childs/IdentificationChatSend.vue';
import { ChatItem, ChatItemSender } from '@/store/enum/ChatItem';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import { KvsDataType, MessageObject } from '@/plugins/kvs/type/sendMessageType';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import TesterMatchingPollingMixin from '@/components/Mixins/TesterMatchingPollingMixin';
import TesterNotificationMixin, { MasterDataMessageType } from '@/components/Mixins/TesterNotificationMixin';
import {
  WebRTCSendType,
  WebRTCMessageType,
  WebRTCMessagePostRequestType,
} from '@/store/types/adapters/webrtcMessageAdapter';

export default Vue.extend({
  components: {
    IdentificationChatComment,
    IdentificationChatSend
  },
  mixins: [
    TesterMatchingPollingMixin,
    TesterNotificationMixin,
  ],
  props: {
    isMatching: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      chatFlg: true
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    testerPage(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
    chatItems(): ChatItem[] {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE_GET_CHAT_ITEMS]
    },
  },
  created() {
    // 通知処理を開始します
    (this as InstanceType<typeof TesterNotificationMixin>).startNotification(
      (masterDataMessageType: MasterDataMessageType, messageObject: MessageObject) => {
        console.log('[LOG INFO] IdentificationChat - tester message:', event);

        if (masterDataMessageType == MasterDataMessageType.DEFAULT) {
          const chatItem: ChatItem = {
            sender: ChatItemSender.PROCTOR,
            elapsedTime: null,
            message: messageObject.message,

            sendAt: new Date(),
            sentAt: new Date(),
            hasError: false,

            relationalMessageObject: messageObject,
          };
          this.$store.dispatch(testerPageTypes.GETTER_TESTER_PAGE_ADD_CHAT_ITEM, chatItem)
          this.chatFlg = false;
          (this.$refs['scroll'] as HTMLDivElement).scrollTop = 0;

          this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_POST_WEBRTC_MESSAGE, {
            send_type: WebRTCSendType.CHECKER,
            message_type: WebRTCMessageType.IDENTIFICATION_CHECKER,
            message: messageObject.message,
          } as WebRTCMessagePostRequestType);
        }
      }
    );
  },
  destroyed() {
    // 通知処理の後始末
    (this as InstanceType<typeof TesterNotificationMixin>).stopNotification()
  },
  updated() {
    const scroll = this.$refs['scroll'] as HTMLDivElement;
    scroll.scrollTop = 0;
  },
  methods: {
    answerComment(message: string) {
      console.log('message : ', message);

      (this as InstanceType<typeof TesterMatchingPollingMixin>).sendMasterMessage(message, {})
        .then((messageObject: MessageObject) => {

          const chatItem: ChatItem = {
            sender: ChatItemSender.EXAMINEE,
            elapsedTime: null,
            message: message,

            sendAt: new Date(),
            sentAt: null,
            hasError: false,

            relationalMessageObject: messageObject,
          };
          this.$store.dispatch(testerPageTypes.GETTER_TESTER_PAGE_ADD_CHAT_ITEM, chatItem)
          this.chatFlg = false;
          (this.$refs['scroll'] as HTMLDivElement).scrollTop = 0;

          this.$store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_POST_WEBRTC_MESSAGE, {
            send_type: WebRTCSendType.TESTER,
            message_type: WebRTCMessageType.IDENTIFICATION_TESTER,
            message: message,
          } as WebRTCMessagePostRequestType);
        })
    }
  }
});
</script>
