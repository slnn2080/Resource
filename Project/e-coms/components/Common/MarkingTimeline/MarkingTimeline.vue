<template>
  <div>
    <div class="row timeline-option">
      <div class="col-6">
        <div style="line-height:35px">
          {{ countLabel || displayLang.MARKING_TIMELINE_COUNT_LABEL }}
          <span class="text-number">
            {{ formatCount(extendMarkings.length) }}
          </span>
          &nbsp;&nbsp;&nbsp;
          {{ scoreLabel || displayLang.MARKING_TIMELINE_SCORE_LABEL }}
          <span class="text-number">
            {{ formatScore(score) }}
          </span>
        </div>
      </div>
      <div v-if="!this.isVertical" class="col-6 text-right">
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-light" :disabled="!isPreviousClickable" @click="previous()">
            <i class="fa fa-caret-left" aria-hidden="true"></i>
          </button>
          <button type="button" class="btn btn-light" :disabled="!isNextClickable" @click="next()">
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
    <div
      ref="timeline"
      class="timeline"
    >
      <ul :class="this.isVertical ? 'timeline-vertical' :'timeline-horizontal'">
        <MarkingTimelineItem
          v-for="(marking, index) in extendMarkings"
          :key="index"
          :marking="marking"
          @click="onClickPlayVideoModal"
        />
      </ul>
    </div>
    <VideoModal
      :video-play-data="videoModalData.videoPlayData"
      :video-modal-muted="videoModalMuted"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { Actor } from '@/store/enum/Actor'
import MarkingTimelineItem from './Childs/MarkingTimelineItem.vue';
import VideoModal from './Childs/VideoModal.vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import { Marking, ExtendMarking, Record, VideoPlayData } from '@/store/types/adapters/commonMarkingTimelineAdapter';

export default Vue.extend({
  name: 'MarkingTimeline',
  components: {
    MarkingTimelineItem,
    VideoModal,
  },
  props: {
    score: {
      type: Number,
      required: false,
    },
    markings: {
      type: Array as PropType<Marking[]>,
      required: true
    },
    records: {
      type: Array as PropType<Record[]>,
      required: true,
    },
    countLabel: {
      type: String,
      required: false,
    },
    scoreLabel: {
      type: String,
      required: false,
    },
    videoModalMuted: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isVertical: false as boolean,
      isPreviousClickable: false as boolean,
      isNextClickable: false as boolean,
      videoModalData: {
        videoPlayData: null as (VideoPlayData | null)
      },
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    extendMarkings: {
      get(): ExtendMarking[] {
        if (!this.markings
          || !this.markings.length
          || !this.records
          || !this.records.length
        ) {
          return [];
        }

        return this.markings.map(marking => {
          /**
           * 年月日の区切り文字を/に変換します
           *
           * safariではnew Date()が通らないため
           * また、文字列比較で
           */
          const toSlashDelimiter = (dateString: string) => {
            if (!dateString) {
              return dateString
            }
            return dateString.replace(/-/g, '/')
          };

          // 再生レコード検索
          const foundIndex = this.records.findIndex(record => (record.id == ('' + marking.recordId)))
          if (foundIndex === -1) {
            console.error('[ERROR] 指定レコードがありません', marking);

            return ExtendMarking.createInstance(marking, -1, null, 0)
          } else {
            const foundRecord = this.records[foundIndex];

            // 再生時間計算
            const markingAt = (new Date(toSlashDelimiter(marking.markingAt!))).valueOf()
            const startAt   = (new Date(toSlashDelimiter(foundRecord.startAt!))).valueOf()
            let currentTime:number = (markingAt - startAt) / 1000;
            if (currentTime <= 0) {
              currentTime = 0;
            }

            return ExtendMarking.createInstance(marking, foundIndex, foundRecord.url, currentTime)
          }
        });
      },
    },
  },
  mounted() {
    window.addEventListener('resize', this.onResize, false);
    (this.$refs.timeline as Element).addEventListener('scroll', this.onResize, false);
    this.onResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize, false);
    //(this.$refs.timeline as Element).removeEventListener('scroll', this.onResize, false);
  },
  methods: {
    onResize() {
      if (this.inParams.actor != Actor.TESTER) {
        // 管理画面の場合は、レスポンシブデザインを考慮しない PCオンリーと考える
        this.isVertical = false
      } else {
        // TODO: ここは、プログラムで無理やり計算するが、もしデザイン崩れが起こるようであればデザイナーさんと相談してレスポンシブデザインを考慮するほうがいい
        if (document.body.clientWidth >= 768) {
          this.isVertical = false
        } else {
          this.isVertical = true
        }
      }
      this.calcScrollButtonsDisabled()
    },
    previous() {
      const timeline = this.$refs.timeline as (Element | null)
      if (timeline) {
        timeline.scrollLeft -= 200 // なんか適当
        this.calcScrollButtonsDisabled()
      }
    },
    next() {
      const timeline = this.$refs.timeline as (Element | null)
      if (timeline) {
        timeline.scrollLeft += 200 // なんか適当
        this.calcScrollButtonsDisabled()
      }
    },
    calcScrollButtonsDisabled() {
      // スクロールボタンの有効/無効を計算します
      const timeline = this.$refs.timeline as (Element | null)
      if (timeline) {
        this.isPreviousClickable = (timeline.scrollLeft > 0)
        this.isNextClickable = (timeline.scrollLeft < (timeline.scrollWidth - timeline.clientWidth))
      }
    },
    /**
     * タイムラインアイテムがクリックされた時に発火するイベントのハンドラです
     *
     * @param {VideoPlayData} videoPlayData
     */
    onClickPlayVideoModal(videoPlayData: VideoPlayData):void {
      this.videoModalData.videoPlayData = videoPlayData
    },
    /**
     * 件数表示に変換します
     *
     * @param {number} value
     * @return {string}
     */
    formatCount(value: number): string {
      return '' + value + (this.displayLang as any).MARKING_TIMELINE_COUNT
    },
    /**
     * 点数表示に変換します
     *
     * @param {number} value
     * @return {string}
     */
    formatScore(value: number): string {
      return '' + value + (this.displayLang as any).MARKING_TIMELINE_SCORE
    },
  }
});
</script>

<style scoped>
.timeline-horizontal:before {
  top: 94px;
}

.timeline-vertical:before {
  left: 52.5%;
}
@media screen and (max-width: 578px){
  .timeline-vertical:before {
    left: 18%;
  }
}
</style>
