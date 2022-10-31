<template>
  <div class="col-6">
    <table class="table table-bordered user-info">
      <tbody>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_HEAD_SHOT }}</th>
          <td><img :src="testerDetail.headShotUri" class="mr-3" style="width:200px;" /></td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_ID_CARD }}</th>
          <td><img :src="testerDetail.idCurdUri" class="mr-3" style="width:200px"></td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_TARGET }}</th>
          <td><a v-if="testerDetail.startupParameters.target" :href="testerDetail.startupParameters.target" target="_blank">{{ testerDetail.startupParameters.target }}</a></td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_LOGIN_ID }}</th>
          <td>{{ testerDetail.exLoginId }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAM_NAME }}</th>
          <td>{{ testerDetail.examName }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_R_EXAM_NAME }}</th>
          <td>{{ testerDetail.rExamName }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_AUTH }}</th>
          <td>{{ formatIsUse(testerDetail.startupParameters.isAuth) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_MC_STARTUP }}</th>
          <td>{{ formatIsUse(testerDetail.isMcStartup) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAM_URL }}</th>
          <td><a v-if="testerDetail.startupParameters.examUrl" :href="testerDetail.startupParameters.examUrl" target="_blank">{{ testerDetail.startupParameters.examUrl }}</a></td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_REGION }}</th>
          <td>{{ testerDetail.region }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_TEST_NAME }}</th>
          <td>{{ testerDetail.testName }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_TEST_AT }}</th>
          <td>{{ testerDetail.testAt }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_PROCTOR }}</th>
          <td>{{ formatIsUse(testerDetail.startupParameters.isProctor) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_AI_AUTH }}</th>
          <td>{{ formatIsAiAuth(testerDetail.startupParameters.isAiAuth) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_AI_FAILED_MANUAL }}</th>
          <td>{{ formatIsAiFailedManual(testerDetail.startupParameters.isAiFaildManual) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_AI_IDCARD_REQUEST }}</th>
          <td>{{ formatIsDo(testerDetail.startupParameters.isAiIdcardRequest) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_AI_IDCARD_TYPE }}</th>
          <td>{{ formatAiIdcardType(testerDetail.startupParameters.aiIdcardType) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_AI_NAME_MATCH }}</th>
          <td>{{ testerDetail.startupParameters.aiNameMatch }}%</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_RECORD }}</th>
          <td>{{ formatIsUse(testerDetail.startupParameters.isRecord) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_SUMMARY }}</th>
          <td>{{ formatIsUse(testerDetail.startupParameters.isSummary) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_SELECTED_ANALYSIS_TYPES }}</th>
          <td>{{ formatSelectedAnalysisTypes(testerDetail.startupParameters.aiAfterAnalysis) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_LANG }}</th>
          <td>{{ testerDetail.startupParameters.lang }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_MAX_RECTIME }}</th>
          <td>{{ formatSeconds(testerDetail.startupParameters.maxRectime) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_MATCHING_TIMEOUT }}</th>
          <td>{{ formatSeconds(testerDetail.startupParameters.matchingTimeout) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_TESTER_RETRY }}</th>
          <td>{{ testerDetail.startupParameters.testerRetry }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_CHECKER_RETRY }}</th>
          <td>{{ testerDetail.startupParameters.checkerRetry }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_MOBILE }}</th>
          <td>{{ formatIsUse(testerDetail.startupParameters.isMobile) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_WEBRTC_TIMEOUT }}</th>
          <td>{{ formatSeconds(testerDetail.startupParameters.webrtcTimeout) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_INTERVALTIME }}</th>
          <td>{{ formatMinutes(testerDetail.startupParameters.intervaltime) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_WEBRTC_MAX_TIME }}</th>
          <td>{{ formatSeconds(testerDetail.startupParameters.webrtcMaxTime) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_VOICE_RECORDING }}</th>
          <td>{{ formatIsUse(testerDetail.startupParameters.isVoiceRecording) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_DEBUG }}</th>
          <td>{{ formatIsDebug(testerDetail.startupParameters.isDebug) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_IS_CONV }}</th>
          <td>{{ formatIsDo(testerDetail.startupParameters.isConv) }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_VIDEO_RECORDING_PREFERENCE }}</th>
          <td>{{ testerDetail.startupParameters.videoRecordingPreference }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_VOICE_QUALITY_PREFERENCE }}</th>
          <td>{{ testerDetail.startupParameters.voiceQualityPreference }}</td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_FORGET_PASSWORD }}</th>
          <td><a v-if="testerDetail.startupParameters.passwordUrl" :href="testerDetail.startupParameters.passwordUrl" target="_blank">{{ testerDetail.startupParameters.passwordUrl }}</a></td>
        </tr>
        <tr>
          <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_MEMO }}</th>
          <td>{{ testerDetail.startupParameters.memo }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import * as examineeLoginPageTypes from '@/store/types/examineeLoginPageType';
import { TesterDetailAdapter } from '@/store/types/adapters/testerDetailAdapter';
import { LanguageEnum } from '@/store/enum/language';
import TesterDetailFormatMixin from '@/components/Mixins/TesterDetailFormatMixin';

export default Vue.extend({
  name: 'Detail',
  mixins: [
    TesterDetailFormatMixin,
  ],
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerDetail(): TesterDetailAdapter {
      return this.$store.getters[examineeLoginPageTypes.GETTER_EXAMINEE_LOGIN_PAGE].testerDetail;
    },
  },
  methods: {
  },
});
</script>

<style scoped></style>
