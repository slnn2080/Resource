<template>
  <div class="section">
    <div class="row">
      <!-- 受験者情報 -->
      <div class="col-6">
        <slot name="user-infomation-anchor"></slot>

        <div class="headline">{{ displayLang.EXAMINEE_DETAIL_USER_INFOMATION }}
          <a href="#" class="backlink ml-3"><i class="fa fa-chevron-circle-up" aria-hidden="true" @click.stop.prevent=""></i>{{ displayLang.EXAMINEE_DETAIL_GOTO_PAGE_TOP }}</a>
        </div>
        <table class="table table-bordered user-info">
          <tbody>
            <tr>
              <th class="item-name">{{displayLang.EXAMINEE_DETAIL_HEAD_SHOT }}</th>
              <td>
                <img :src="testerDetail.headShotUri" class="mr-3" style="width:200px">
              </td>
            </tr>
            <tr>
              <th class="item-name">{{displayLang.EXAMINEE_DETAIL_ID_CARD }}</th>
              <td>
                <img :src="testerDetail.idCardUri" class="mr-3" style="width:200px">
              </td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_LOGIN_ID }}</th>
              <td>{{ testerDetail.exLoginId }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAM_NAME }}</th>
              <td>{{ testerDetail.examName }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_R_EXAM_NAME }}</th>
              <td>{{ testerDetail.rExamName }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_MEMO }}</th>
              <td>{{ testerDetail.startupParameters.memo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 設定情報 -->
      <div class="col-6">
        <div class="headline">{{ displayLang.EXAMINEE_DETAIL_SETTING }}</div>
          <table class="table table-bordered user-info">
            <tbody>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_LANG }}</th>
                <td>{{ testerDetail.startupParameters.lang }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_IS_MOBILE }}</th>
                <td>{{ formatIsUse(testerDetail.startupParameters.isMobile) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_IS_PROCTOR}}</th>
                <td>{{ formatIsUse(testerDetail.startupParameters.isProctor) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_IS_AI_AUTH }}</th>
                <td>{{ formatIsAiAuth(testerDetail.startupParameters.isAiAuth) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_IS_AI_FAILED_MANUAL }}</th>
                <td>{{ formatIsAiFailedManual(testerDetail.startupParameters.isAiFaildManual) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_IS_AI_IDCARD_REQUEST }}</th>
                <td>{{ formatIsDo(testerDetail.startupParameters.isAiIdcardRequest) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_AI_IDCARD_TYPE }}</th>
                <td>{{ formatAiIdcardType(testerDetail.startupParameters.aiIdcardType) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_AI_NAME_MATCH }}</th>
                <td>{{ testerDetail.startupParameters.aiNameMatch }}%</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_IS_RECORD }}</th>
                <td>{{ formatIsUse(testerDetail.startupParameters.isRecord) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_MAXIMAM_RECORDING_TIME }}</th>
                <td>{{ testerDetail.startupParameters.maxRectime }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_IS_DEBUG }}</th>
                <td>{{ formatIsDebug(testerDetail.startupParameters.isDebug) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang. EXAMINEE_DETAIL_IS_CONV }}</th>
                <td>{{ formatIsDo(testerDetail.startupParameters.isConv) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_RECORD_QUARITY }}</th>
                <td>{{ testerDetail.startupParameters.videoRecordingPreference }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_IS_AUDIO }}</th>
                <td>{{ formatIsUse(testerDetail.startupParameters.isVoiceRecording) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_AUDIO_QUARITY }}</th>
                <td>{{ testerDetail.startupParameters.voiceQualityPreference }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_MAXIMAM_CONNECTING_TIME }}</th>
                <td>{{ testerDetail.startupParameters.webrtcMaxTime }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_IS_SUMMARY }}</th>
                <td>{{ formatIsExists(testerDetail.startupParameters.isSummary) }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_SELECTED_ANALYSIS_TYPES }}</th>
                <td>{{ formatSelectedAnalysisTypes(testerDetail.startupParameters.aiAfterAnalysis) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row">
        <!-- 受験者ログ -->
        <div class="col-6">
          <slot name="examinee-log-anchor"></slot>

          <div class="headline">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_HEADLINE }}
            <a href="#" class="backlink ml-3"><i class="fa fa-chevron-circle-up" aria-hidden="true" @click.stop.prevent=""></i>{{ displayLang.EXAMINEE_DETAIL_GOTO_PAGE_TOP }}</a>
          </div>
          <table class="table table-bordered user-info">
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_STATUS }}</th>
              <td>{{ examineeLogStatus }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_AI_NAME_MATCH }}</th>
              <td>{{ testerDetail.aiNameMatch }}%</td>
            </tr>
          </table>
          <table class="table table-bordered user-info">
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_LOGIN_TIME }}</th>
              <td>{{ formatDatetime(testerDetail.loginAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_MATCHED }}</th>
              <td>{{ formatDatetime(testerDetail.matchedAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_AUTHENTICATED }}</th>
              <td>{{ formatDatetime(testerDetail.authenticatedAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_EXAM_START }}</th>
              <td>{{ formatDatetime(testerDetail.testAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_EXAM_END }}</th>
              <td>{{ formatDatetime(testerDetail.stopAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAMINEE_LOG_LOGOUT }}</th>
              <td>{{ formatDatetime(testerDetail.logoutAt) }}</td>
            </tr>
          </table>
        </div>
        <!-- 動画状態 -->
        <div class="col-6">
          <div class="headline">{{ displayLang.EXAMINEE_DETAIL_RECORD_LOG_HEADLINE }}</div>
          <table class="table table-bordered user-info">
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_RECORD_LOG_STATUS }}</th>
              <td>{{ formatMovieStatus(testerDetail.records)}}
                <span v-if="formatMovieStatusMessage(testerDetail.records)">
                  <br />
                  {{ formatMovieStatusMessage(testerDetail.records) }} <br />
                </span>
              </td>
            </tr>
          </table>
          <table class="table table-bordered user-info">
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_RECORD_LOG_START }}</th>
              <td>{{ formatDatetime(recordTimeMap.startAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_RECORD_LOG_END }}</th>
              <td>{{ formatDatetime(recordTimeMap.stopAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_RECORD_LOG_ENCODED }}</th>
              <td>{{ formatDatetime(recordTimeMap.encodedAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_RECORD_LOG_AI_ANALYSIS_AUTO }}</th>
              <td>{{ formatDatetime(recordTimeMap.aiAnalysisBatchReflectedAt) }}</td>
            </tr>
            <tr>
              <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_RECORD_LOG_AI_ANALYSIS_MANUAL }}</th>
              <td>{{ formatDatetime(recordTimeMap.aiAnalysisReflectedAt) }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="row">
        <!-- 試験情報 -->
        <div class="col-6">
          <slot name="test-infomation-anchor"></slot>

          <div class="headline">{{ displayLang.EXAMINEE_DETAIL_TEST_INFORMATION }}
            <a href="#" class="backlink ml-3"><i class="fa fa-chevron-circle-up" aria-hidden="true" @click.stop.prevent=""></i>{{ displayLang.EXAMINEE_DETAIL_GOTO_PAGE_TOP }}</a>
          </div>
          <table class="table table-bordered user-info">
            <tbody>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_GROUP }}</th>
                <td>{{ testerDetail.group }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_TEST_NAME }}</th>
                <td>{{ testerDetail.testName }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_REGION }}</th>
                <td>{{ testerDetail.region }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_TEST_AT }}</th>
                <td>
                  {{ testerDetail.testAt }}
                  ～
                  <template v-if="testerDetail.stopAt">{{ testerDetail.stopAt }}</template>
                </td>
              </tr>
              <tr v-if="testerDetail.isMcStartup">
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_CHANGE_TEST_PASS }}</th>
                <td>
                  <div class="btn-group">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="onClickSwitchExamResult('PUT', testerDetail.testId)"
                    >{{ displayLang.EXAMINEE_DETAIL_PASS }}</button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="onClickSwitchExamResult('DELETE', testerDetail.testId)"
                    >{{ displayLang.EXAMINEE_DETAIL_FAILURE }}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 設定情報 -->
        <div class="col-6">
          <div class="headline">{{ displayLang.EXAMINEE_DETAIL_SETTING }}</div>
          <table class="table table-bordered user-info">
            <tbody>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_EXAM_URL }}</th>
                <td><a v-if="testerDetail.startupParameters.examUrl" :href="testerDetail.startupParameters.examUrl" target="_blank">{{ testerDetail.startupParameters.examUrl }}</a></td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_TEST_NAME }}</th>
                <td>{{ testerDetail.startupParameters.examName }}</td>
              </tr>
              <tr>
                <th class="item-name">{{ displayLang.EXAMINEE_DETAIL_TEST_AT }}</th>
                <td>{{ testerDetail.startupParameters.examDatetime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as examineeDetailPageTypes from '@/store/types/examineeDetailPageType';
import { ExamineeDetailPageAdapter } from '@/store/types/adapters/examineeDetailPageAdapter';
import { TesterDetailAdapter } from '@/store/types/adapters/testerDetailAdapter';
import TesterDetailFormatMixin from '@/components/Mixins/TesterDetailFormatMixin';

export default Vue.extend({
  name: 'ExamInfo',
  mixins: [
    TesterDetailFormatMixin,
  ],
  props: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    testerDetail(): TesterDetailAdapter {
      return this.$store.getters[examineeDetailPageTypes.GETTER_EXAMINEE_DETAIL_PAGE_GET_TESTER_DETAIL];
    },
    examineeDetailPage(): ExamineeDetailPageAdapter {
      return this.$store.getters[examineeDetailPageTypes.GETTER_EXAMINEE_DETAIL_PAGE];
    },
    /**
     * 受験者ログステータス
     *
     * @return {string}
     */
    examineeLogStatus(): string {
      // 時系列の逆順から現在のステータスを決定する
      return ([
        {datetime: true, text: ''}, // 欠番
        {datetime: this.testerDetail.loginAt,         text: (this.displayLang as any).WORD_EXAMINEE_LOG_STATUS_LOGIN},
        {datetime: this.testerDetail.matchedAt,       text: (this.displayLang as any).WORD_EXAMINEE_LOG_STATUS_MATCHED},
        {datetime: this.testerDetail.authenticatedAt, text: (this.displayLang as any).WORD_EXAMINEE_LOG_STATUS_AUTHENTICATED},
        {datetime: this.testerDetail.testAt,          text: (this.displayLang as any).WORD_EXAMINEE_LOG_STATUS_EXAM_START},
        {datetime: this.testerDetail.stopAt,          text: (this.displayLang as any).WORD_EXAMINEE_LOG_STATUS_EXAM_END},
        {datetime: this.testerDetail.logoutAt,        text: (this.displayLang as any).WORD_EXAMINEE_LOG_STATUS_EXAM_LOGOUT},
      ] as any)
      .reverse()
      .find((v:any) => !!v.datetime)
      .text
    },
    /**
     * 動画時間
     *
     * @return {{
     *           startAt: string | null,
     *           stopAt: string | null,
     *           encodedAt: string | null,
     *           aiAnalysisBatchReflectedAt: string | null,
     *           aiAnalysisReflectedAt: string | null,
     *         }}
     */
   recordTimeMap(): {[key:string] : string} {
     const tmpRecords:any/*RecordDetail[]*/ = this.testerDetail.records.slice(0)
     if (tmpRecords.length === 0) {
       tmpRecords.push({id: 9999})
     }
     tmpRecords.sort((l: any, r: any) => l.id - r.id)
     const first:any = tmpRecords[0]
     const last:any = tmpRecords[tmpRecords.length - 1]
     return {
       startAt: first.startAt || '',
       stopAt: last.stopAt || '',
       encodedAt: last.encodedAt || '',
       aiAnalysisBatchReflectedAt: last.aiAnalysisBatchReflectedAt || '',
       aiAnalysisReflectedAt: last.aiAnalysisReflectedAt || '',
     }
   },
  },
  methods: {
    onClickSwitchExamResult(method: string, testid: number) {
      const displayLang = this.displayLang as any;
      if (confirm(displayLang.EXAMINEE_DETAIL_PASS_CONFIRM)) {
        this.$store.dispatch(examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_SWITCH_TEST_PASS, {
          testId: testid,
          method
        })
        .then(() => {
          alert(displayLang.EXAMINEE_DETAIL_PASS_SUCCESS)
        })
        .catch((err: any) => {
          alert(displayLang.EXAMINEE_DETAIL_PASS_FAILED)
        })
      }
    },
  }
});
</script>
