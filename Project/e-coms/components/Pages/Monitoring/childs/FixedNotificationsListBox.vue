<template>
  <div class="phrase-select-area">
    <select class="form-control phrase-select" v-model="selectedMessage">
      <option v-for="item in fixedNotifyList" :key="item.orderId" :value="item.message">{{ item.message }}</option>
    </select>
    <button
      type="button"
      class="btn btn-primary phrase-select-btn"
      @click="onClickSendMessage"
    >{{ displayLang.MONITORING_CHAT_SEND }}</button>
    <button
      type="button"
      class="btn btn-primary phrase-select-btn"
      @click="onClickShowHistoryModal"
    >{{ displayLang.MONITORING_SHOW_HISTORY }}</button>

    <MonitoringHistoryModal
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as notifyListTypes from '@/store/types/fixedNotificationsType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import * as loginTypes from '@/store/types/loginType';
import { FixedNotification } from '@/store/types/adapters/fixedNotificationsAdapter';
import { ChatItemSender } from '@/store/enum/ChatItem';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { KvsDataType, MessageObject } from '@/plugins/kvs/type/sendMessageType';
import MonitoringHistoryModal from './MainMonitorChilds/MonitoringHistoryModal.vue';
import CheckerMatchingPollingMixin from '@/components/Mixins/CheckerMatchingPollingMixin';
import {
  MatchingHistoriesAdapter,
  MatchingHistoriesRequestType,
} from '@/store/types/adapters/matchingHistoriesAdapter';

export default Vue.extend({
  name: 'FixedNotificationsListBox',
  components: {
    MonitoringHistoryModal,
  },
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
      selectedMessage: '' as string
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    loginData(): LoginAdapter {
      return this.$store.getters[loginTypes.GETTER_LOGIN];
    },
    monitorPageAdapter(): MonitorPageAdapter {
      return this.$store.getters[monitorPageTypes.GETTER_MONITOR_PAGE];
    },
    fixedNotifyList(): FixedNotification[] {
      return this.$store.getters[notifyListTypes.GETTER_FIXEDNOTIFICATIONS_LIST].fixedNotificationList;
    },
  },
  methods: {
    /**
     * 「送信」ボタンのイベントハンドラ
     */
    onClickSendMessage() {
      if (!this.selectedMessage || !this.monitorObject.data.matching) {
        return;
      }

      (this as InstanceType<typeof CheckerMatchingPollingMixin>).sendViewerMessage(
        this.monitorObject,
        this.monitorObjectActions,
        this.selectedMessage,
        {sender: ChatItemSender.PROCTOR, url: null},
        false
      )
    },
    /**
     * 「履歴表示」ボタンのイベントハンドラ
     */
    onClickShowHistoryModal() {
      /*
      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => {
          return new Promise((resolve, reject) => {
            this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_GET_MATCHING_HISTORIES, {} as MatchingHistoriesRequestType)
              .then((adapter: MatchingHistoriesAdapter) => {
                this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false)
                  .then(() => this.$bvModal.show(HtmlId.MONITOR_HISTORY_MODAL))
                  .then(() => resolve(true))
              })
              .catch((e) => {
                this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false)
                  .then(() => this.$modals.showErrorAlert((this.displayLang as any).MONITORING_HISTORY_ERROR_MESSAGE))
                  .then(() => reject(e))
              })
          })
        })]
      */
      Promise.all([
        this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_GET_MATCHING_HISTORIES, {} as MatchingHistoriesRequestType),
        this.$bvModal.show(HtmlId.MONITOR_HISTORY_MODAL),
      ])
    },
  },
});
</script>

<style scoped></style>
