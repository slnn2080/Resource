<template>
  <main class="main auth-ai">
    <div class="container">
      <div class="mt-5 mb-5">
        <Stepbar />
        <div class="card">
          <div class="card-body">
            <div class="authentication row no-gutters">
              <div class="col-md-7">
                <RenderVideo>
                  <template v-slot:preview-image>
                    <img
                      :src="previewImage"
                      v-if="previewImage"
                      style="width: 100%;height: 100%;position: absolute;z-index: 100;"
                    />
                  </template>
                  <template v-slot:video-element>
                    <video
                      ref="video-element"
                      autoplay
                      playsinline
                      muted
                      style="width:100%;height:100%;"
                    />
                  </template>
                </RenderVideo>
                <AuthControls
                  :snapshot-image="snapshotImage"
                  :accept-image="acceptImage"
                />
              </div>
              <div class="col-md-5">
                <AuthSideView />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import * as testerPageTypes from '@/store/types/testerPageType';
import * as testerTypes from '@/store/types/testerType';
import * as matchingType from '@/store/types/matchingType';

import RenderVideo from '@/components/Pages/Identification/Childs/RenderVideo.vue';
import AuthControls from '@/components/Pages/Identification/Childs/AuthControls.vue';
import AuthSideView from '@/components/Pages/Identification/Childs/AuthSideView.vue';
import Stepbar from '@/components/Common/Stepbar.vue';

import { TesterState } from '@/store/enum/TesterState';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LanguageEnum } from '@/store/enum/language';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { MediaStreamResultType, MediaStreamHandler } from '@//plugins/global/mediaDevices';

export default Vue.extend({
  name: 'IdentificationAI',
  components: {
    Stepbar,
    RenderVideo,
    AuthControls,
    AuthSideView
  },
  data() {
    return {
      mediaStream: null as MediaStream | null,
      mediaStreamHandler: {} as MediaStreamHandler,

      previewImage: '' as string
    };
  },
  computed: {
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    testerPage(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
  },
  watch: {
    mediaStream: {
      immediate: true,
      deep: false,
      handler: function (newMediaStream: MediaStream | null, oldMediaStream: MediaStream | null) {
        const videoElement = this.$refs['video-element'] as HTMLVideoElement

        if (videoElement) {
          this.$htmlElementUtils.videoElement.setSrcObject(videoElement, newMediaStream)
        }
      },
    },
  },
  mounted() {
    this.mediaStreamHandler = {
      onCameraMediaStreamCreated: (mediaStreamResult: MediaStreamResultType):Promise<boolean> => {
        this.$set(this, 'mediaStream', mediaStreamResult.mediaStream)

        return Promise.resolve(true)
      },
      onCameraMediaStreamReset: (mediaStreamResult: MediaStreamResultType):Promise<boolean> => {
        this.$set(this, 'mediaStream', mediaStreamResult.mediaStream)

        return Promise.resolve(true)
      },
    } as MediaStreamHandler
    this.$mediaDevices.addMediaStreamHandler(this.mediaStreamHandler as MediaStreamHandler)
    // カメラのメディアストリームを生成する
    this.$mediaDevices.createFrontCameraMediaStream(true, true)

    // // AI本人認証 - サブステータス取得
    this.$store
      .dispatch(testerPageTypes.ACTION_TESTER_PAGE_INIT_AI_IDENTIFY)
      .then((data: { status: number; images: string[] }) => {
        this.$nuxt.$emit('initAiAuthStatus', data);
      })
      .catch((err: any) => {
        console.error(err);
      }); 
  },
  destroyed() {
    this.$mediaDevices.removeMediaStreamHandler(this.mediaStreamHandler as MediaStreamHandler)
  },
  methods: {
    /**
     *
     * @param {number} type
     * @reteurn {string}
     */
    snapshotImage(type: number) {
      const previewCanvasElement = document.createElement('canvas');
      const video = this.$refs['video-element'] as HTMLVideoElement
      // APIでサーバに送られるキャプチャ画像のサイズを2倍にする
      previewCanvasElement.width = video.clientWidth * 2;
      previewCanvasElement.height = video.clientHeight * 2;
      const context = previewCanvasElement.getContext('2d');
      // キャプチャ画像の中に収まる、カメラから映る画像を2倍にする
      (context as CanvasRenderingContext2D).drawImage(video, 0, 0, video.clientWidth * 2, video.clientHeight * 2);
      return previewCanvasElement.toDataURL('image/jpeg');
    },
    /**
     *
     *
     * @param {string} imgStr
     */
    acceptImage(imgStr: string) {
      if (imgStr) {
        this.previewImage = imgStr;
      } else {
        this.previewImage = '';
      }
    },
  }
});
</script>

