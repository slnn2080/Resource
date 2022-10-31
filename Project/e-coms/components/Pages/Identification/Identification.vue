<template>
  <main class="main">
    <div class="container">
      <div class="mt-5 mb-5">
        <Stepbar />
        <div class="card">
          <div class="card-body">
            <div class="alert alert-danger" v-show="!isMatching">{{ displayLang.IDENTIFICATION_WAIT_MATCHNG }}</div>
            <div class="alert alert-danger" v-show="testerPage.disconnect">{{ displayLang.IDENTIFICATION_DISCONNECT_NETWORK }}</div>
            <div class="authentication row no-gutters">
              <div class="col-md-8">
                <RenderVideo>
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
              </div>
              <div class="col-md-4">
                <IdentifyCheckList />
              </div>
            </div>
            <IdentificationChat :is-matching="isMatching" />
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
import RenderVideo from '@/components/Pages/Identification/Childs/RenderVideo.vue';
import IdentifyCheckList from '@/components/Pages/Identification/Childs/IdentifyCheckList.vue';
import IdentificationChat from '@/components/Pages/Identification/Childs/IdentificationChat.vue';
import Stepbar from '@/components/Common/Stepbar.vue';
import { MatchingStatus } from "@/store/enum/MatchingStatus";
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LanguageEnum } from '@/store/enum/language';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import TesterMatchingPollingMixin from '@/components/Mixins/TesterMatchingPollingMixin';
import { MediaStreamResultType, MediaStreamHandler } from '@/plugins/global/mediaDevices';

export default Vue.extend({
  components: {
    Stepbar,
    RenderVideo,
    IdentifyCheckList,
    IdentificationChat
  },
  mixins: [
    TesterMatchingPollingMixin,
  ],
  data() {
    return {
      mediaStream: null as MediaStream | null,
      mediaStreamHandler: {} as MediaStreamHandler,
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
    testerPage(): TesterPageAdapter {
      return this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE];
    },
    isMatching() {
      const matchings = (this as InstanceType<typeof TesterMatchingPollingMixin>).getMatchings()
      if (!matchings || matchings.length === 0) {
        return false
      }
      const matching = matchings[0] as Matching;
      console.log(`>>> testerStatus = ${matching.testerStatus} / matchingStatus = ${matching.matchingStatus} <<< `)

      switch(matching.matchingStatus) {
        case MatchingStatus.CONNECTED:
          return true;

        default:
          return (
            this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_AUTHENTICATING] ||
            this.$store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_IDENTIFICATION_ACCEPTED]
          )
      }
    }
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
  },
  destroyed() {
    this.$mediaDevices.removeMediaStreamHandler(this.mediaStreamHandler as MediaStreamHandler)
  },
});
</script>

