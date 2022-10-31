<template>
  <div class="col-3">
    <div
      class="monitor no-connect no-use"
      @click="monitorObjectActions.changeMainMonitor(monitorObject)"
    >
      <div class="no-connect-item">
        <div class="no-connect-icon">
          <i class="fa fa-ban" aria-hidden="true"></i>
        </div>
        <div class="no-connect-label">{{ displayLang.MONITOR_NO_ALLOCATION }}</div>
        <a
          style="cursor: pointer;"
          class="btn-icon-circle btn-pos-rb"
          :title="displayLang.MONITOR_NO_CONNECT"
          @click.stop="monitorObjectActions.setActivation(monitorObject, !monitorObject.activation)"
        >
          <i class="fa fa-check" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';

export default Vue.extend({
  name: 'SubMonitorNoAllocation',
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
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  }
});
</script>

<style scoped></style>
