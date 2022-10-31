import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import { LanguageEnum } from '@/store/enum/language';
import { RecordDetail } from '@/store/types/adapters/testerDetailAdapter'

export default Vue.extend({
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
    /**
     * 「利用する」「利用しない」に変換します
     *
     * @param {any} value
     * @return {string}
     */
    formatIsUse(value: any): string {
      return value
        ? (this.displayLang as any).WORD_USE
        : (this.displayLang as any).WORD_NOT_USE
    },
    /**
     * 「する」「しない」に変換します
     *
     * @param {any} value
     * @return {string}
     */
    formatIsDo(value: any): string {
      return value
        ? (this.displayLang as any).WORD_DO
        : (this.displayLang as any).WORD_DONT_DO
    },
    /**
     * 「あり」「なし」に変換します
     *
     * @param {any} value
     * @return {string}
     */
    formatIsExists(value: any): string {
      return value
        ? (this.displayLang as any).WORD_EXISTS
        : (this.displayLang as any).WORD_NOT_EXISTS
    },
    /**
     * 「監視員」「AI」に変換します
     *
     * @param {any} value
     * @return {string}
     */
    formatIsAiAuth(value: any): string {
      const map: {[key:number]: string} = {
        1: (this.displayLang as any).WORD_PROCTOR,
        2: (this.displayLang as any).WORD_AI,
      }
      return map[value] || ''
    },
    /**
     * 「強制ログアウト」「監視員認証」「続行」に変換します
     *
     * @param {any} value
     * @return {string}
     */
    formatIsAiFailedManual(value: any): string {
      const map: {[key:number]: string} = {
        1: (this.displayLang as any).WORD_FORCE_LOGOUT,
        2: (this.displayLang as any).WORD_PROCTOR_AUTH,
        3: (this.displayLang as any).WORD_CONTINUE,
      }
      return map[value] || ''
    },
    /**
     * 「運転免許証」/「パスポート」/「マイナンバーカード」に変換します
     *
     * @param {number[] | null} value
     * @return {string}
     */
    formatAiIdcardType(value: number[] | null): string {
      if (value == null) {
        return ''
      }

      const map: {[key:number]: string} = {
        1: (this.displayLang as any).WORD_DRIVERS_LICENSE,
        2: (this.displayLang as any).WORD_PASSPORT,
        3: (this.displayLang as any).WORD_MY_NUMBER_CARD,
      }

      return value
        .slice(0)
        .sort((l, r) => l - r)
        .map(v => map[v] || '')
        .filter(v => !!v)
        .join('/')
    },
    /**
     * 「off」「1」「2」「3」に変換します
     *
     * @param {number | null} value
     * @return {string}
     */
    formatIsDebug(value: any): string {
      if (!value) {
        return 'off'
      }
      return '' + value
    },
    /**
     * 録画状況ステータスの文字列に変換します
     *
     * @param {RecordDetail[] | null} value
     * @return {string}
     */
    formatMovieStatus(records: RecordDetail[] | null): string {
      if (!records || !records.length) {
        return ''
      }

      // @ts-ignore
      const movieStatus = this.getRecordDetail(records)[0].movieStatus

      //  0:未変換 1:変換中 2:変換完了 3:解析未処理 4:解析依頼処理中 5:解析中 6:解析完了 7:解析エラー 8:変換エラー
      const map: {[key:number]: string} = {
        0: (this.displayLang as any).WORD_RECORD_LOG_STATUS_00,
        1: (this.displayLang as any).WORD_RECORD_LOG_STATUS_01,
        2: (this.displayLang as any).WORD_RECORD_LOG_STATUS_02,
        3: (this.displayLang as any).WORD_RECORD_LOG_STATUS_03,
        4: (this.displayLang as any).WORD_RECORD_LOG_STATUS_04,
        5: (this.displayLang as any).WORD_RECORD_LOG_STATUS_05,
        6: (this.displayLang as any).WORD_RECORD_LOG_STATUS_06,
        7: (this.displayLang as any).WORD_RECORD_LOG_STATUS_07,
        8: (this.displayLang as any).WORD_RECORD_LOG_STATUS_08,
      }
      return map[movieStatus] || ''
    },
    /**
     * 録画状況ステータスメッセージの文字列に変換します
     *
     * @param {RecordDetail[] | null} value
     * @return {string}
     */
    formatMovieStatusMessage(records: RecordDetail[] | null): string {
      if (!records || !records.length) {
        return ''
      }

      // @ts-ignore
      return this.getRecordDetail(records)[0].detail
    },
    /**
     * 一番ステータスの小さいものを抽出します
     *
     * @param {RecordDetail[] | null} value
     * @return {RecordDetail}
     */
    getRecordDetail(records: RecordDetail[] | null): RecordDetail {
      // 一番ステータスの小さいものを抽出する
      // @ts-ignore
      return records
        .slice(0)
        .sort((l: RecordDetail, r: RecordDetail) => l.movieStatus - r.movieStatus)
    },
    /**
     * 「秒」を追加します
     *
     * @param {number | null} value
     * @return {string}
     */
    formatSeconds(value: number | null): string {
      if (value == null) {
        return ''
      }
      return '' + value + (this.displayLang as any).WORD_SECONDS
    },
    /**
     * 「分」を追加します
     *
     * @param {number | null} value
     * @return {string}
     */
    formatMinutes(value: number | null): string {
      if (value == null) {
        return ''
      }
      return '' + value + (this.displayLang as any).WORD_MINUTES
    },
    /**
     * 日時に変換します
     *
     * @param {any} s
     * @return {string}
     */
    formatDatetime(s: any = null): string {
      if (s == null) {
        return ''
      }
      return s
    },
    /**
     * 解析種類の文字列に変換します
     * 「eye_rot」/「other_person」/「perple_num」/「voice」に変換します
     * 複数の解析種類が選択された場合は、半角コンマ+半角スペース（', '）で区切ってつなげた文字列をreturnします。例（1_4 ⇒ 'eye_rot, voice'）
     *
     * @param {any} value
     * @return {string}
     */
     formatSelectedAnalysisTypes(value: any | null): string {
      if (value == null) {
        return ''
      }

      const types: number[] = value.split('_');

      const array1: {[key:number]: string} = {
        1: (this.displayLang as any).WORD_ANALYSIS_TYPE_01,
        2: (this.displayLang as any).WORD_ANALYSIS_TYPE_02,
        3: (this.displayLang as any).WORD_ANALYSIS_TYPE_03,
        4: (this.displayLang as any).WORD_ANALYSIS_TYPE_04,
      }

      return types
        .slice(0)
        .sort((l, r) => l - r)
        .map(v => array1[v] || '')
        .filter(v => !!v)
        .join(', ')
    },
    /**
     * 解析エラーの文字列に変換します
     * detailカラムのJSONデータを用いて、id, label_ja, message_jaの3種類を改行して動画状態の「ステータス」欄に表示します
     *
     * @param {object | null} detail
     * @param {string} column
     * @return {string}
     */
     formatAnalysisErrors(detail: any, column: string): string {
      let returnString: string = ''
      var errorIds = ['20','21','22','23','24']
      if(errorIds.includes(detail.id)){
        const stringifiedDetail = JSON.stringify(detail, null, 2)
        const parsedDetails = JSON.parse(stringifiedDetail)
        returnString = '\
        ';
        if(column === 'id') returnString = column + ": "
        returnString += parsedDetails[column]
      }

      return returnString
    },
  },
})
