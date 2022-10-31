<template>
  <div class="oparation-right">
    <template v-if="monitorObject.data.rejected">
      <span
        class="btn btn-danger btn-block"
        style="pointer-events: none;"
      >{{ displayLang.MONITORING_AUTH_REJECTED_DONE }}</span>
    </template>
    <template v-else-if="!monitorObject.data.authenticating">
      <button
        type="button"
        class="btn btn-primary btn-block"
        @click="onClickAuth"
      >{{ displayLang.MONITORING_AUTH_LABEL }}</button>
    </template>
    <template v-else>
      <button
        type="button"
        class="btn btn-primary btn-block"
        @click="onClickAccept"
      >{{ displayLang.MONITORING_AUTH_ACCEPT }}</button>
      <button
        type="button"
        class="btn btn-secondary btn-block"
        @click="onClickReject"
      >{{ displayLang.MONITORING_AUTH_REJECTED }}</button>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
// eslint-disable-next-line import/named
import { BvEvent } from 'bootstrap-vue/esm';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '@/store/enum/language';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { KvsDataType, KvsCommand, MessageObject, CommandObject } from '@/plugins/kvs/type/sendMessageType';
import CheckerMatchingPollingMixin from '@/components/Mixins/CheckerMatchingPollingMixin';

export default Vue.extend({
  name: 'MainMonitorAuth',
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
    showAuthModal: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
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
  created() {
    this.$root.$on('bv::modal::hide', (bvEvent: BvEvent, modalId: string) => {
      if (modalId === HtmlId.MONITOR_AUTH_MODAL) {
        this.monitorObjectActions.setAuthenticating(this.monitorObject, false)
      }
    });
  },
  methods: {
    /**
     * 「本人確認」ボタンのイベントハンドラ
     */
    onClickAuth() {
      (this as InstanceType<typeof CheckerMatchingPollingMixin>).sendViewerCommand(this.monitorObject, this.monitorObjectActions, KvsCommand.IDENTIFICATION_AUTHENTICATING, {})
      this.monitorObjectActions.setAuthenticating(this.monitorObject, true)
    },
    /**
     * 「承認」ボタンのイベントハンドラ
     */
    onClickAccept() {
      this.showAuthModal()
    },
    /**
     * 「却下」ボタンのイベントハンドラ
     */
    onClickReject() {
      this.$store
        .dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_REJECT, {
          testerId: this.monitorObject.data.matching!.testerId,
          method: 'PUT'
        })
        .catch((err) => console.error(err));

      (this as InstanceType<typeof CheckerMatchingPollingMixin>).sendViewerCommand(this.monitorObject, this.monitorObjectActions, KvsCommand.IDENTIFICATION_REJECTED, {})
      this.monitorObjectActions.setRejected(this.monitorObject, true)
    }
  }
});
</script>

<style scoped></style>
