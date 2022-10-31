<template>
  <div class="section">
    <div class="headline">
      {{ displayLang.EXAMINEE_DETAIL_EXCHANGES_TITLE }}
      <a href="#" class="backlink ml-3"><i class="fa fa-chevron-circle-up" aria-hidden="true" @click.stop.prevent=""></i>{{ displayLang.EXAMINEE_DETAIL_GOTO_PAGE_TOP }}</a>
    </div>
    <div class="card media-list cmn-history">
      <div class="card-body">
        <ul class="list-unstyled mb-0">
          <template v-for="item in identification">
            <li class="media"
              :class="isExaminee(item) ? 'examinee' : 'proctor'"
            >
              <div class="media-image">
                <i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>
              </div>
              <div class="media-body">
                <div class="media-comment">{{ item.message }}</div>
                <div class="text-right my-1"><time class="text-right badge badge-secondary" :datetime="item.createdAt">{{ item.createdAt }}</time></div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as examineeDetailPageTypes from '@/store/types/examineeDetailPageType';
import { TesterDetailAdapter } from '@/store/types/adapters/testerDetailAdapter';
import { Message, WebRTCMessageType, WebRTCSendType } from '@/store/types/adapters/webrtcMessageAdapter'

export default Vue.extend({
  name: 'Exchanges',
  props: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerDetail(): TesterDetailAdapter {
      return this.$store.getters[examineeDetailPageTypes.GETTER_EXAMINEE_DETAIL_PAGE_GET_TESTER_DETAIL];
    },
    identification(): Message[] {
      return this.testerDetail.messages
        .filter((message: Message) => message.messageType === WebRTCMessageType.IDENTIFICATION_TESTER || message.messageType === WebRTCMessageType.IDENTIFICATION_CHECKER)
    },
  },
  methods: {
    isExaminee(message: Message): boolean {
      return message.sendType == WebRTCSendType.TESTER
    },
  }
});
</script>
