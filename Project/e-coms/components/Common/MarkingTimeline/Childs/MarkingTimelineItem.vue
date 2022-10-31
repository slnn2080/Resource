<template>
  <li class="timeline-item">
    <div class="timeline-date">
      {{ date }}
      <br />
      <span class="time-text">{{ time }}</span>
      <br />
      <span class="record-time-text badge badge-secondary p-1 mb-1">{{ recordTimeText }}</span>
    </div>
    <div class="timeline-badge">
      <i class="fa fa-camera-retro" aria-hidden="true"></i>
    </div>
    <a href="javascript:void 0;" class="video-link" @click.prevent.stop="onClickMarking">
      <div class="timeline-panel">
        <div class="timeline-thmbnail">
          <img :src="marking.url" class="thumbnail" />
        </div>
        <div class="timeline-caption">{{ marking.mark }}</div>
      </div>
    </a>
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import {
  TesterRecordUriAdapter,
  TesterRecordUriRequestType,
} from '@/store/types/adapters/testerRecordUriAdapter';
import * as testerRecordUriTypes from '@/store/types/testerRecordUriType';
import { ExtendMarking, VideoPlayData } from '@/store/types/adapters/commonMarkingTimelineAdapter';
import { ModalOptions } from '@/plugins/global/modals';

export default Vue.extend({
  name: 'MarkingTimelineItem',
  props: {
    marking: {
      type: Object as PropType<ExtendMarking>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    date(): string {
      return this.$props.marking.markingAt.split(' ')[0];
    },
    time(): string {
      return this.$props.marking.markingAt.split(' ')[1];
    },
    /**
     * レコード情報を生成します
     *
     * @return {string}
     */
    recordTimeText(): string {
      const text = (this.displayLang as any).MARKING_TIMELINE_DOWNLOAD
      const no = this.marking.recordIndex + 1;
      const recordTime = this.marking.recordTime;
      const h = Math.floor(recordTime / 3600);
      const m = Math.floor(recordTime % 3600 / 60);
      const s = Math.floor(recordTime % 3600 % 60);
      const hh = h;
      const mm = ('00' + m).slice(-2);
      const ss = ('00' + s).slice(-2);

      return `${text}${no}>${hh}:${mm}:${ss}`;
    },
  },
  methods: {
    /**
     * 「マーキング」をクリックしたときのイベントハンドラ
     */
    onClickMarking() {
      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          this.$store.dispatch(testerRecordUriTypes.ACTION_TESTER_RECORD_URI, {record_id: this.marking.recordId as number} as TesterRecordUriRequestType)
            .then((adapter: TesterRecordUriAdapter) => {
              if (adapter.url == null) {
                // レコードがない場合
                this.$modals.showErrorAlert('動画がありません。', {hideBackdrop: true} as ModalOptions)
                  .then(() => {
                    reject()
                  })
              } else {
                this.$emit('click', this.makeVideoPlayData(adapter.url))
                resolve(true)
              }
            })
            .catch((e) => {
              // レコードがない場合
              this.$modals.showErrorAlert('動画がありません。', {hideBackdrop: true} as ModalOptions)
                .then(() => {
                  reject()
                })
            })
        }))
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
    },
    /**
     * 再生データを生成します
     *
     * @para {string} url
     * @return {VideoPlayData}
     */
    makeVideoPlayData(url: string): VideoPlayData {
      // 再生時間計算 マーキングの10秒前から実行するが0
      const startTime: number = (this.marking.recordTime <= 10) ? 0 : (this.marking.recordTime - 10);

      return {
        url: url, //this.marking.recordUrl!,
        startTime: startTime,
      }
    },
  },
});
</script>

<style scoped>
@media screen and (max-width: 578px){
  .timeline-vertical .timeline-date {
  }
  .timeline-vertical .timeline-badge {
    left: 20px;
  }
  .timeline-vertical .record-time-text {
    margin-left: 50px;
  }
}
</style>
