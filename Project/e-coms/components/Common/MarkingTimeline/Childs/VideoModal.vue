<template>
  <!-- @see https://bootstrap-vue.org/docs/components/modal -->
  <b-modal
    :id="id"
    :no-close-on-backdrop="false"
    :no-close-on-esc="true"
    :hide-header-close="true"
    :hide-header="true"
    :hide-footer="true"
    :hide-backdrop="true"
    :modal-class="'modal video-modal'"
    :dialog-class="'modal-dialog modal-lg'"
    :content-class="'modal-content'"
    :body-class="'modal-body'"
    @shown="onShown"
    @hide="onHide"
  >
    <video
      ref="videoTag"
      id="videoTag"
      src=""
      width="100%"
      height="100%"
      controls
      autoplay
      :muted="videoModalMuted"
    ></video>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { uniqueId } from 'lodash';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { VideoPlayData } from '@/store/types/adapters/commonMarkingTimelineAdapter';

export default Vue.extend({
  name: 'VideoModal',
  props: {
    videoPlayData: {
      type: Object as PropType<VideoPlayData>,
      required: false,
    },
    videoModalMuted: {
      type: Boolean,
      required: true,
    },
  },
  data():any {
    return {
      id: uniqueId('video-player') as string
    } as any
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  watch: {
    videoPlayData(newValue: (VideoPlayData | null), oldValue: (VideoPlayData | null)) {
      if (newValue == oldValue) {
        return;
      }

      if (newValue) {
        this.$bvModal.show(this.id)
      }
    }
  },
  methods: {
    /**
     * モーダルダイアログが表示になるときに発火するイベントです
     */
    onShown() {
      this.attachPlayData(this.videoPlayData)
    },
    /**
     * モーダルダイアログが非表示になるときに発火するイベントです
     */
    onHide() {
      const videoTag = this.$refs.videoTag as HTMLVideoElement
      if (! videoTag) {
        return;
      }

      videoTag.pause()
    },
    /**
     * <video>タグに再生データをアタッチします
     *
     * @param {VideoPlayData | null} videoPlayData
     */
    attachPlayData(videoPlayData: VideoPlayData | null) {
      const videoTag = this.$refs.videoTag as HTMLVideoElement
      if (! videoTag) {
        return;
      }

      if (videoPlayData) {
        (videoTag as any).src = (videoPlayData as VideoPlayData).url as string
        (videoTag as any).currentTime = videoPlayData.startTime
      } else {
        (videoTag as any).src = ''
      }
    },
    /**
     * <video>タグから再生データをデタッチします
     */
    detachPlayData() {
      this.attachPlayData(null);
    },
  },
});
</script>
