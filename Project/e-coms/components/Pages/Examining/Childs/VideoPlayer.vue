<template>
  <div>
    <!-- 録画中(この表示条件がv-showなのはvideoタグをmethodsの中でDOMとしてアクセスるため,常に存在していないといけない) -->
    <video
      v-show="testerConditions.isRecording"
      ref="videoElement"
      width="100%"
      autoplay
      muted
      playsinline="true"
      class="text-center align-middle"
    >
    </video>
    <!-- /録画中 -->

    <!-- 録画開始前/録画終了 -->
    <div
      v-if="testerConditions.isBeforeRecording || testerConditions.isAfterRecording"
      class="waiting-rec"
    >
      <span class="icon-circle">
        <i class="fa fa-video-camera" aria-hidden="true"></i>
      </span>
      <div
        v-if="testerConditions.isBeforeRecording"
        class="lavel-text"
      >
        待機中
        <!-- なぜか表示が出ない {{ displayLang.EXAMINING_BEFORE_RECORDING }} -->
      </div>
      <div
        v-if="testerConditions.isAfterRecording"
        class="lavel-text"
      >
        録画終了
        <!-- なぜか表示が出ない {{ displayLang.EXAMINING_AFTER_RECORDING }} -->
      </div>
    </div>
    <!-- /録画開始前/録画終了 -->
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import { LoginAdapter } from '~/store/types/adapters/loginAdapter';
import { TesterConditions } from '@/store/types/adapters/testerPageAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';

export default Vue.extend({
  name: 'VideoPlayer',
  components: {
  },
  props: {
    testerConditions: {
      type: Object as PropType<TesterConditions>,
      required: true,
    },
    mediaStream: {
      //type: Object as PropType<MediaStream>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  watch: {
    mediaStream(newValue: MediaStream | null, oldValue: MediaStream | null) {
      if (newValue == oldValue) {
        return;
      }
      this.attachMediaStream(newValue);
    },
  },
  mounted() {
    this.attachMediaStream(this.mediaStream as (MediaStream | null));
  },
  beforeDestroy() {
    this.detachMediaStream();
  },
  methods: {
    /**
     * <video>タグにメディアストリームをアタッチします
     *
     * @param {MediaStream | null} mediaStream
     */
    attachMediaStream(mediaStream: MediaStream | null) {
      const videoTag = this.$refs.videoElement as HTMLVideoElement;
      if (videoTag) {
        this.$htmlElementUtils.videoElement.setSrcObject(videoTag, mediaStream)
      }
    },
    /**
     * <video>タグからメディアストリームをデタッチします
     */
    detachMediaStream() {
      this.attachMediaStream(null);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
