<template>
  <div class="col-6">
    <!-- 本人確認ログ -->
    <div class="headline">{{ displayLang.EXAMINEE_LOGIN_DETAIL_MESSAGES_IDENTIFICATION }}</div>
    <div class="card mb-3">
      <MessageDetailList :messages="identification" />
    </div>
    <!-- 監視ログ -->
    <div class="headline">{{ displayLang.EXAMINEE_LOGIN_DETAIL_MESSAGES_MONITORING }}</div>
    <div class="card mb-3">
      <MessageDetailList :messages="monitoring" />
    </div>
    <!-- 受験者ログ -->
    <div class="headline mt-3">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_HEADLINE }}</div>
    <table class="table table-bordered user-info">
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_STATUS }}</th>
        <td>{{ examineeLogStatus }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_AI_NAME_MATCH }}</th>
        <td>{{ testerDetail.aiNameMatch }}%</td>
      </tr>
    </table>
    <table class="table table-bordered user-info">
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_LOGIN_TIME }}</th>
        <td>{{ formatDatetime(testerDetail.loginAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_MATCHED }}</th>
        <td>{{ formatDatetime(testerDetail.matchedAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_AUTHENTICATED }}</th>
        <td>{{ formatDatetime(testerDetail.authenticatedAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_EXAM_START }}</th>
        <td>{{ formatDatetime(testerDetail.testAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_EXAM_END }}</th>
        <td>{{ formatDatetime(testerDetail.stopAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_EXAMINEE_LOG_LOGOUT }}</th>
        <td>{{ formatDatetime(testerDetail.logoutAt) }}</td>
      </tr>
    </table>
    <!-- 動画状態 -->
    <div class="headline">{{ displayLang.EXAMINEE_LOGIN_DETAIL_RECORD_LOG_HEADLINE }}</div>
    <table class="table table-bordered user-info">
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_RECORD_LOG_STATUS }}</th>
        <td>
          {{ formatMovieStatus(testerDetail.records) }}
          <span v-if="formatMovieStatusMessage(testerDetail.records)">
            <br />
            {{ formatMovieStatusMessage(testerDetail.records) }} <br />
          </span>
        </td>
      </tr>
    </table>
    <table class="table table-bordered user-info">
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_RECORD_LOG_START }}</th>
        <td>{{ formatDatetime(recordTimeMap.startAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_RECORD_LOG_END }}</th>
        <td>{{ formatDatetime(recordTimeMap.stopAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_RECORD_LOG_ENCODED }}</th>
        <td>{{ formatDatetime(recordTimeMap.encodedAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_RECORD_LOG_AI_ANALYSIS_AUTO }}</th>
        <td>{{ formatDatetime(recordTimeMap.aiAnalysisBatchReflectedAt) }}</td>
      </tr>
      <tr>
        <th class="item-name">{{ displayLang.EXAMINEE_LOGIN_DETAIL_RECORD_LOG_AI_ANALYSIS_MANUAL }}</th>
        <td>{{ formatDatetime(recordTimeMap.aiAnalysisReflectedAt) }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MessageDetailList from './MessageDetailList.vue';
import * as rootTypes from '@/store/types/rootType';
import * as testerDetailTypes from '@/store/types/testerDetailType';
import * as examineeLoginPageTypes from '@/store/types/examineeLoginPageType';
import { LanguageEnum } from '@/store/enum/language';
import {
  WebRTCSendType,
  WebRTCMessageType,
  Message,
} from '@/store/types/adapters/webrtcMessageAdapter';
import { TesterDetailAdapter, RecordDetail } from '@/store/types/adapters/testerDetailAdapter';
import TesterDetailFormatMixin from '@/components/Mixins/TesterDetailFormatMixin';

export default Vue.extend({
  name: 'LogList',
  components: {
    MessageDetailList,
  },
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
    messages(): Message[] {
      return this.testerDetail.messages
    },
    identification(): Message[] {
      return this.messages
        .filter(message => message.messageType === WebRTCMessageType.IDENTIFICATION_TESTER || message.messageType === WebRTCMessageType.IDENTIFICATION_CHECKER)
        .reverse()
    },
    monitoring(): Message[] {
      return this.messages
        .filter(message => message.messageType === WebRTCMessageType.MONITORING)
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
  },
});
</script>

<style scoped>
  .list-log {
    overflow: hidden;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px dotted #ddd;
  }
  .list-log:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .list-log .log-date{
    float: left;
    width: 120px;
    margin-right: 1em;
    color: #666;
  }
  .list-log .log-comment{
    float: left;
    width: calc(100% - 140px);
  }
  .list-log-scroll {
    max-height: 400px;
    overflow-y: auto;
  }
</style>
