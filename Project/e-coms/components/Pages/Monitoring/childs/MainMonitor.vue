<template>
  <div>
    <div class="monitor">
      <video
        ref="video-main"
        autoplay
        playsinline
        style="width: 100%;"
        :muted="monitorObject.data.muted"
      ></video>
      <div class="media-info">
        <div class="media-label">
          <MonitoringSoundMeter
            :monitor-object="monitorObject"
            :monitor-object-actions="monitorObjectActions"
          />
          {{ testerInfo }}
          <template v-if="memo">
            <span id="tooltip-target" class="att-info">
              <i class="fa fa-star" aria-hidden="true"></i>
            </span>
            <b-tooltip target="tooltip-target" triggers="hover" :title="memo" placement="top">
              {{ memo }}
            </b-tooltip>
          </template>
        </div>
        <div class="media-status">{{ statusDisp() }}</div>
        <!-- 経過時間 (now - matching_connected_time) / 全体時間 (matching_total_time) -->
        <div class="connect-time">
          {{ ` ${monitorObject.data.elapsedTime} / ${totalTime}` }}
        </div>
      </div>
      <!--「ログイン済み」状態はボタン表示なし -->
      <template v-show="monitorObject.data.matching.testerStatus > TesterState.LOGIN">
        <!-- 承認・却下 Component : マッチング済み -->
        <template v-if="monitorObject.data.matching.testerStatus <= TesterState.MATCHED">
          <MainMonitorAuth
            :monitor-object="monitorObject"
            :monitor-object-actions="monitorObjectActions"
            :show-auth-modal="showAuthModal"
          />
        </template>
        <!-- マーキング情報 Component : 「受験前」の以上 -->
        <template
          v-if="
            monitorObject.data.matching.testerStatus === TesterState.IDENTIFICATED ||
            monitorObject.data.matching.testerStatus === TesterState.BEFORE_EXAM ||
            monitorObject.data.matching.testerStatus === TesterState.EXAMING ||
            monitorObject.data.matching.testerStatus === TesterState.INTERRUPTION_EXAM ||
            monitorObject.data.matching.testerStatus === TesterState.FINISH_EXAM
          "
        >
          <div class="oparation-right">
            <template v-for="(item, index) in markingType">
              <MainMonitorMarking
                v-if="item.display === 1"
                :key="`${item}-${index}`"
                :type="item"
                :show-marking-modal="showMarkingModal"
              />
            </template>
          </div>
        </template>
      </template>
      <div class="oparation-left">
        <a
          href="#"
          @click="monitorObjectActions.setMuted(monitorObject, !monitorObject.data.muted)"
          class="btn-icon-circle"
          :class="[monitorObject.data.muted ? 'btn-selected' : '']"
          :title="[monitorObject.data.muted ? this.displayLang.MONITORING_VOLUME_ON : this.displayLang.MONITORING_VOLUME_OFF]"
          ><i class="fa fa-microphone" aria-hidden="true"></i
        ></a>
        <template v-if="monitorObject.activation">
          <a
            href="#"
            @click="monitorObjectActions.setActivation(monitorObject, false)"
            class="btn-icon-circle btn-pos-2r"
            :title="this.displayLang.MONITOR_NO_ALLOCATION"
            ><i class="fa fa-remove" aria-hidden="true"></i
          ></a>
        </template>
        <template v-else>
          <a
            href="#"
            @click="monitorObjectActions.setActivation(monitorObject, true)"
            class="btn-icon-circle btn-selected btn-pos-2r"
            :title="this.displayLang.MONITOR_NO_ALLOCATION"
            ><i class="fa fa-ban" aria-hidden="true"></i
          ></a>
        </template>
        <!-- btn-icon-circle btn-selected btn-pos-2rb -->
      </div>
      <div class="oparation-bottom">
        <MainMonitorKickOutButton
          :show-kick-out-modal="showKickOutModal"
        />
      </div>
      <template v-if="monitorObject.data.idCardUrl">
        <div class="oparation-center-bottom">
          <MainMonitorIdCard
            :monitor-object="monitorObject"
            :monitor-object-actions="monitorObjectActions"
          />
        </div>
      </template>
      <MonitoringMarkingModal
        :handle-ok="handleMarkingModalOk"
        :src="capturedVideoDataUrl"
        :monitoring-screen-time="monitoringScreenTime"
      />
      <MonitoringAuthModal
        :handle-ok="handleAuthModalOk"
        :src="capturedVideoDataUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import MainMonitorAuth from './MainMonitorChilds/MainMonitorAuth.vue';
