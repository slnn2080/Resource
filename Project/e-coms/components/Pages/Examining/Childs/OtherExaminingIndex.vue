<template>
  <div>
    <div class="single-column">
      <div class="single-column-logo"><a href="javascript: void 0;"><img src="@/assets/images/common/logo.png"></a></div>
      <div class="single-column-option">
        <HeaderOption
          :tester-conditions="testerConditions"
        />
      </div>
      <div class="single-column-video">
        <VideoPlayer
          :tester-conditions="testerConditions"
          :media-stream="mediaStream"
        />
      </div>
      <div
        class="single-column-caution"
      >
        <div class="card">
          <div class="card-header text-center header-notes"> <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> {{ displayLang.EXAMINING_TERM }} </div>
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
        class="single-column-operation"
        v-if="testerConditions.isExaming && (inParams.isRecord ? (testerConditions.isRecording || testerConditions.isAfterRecording) : true)"
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
import { TesterConditions } from '@/store/types/adapters/testerPageAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';

export default Vue.extend({
  name: 'OtherExaminingIndex',
  components: {
    HeaderOption,
    VideoPlayer,
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
  data() {
    return {
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
  created() {
    // レイアウトヘッダ/フッタを非表示にする
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LAYOUT_VISIBLE, false);
  },
  destroyed() {
    // レイアウトヘッダ/フッタを表示にする
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LAYOUT_VISIBLE, true);
  },
  methods: {
  },
});
</script>

<style lang="scss" scoped>
</style>
