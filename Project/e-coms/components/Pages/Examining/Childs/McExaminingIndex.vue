<template>
  <div class="page-wrapper">
    <div class="main-column">
      <iframe
        ref="iframe"
        width="100%"
        height="100%"
        frameborder="0"
        :src="mcExamUrl"
      ></iframe>
    </div>
    <div class="side-column">
      <div class="side-column-logo"><a href="javscript: void 0"><img src="@/assets/images/common/logo.png"></a></div>
      <div class="side-column-option">
        <HeaderOption
          :tester-conditions="testerConditions"
        />
      </div>
      <div class="side-column-video">
        <VideoPlayer
          :tester-conditions="testerConditions"
          :media-stream="mediaStream"
        />
      </div>
      <div
        class="side-column-caution"
        v-if="!testerConditions.isFinishExam"
      >
        <div class="card">
          <div class="card-header text-center header-notes">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> {{ displayLang.EXAMINING_TERM }}
          </div>
          <div class="card-body">
            <p class="exp-text">{{ displayLang.EXAMINING_TERM_EXP_TEXT }}</p>
            <div class="card mb-3">
              <div class="card-body terms-text">
                <ul class="mb-0">
                  <li v-for="(note, index) of displayLang.EXAMINING_TERM_NOTES.split('\n').filter(v => v.trim().length > 0)">
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="testerConditions.isInterruptionExam" class="card-footer text-center">
            <span>{{ displayLang.EXAMINING_INTERRUPTION }}</span>
          </div>
        </div>
      </div>
      <div
        class="side-column-operation"
        v-if="testerConditions.isFinishExam && (inParams.isRecord ? (/*testerConditions.isRecording ||*/ testerConditions.isAfterRecording) : true)"
      >
        <button
          v-if="inParams.isProctor && inParams.isSummary"
          type="button"
          class="btn btn-primary btn-block"
          :disabled="buttonDisabled"
          @click.once="buttonDisabled = true, $emit('transit-exam-end')"
        >{{ displayLang.EXAMINING_SHOW_SUMMARY }}</button>
        <button
          type="button"
          class="btn btn-primary btn-block"
          :disabled="buttonDisabled"
          @click.once="buttonDisabled = true, $emit('logout')"
        >{{ displayLang.EXAMINING_LOGOUT }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import HeaderOption from './HeaderOption.vue';
import VideoPlayer from './VideoPlayer.vue';
import { LanguageEnum } from '@/store/enum/language';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { WindowHandler } from '@/plugins/global/window';
import { TesterConditions } from '@/store/types/adapters/testerPageAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';

export default Vue.extend({
  name: 'McExaminingIndex',
  components: {
    HeaderOption,
    VideoPlayer,
  },
  props: {
    testerConditions: {
      type: Object as PropType<TesterConditions>,
      required: true,
    },
    mcExamUrl: {
      type: String,
      required: true,
    },
    mediaStream: {
      //type: Object as PropType<MediaStream>,
      required: true,
    },
  },
  data() {
    return {
      windowHandler: {} as WindowHandler,
      buttonDisabled: false,
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    inParams(): StartupAdapter {
      return this.$store.getters[rootTypes.GETTER_STARTUP];
    },
  },
  mounted() {
    // レイアウトヘッダ/フッタを非表示にする
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LAYOUT_VISIBLE, false);

    // 「閉じる」処理が発生する前処理の登
    this.windowHandler = {
      /**
       * 「閉じる」処理が発生する前処理
       *
       * @return {Promise<boolean>}
       */
      onPreWindowClose: ():Promise<boolean> => {
        // 試験中に監視者側から「強制終了」を行われた場合、
        // iframe中のiframeのbeforeunloadイベントのダイアログが表示されて、
        // 画面遷移・閉じる処理が止められるため、
        // 画面遷移・閉じる処理が発生する場合は、その前にiframe自体を削除する
        // TODO: vue.jsのお作法ならv-if等で出しわけるのが正しい気がするが、緊急措置的にiframeタグを削除するため
        const iframe = this.$refs['iframe'] as HTMLIFrameElement;
        if (iframe) {
          iframe.remove()
        }

        return Promise.resolve(true)
      },
    } as WindowHandler
    this.$window.addHandler(this.windowHandler)
  },
  destroyed() {
    // レイアウトヘッダ/フッタを表示にする
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LAYOUT_VISIBLE, true);

    // 「閉じる」処理が発生する前処理の登録を解除
    this.$window.removeHandler(this.windowHandler)
  },
  methods: {
  },
});
</script>

<style lang="scss" scoped>
</style>