import MainMonitorMarking from './MainMonitorChilds/MainMonitorMarking.vue';
import MonitoringMarkingModal from './MainMonitorChilds/MonitoringMarkingModal.vue';
import MonitoringAuthModal from './MainMonitorChilds/MonitoringAuthModal.vue';
import MainMonitorKickOutButton from './MainMonitorChilds/MainMonitorKickOutButton.vue';
import MonitoringSoundMeter from './MonitoringSoundMeter.vue';
import MainMonitorIdCard from './MainMonitorChilds/MainMonitorIdCard.vue';
import * as rootTypes from '@/store/types/rootType';
import * as marksTypes from '@/store/types/marksType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import { LanguageEnum } from '@/store/enum/language';
import { ChatItemSender } from '@/store/enum/ChatItem';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import { TesterState } from '@/store/enum/TesterState';
import { TesterMarkingsAdapter } from '@/store/types/adapters/testerMarkingsAdapter';
import { TesterAdapter, StartupParameters } from '@/store/types/adapters/testerAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import MarkingLabel from '@/store/const/ja/MARKING_LABEL';
import { Matching, DeleteMatchingRequestType } from '@/store/types/adapters/matchingAdapter';
import { KvsDataType, KvsCommand, MessageObject, CommandObject } from '@/plugins/kvs/type/sendMessageType';
import { Marks } from '@/store/types/adapters/marksAdapter';
import CheckerMatchingPollingMixin from '@/components/Mixins/CheckerMatchingPollingMixin';

