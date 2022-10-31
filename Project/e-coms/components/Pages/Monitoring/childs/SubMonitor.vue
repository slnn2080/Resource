<template>
  <div
    class="col-3"
    @click="monitorObjectActions.changeMainMonitor(monitorObject)"
  >
    <template v-if="connect">
      <div class="monitor">
        <video
          ref="video-main"
          autoplay
          playsinline
          muted
          class="img-fluid"
          style="width: 100%;"
        ></video>
        <div class="media-info">
          <div class="media-label">
            <MonitoringSoundMeter
              :monitor-object="monitorObject"
              :monitor-object-actions="monitorObjectActions"
            />
            {{ testerInfo }}
            <template v-if="memo">
              <span :id="tooltipId" class="att-info">
                <i class="fa fa-star" aria-hidden="true"></i>
              </span>
              <b-tooltip :target="tooltipId" triggers="hover" :title="memo" placement="top">
                {{ memo }}
              </b-tooltip>
            </template>
          </div>
          <div class="media-status">{{ statusDisp() }}</div>
        </div>
        <SubHeadShot
          :monitor-object="monitorObject"
          :monitor-object-actions="monitorObjectActions"
        />
        <div class="connect-time">
          {{ ` ${monitorObject.data.elapsedTime} / ${totalTime}` }}
        </div>
        <template v-if="monitorObject.activation">
          <a
            href="#"
            class="btn-icon-circle btn-pos-2rb"
            @click.stop="monitorObjectActions.setActivation(monitorObject, false)"
            :title="this.displayLang.MONITOR_NO_ALLOCATION"
            ><i class="fa fa-remove" aria-hidden="true"></i
          ></a>
        </template>
        <template v-else>
          <a
            href="#"
            class="btn-icon-circle btn-selected btn-pos-2rb"
            @click.stop="monitorObjectActions.setActivation(monitorObject, true)"
            :title="this.displayLang.MONITOR_NO_ALLOCATION"
          ><i class="fa fa-ban" aria-hidden="true"></i></a>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="monitor no-connect">
        <div class="no-connect-item">
          <div class="no-connect-icon">
            <i class="fa fa-user" aria-hidden="true"></i>
          </div>
          <div class="no-connect-label">{{ displayLang.MONITOR_NO_CONNECT }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { uniqueId } from 'lodash';
import * as rootTypes from '@/store/types/rootType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import * as matchingTypes from '@/store/types/matchingType';
import MonitoringSoundMeter from './MonitoringSoundMeter.vue';
import SubHeadShot from './SubHeadShot.vue';
import { LanguageEnum } from '@/store/enum/language';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { TesterState } from '@/store/enum/TesterState';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import * as aiAuthStatusType from '@/store/types/aiAuthStatusType';
import CheckerMatchingPollingMixin from '@/components/Mixins/CheckerMatchingPollingMixin';

export default Vue.extend({
  name: 'SubMonitor',
  components: {
    MonitoringSoundMeter,
    SubHeadShot,
  },
  mixins: [
    CheckerMatchingPollingMixin,
  ],
  props: {
    connect: {
      type: Boolean,
      required: true
    },
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
      tooltipId: 'tooltip-target-sub-${uniqueId()}`' as string,
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    monitorPageAdapter(): MonitorPageAdapter {
      return this.$store.getters[monitorPageTypes.GETTER_MONITOR_PAGE];
    },
    testerInfo(): string {
      const matching = this.monitorObject.data.matching;
      if (!matching) {
        return ''
      }

      if (!!matching.examName && !!matching.exLoginId) {
        return matching.examName + ' / ' + matching.exLoginId;
      } else if (!!matching.examName) {
        return matching.examName;
      } else if (!!matching.exLoginId) {
        return matching.exLoginId;
      } else {
        return '';
      }
    },
    totalTime(): string {
      return Matching.generateTotalTime(this.monitorObject.data.matching)
    },
    memo(): string {
      const matching = this.monitorObject.data.matching;
      if (!matching) {
        return ''
      }

      return matching!.startupParameters.memo || ''
    },
    mediaStream(): MediaStream | null {
      return this.monitorObject.data.mediaStream
    },
  },
  watch: {
    mediaStream: {
      immediate: true,
      deep: true,
      handler: function (newMediaStream: MediaStream | null, oldMediaStream: MediaStream | null) {
        const func = () => {
          const el = this.$refs['video-main'] as HTMLVideoElement
          if (!el) {
            setTimeout(func, 0)
            return
          }
          this.$htmlElementUtils.videoElement.setSrcObject(el, newMediaStream)
        }

        func()
      },
    },
  },
  methods: {
    /**
     *
     *
     */
    statusDisp(): string {
      if (!this.monitorObject.data.matching) {
        return ''
      }

      // TODO k-nishigaki 2020/07/07 MainMonitorとコードの重複がある
      switch (this.monitorObject.data.matching!.testerStatus) {
        case TesterState.LOGIN:
          return (this.displayLang as any).MONITOR_TESTER_STATUS_LOGIN;
        case TesterState.MATCHED:
          return (this.displayLang as any).MONITOR_TESTER_STATUS_MATCHED;
        case TesterState.IDENTIFICATED:
          return (this.displayLang as any).MONITOR_TESTER_STATUS_IDENTIFICATED;
        case TesterState.BEFORE_EXAM:
          return this.displayLang.MONITOR_TESTER_STATUS_BEFORE_EXAM;
        case TesterState.EXAMING:
          return (this.displayLang as any).MONITOR_TESTER_STATUS_EXAMING;
        case TesterState.INTERRUPTION_EXAM:
          return (this.displayLang as any).MONITOR_TESTER_STATUS_INTERRUPTION_EXAM;
        case TesterState.FINISH_EXAM:
          return (this.displayLang as any).MONITOR_TESTER_STATUS_FINISH_EXAM;
        default:
          return '';
      }
    },
  }
});
</script>

<style scoped>
.tooltip {
  opacity: 1;
}
</style>
