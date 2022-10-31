<template>
  <div class="row main-monitor-area">
    <div class="col-9">
      <template v-if="monitorObject.data.matching">
        <MainMonitor
          :monitor-object="monitorObject"
          :monitor-object-actions="monitorObjectActions"
        />
      </template>
      <template v-else>
        <template v-if="monitorObject.activation">
          <div class="monitor no-connect" style="height: 93.5%;">
            <div class="no-connect-item">
              <div class="no-connect-icon">
                <i class="fa fa-user" aria-hidden="true"></i>
              </div>
              <div class="no-connect-label">{{ displayLang.MONITOR_NO_CONNECT }}</div>
              <a
                style="cursor: pointer;"
                @click="monitorObjectActions.setActivation(monitorObject, false)"
                class="btn-icon-circle btn-pos-rb"
                :title="displayLang.MONITOR_NO_ALLOCATION"
              >
                <i class="fa fa-remove" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="monitor no-connect no-use" style="height: 93.5%;">
            <div class="no-connect-item">
              <div class="no-connect-icon">
                <i class="fa fa-ban" aria-hidden="true"></i>
              </div>
              <div class="no-connect-label">{{ displayLang.MONITOR_NO_ALLOCATION }}</div>
              <a
                style="cursor: pointer;"
                @click="monitorObjectActions.setActivation(monitorObject, true)"
                class="btn-icon-circle btn-pos-rb"
                :title="displayLang.MONITOR_NO_CONNECT"
              >
                <i class="fa fa-check" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </template>
      </template>
      <FixedNotificationsListBox
        :monitor-object="monitorObject"
        :monitor-object-actions="monitorObjectActions"
      />
    </div>
    <div class="col-3">
      <MainHeadShot
        :monitor-object="monitorObject"
        :monitor-object-actions="monitorObjectActions"
      />
      <div class="mb-2">
        <button
          type="button"
          class="btn btn-danger btn-sm"
          :disabled="!monitorObject.data.matching"
          @click="throttle(onClickReconnect)"
        >{{ displayLang.MONITORING_RECONNECT }}</button>
      </div>
      <MonitoringChat
        :monitor-object="monitorObject"
        :monitor-object-actions="monitorObjectActions"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { throttle } from 'lodash';
import MainMonitor from './MainMonitor.vue';
import MainHeadShot from './MainHeadShot.vue';
import MonitoringChat from './MonitoringChat.vue';
import FixedNotificationsListBox from './FixedNotificationsListBox.vue';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import { TesterAdapter } from '@/store/types/adapters/testerAdapter';
import { TesterState } from '@/store/enum/TesterState';
import CheckerMatchingPollingMixin from '@/components/Mixins/CheckerMatchingPollingMixin';

export default Vue.extend({
  name: 'MainView',
  components: {
    MainMonitor,
    MainHeadShot,
    MonitoringChat,
    FixedNotificationsListBox
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
      throttle: throttle((fn) => fn(), 5000)
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
    /**
     * 「再接続」ボタン押下時のイベントハンドラ
     */
    onClickReconnect() {
      (this as InstanceType<typeof CheckerMatchingPollingMixin>).restartKvs(this.monitorObject)
    },
  },
});
</script>

<style scoped></style>