export default Vue.extend({
  name: 'MainMonitor',
  components: {
    MainMonitorAuth,
    MainMonitorMarking,
    MainMonitorKickOutButton,
    MainMonitorIdCard,
    MonitoringSoundMeter,
    MonitoringMarkingModal,
    MonitoringAuthModal,
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
      capturedVideoDataUrl: '' as string,
      monitoringScreenTime: '' as string,
    };
  },
  computed: {
    TesterState(): typeof TesterState {
      return TesterState;
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
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
    isProctor(): boolean {
      const matching = this.monitorObject.data.matching;
      if (!matching) {
        return false
      }

      return matching!.startupParameters.isProctor
    },
    markingType(): Marks[] {
      return this.$store.getters[marksTypes.GETTER_MARK_LIST].markList;
    },
    mediaStream(): MediaStream | null {
      return this.monitorObject.data.mediaStream
    },
  },
  watch: {
    /**
     *
     *
     * matchingは1秒毎に値が更新されるので、常に監視することになります
     */
    matching: {
      immediate: true,
      deep: true,
      handler: function (newMonitorObject: MonitorObject | null, oldMonitorObject: MonitorObject | null) {
        if (!newMonitorObject) {
          return
        }

        // 認証画像の更新が必要ならば更新する
        if (this.monitorObjectActions.isNeedUpdateHeadShot(this.monitorObject)) {
          this.monitorObjectActions.updateHeadShot(this.monitorObject, {
            image: this.capturedVideoDataUrl.substring('data:image/jpeg;base64,'.length),
            contentType: 'image/jpeg',
          })
        }
      },
    },
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
     * 認証モーダルを表示します
     */
    showAuthModal() {
      this.captureVideo();
      this.$bvModal.show(HtmlId.MONITOR_AUTH_MODAL);
    },
    /**
     * 認証モーダルの「OK」ボタンのイベントハンドラ
     */
    async handleAuthModalOk(bvEvent: any) {
      this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_SET_IN_AUTH, true);

      // 認証画像を更新する(新規でも)
      this.monitorObjectActions.updateHeadShot(this.monitorObject, {
        image: this.capturedVideoDataUrl.substring('data:image/jpeg;base64,'.length),
        contentType: 'image/jpeg',
      })

      // FIXME k-nishigaki 2020/07/02 この前後のアクションはPromiseなのでチェーンさせたほうがいい？
      await this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_ACCEPT, {
        tester_id: this.monitorObject.data.matching!.testerId,
        status: TesterState.IDENTIFICATED
      });
      (this as InstanceType<typeof CheckerMatchingPollingMixin>).sendViewerCommand(this.monitorObject, this.monitorObjectActions, KvsCommand.IDENTIFICATION_ACCEPTED, {})
      this.monitorObjectActions.setAccepted(this.monitorObject, true)

      this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_SET_IN_AUTH, false);
    },
    /**
     * マーキング確認モーダルを表示します
     */
    showMarkingModal() {
      const date = new Date();
      const format = (num: number) => ('0' + num).slice(-2);
      this.monitoringScreenTime = `${date.getFullYear()}/${format(date.getMonth() + 1)}/${format(
        date.getDate()
      )} ${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`;

      this.captureVideo();
      this.$bvModal.show(HtmlId.MONITOR_MARKING_MODAL);
    },
    /**
     * マーキング確認モーダルの「OK」ボタンのイベントハンドラ
     */
    async handleMarkingModalOk(bvEvent: any, markingType: number, markingTime: any, notifyFlag: boolean) {
      console.log(bvEvent, markingType, markingTime, notifyFlag);
      const result: TesterMarkingsAdapter = await this.$store.dispatch(
        monitorPageTypes.ACTION_MONITOR_PAGE_RECORD_MARKING,
        {
          testerId: this.monitorObject.data.matching!.testerId,
          mark: markingType,
          image: this.capturedVideoDataUrl.substring('data:image/jpeg;base64,'.length),
          contentType: 'image/jpeg',
          timeLag: (new Date().getTime() - markingTime),
          notification: (notifyFlag ? 1 : 0),
        }
      );
      if (notifyFlag) {
        (this as InstanceType<typeof CheckerMatchingPollingMixin>).sendViewerMessage(
          this.monitorObject,
          this.monitorObjectActions,
          result.alert, 
          {sender: ChatItemSender.PROCTOR, url: result.url},
          true
        )
      }
    },
    /**
     * キックアウト確認モーダルを表示します
     *
     * confirm()で確認してキックアウトします
     */
    showKickOutModal() {
      const displayLang = this.displayLang as any;
      if (confirm(displayLang.MONITORING_KICK_OUT_CONFIRM)) {
        (this as InstanceType<typeof CheckerMatchingPollingMixin>).sendViewerCommand(this.monitorObject, this.monitorObjectActions, KvsCommand.KICK_OUT, {})

        // TODO: この処理の遅延は、おそらく「受験者」側がKICK_OUTメッセージを受信して、ログアウトするまでの待つ処理と思われる。厳密ではないが、すぐに直すことができないので保留
        const testerId = this.monitorObject.data.matching!.testerId
        setTimeout(() => {
          this.$store.dispatch(monitorPageTypes.ACTION_MONITOR_PAGE_TESTER_KICK_OUT, testerId)
        }, 7000);
      }
    },
    /**
     * ビデオをキャプチャします 
     */
    captureVideo() {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      const video = this.$refs['video-main'] as HTMLVideoElement;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context!.drawImage(video, 0, 0);
      this.capturedVideoDataUrl = canvas.toDataURL('image/jpeg');
    },
    /**
     *
     *
     */
    statusDisp() {
      if (!this.monitorObject.data.matching) {
        return ''
      }

      // TODO k-nishigaki 2020/07/07 Monitorとコードの重複がある
      switch (this.monitorObject.data.matching!.testerStatus) {
        case TesterState.LOGIN:
          return this.displayLang.MONITOR_TESTER_STATUS_LOGIN;
        case TesterState.MATCHED:
          return this.displayLang.MONITOR_TESTER_STATUS_MATCHED;
        case TesterState.IDENTIFICATED:
          return this.displayLang.MONITOR_TESTER_STATUS_IDENTIFICATED;
        case TesterState.BEFORE_EXAM:
          return this.displayLang.MONITOR_TESTER_STATUS_BEFORE_EXAM;
        case TesterState.EXAMING:
          return this.displayLang.MONITOR_TESTER_STATUS_EXAMING;
        case TesterState.INTERRUPTION_EXAM:
          return this.displayLang.MONITOR_TESTER_STATUS_INTERRUPTION_EXAM;
        case TesterState.FINISH_EXAM:
          return this.displayLang.MONITOR_TESTER_STATUS_FINISH_EXAM;
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
