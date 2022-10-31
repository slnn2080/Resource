<template>
  <div class="section">
    <div class="headline">{{ displayLang.EXAMINEE_DETAIL_DOWNLOAD }}</div>
    <div class="card fraud-info-list">
      <div class="card-body">
        <template v-for="(record, index) in records">
          <a v-if="record.url"
            :key="index"
            class="btn btn-primary"
            :href="record.url"
            download
            target="_blank"
            @click.prevent.stop="onClickDownloadButton(record, index)"
          ><i class="fa fa-download" aria-hidden="true"></i>{{ makeDownloadButtonTitle(record, index) }}</a>
          <button v-else class="btn btn-primary" disabled="disabled">
            <i class="fa fa-download" aria-hidden="true"></i>{{ makeDownloadButtonTitle(record, index) }}</button>

        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import {
  TesterRecordUriAdapter,
  TesterRecordUriRequestType,
} from '@/store/types/adapters/testerRecordUriAdapter';
import * as testerRecordUriTypes from '@/store/types/testerRecordUriType';
import { Record } from '@/store/types/adapters/commonMarkingTimelineAdapter';
import { ModalOptions } from '@/plugins/global/modals';

export default Vue.extend({
  name: 'Markings',
  components: {
  },
  props: {
    records: {
      type: Array as PropType<Record[]>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
    /**
     * ダウンロードボタン押下のイベントハンドラ
     *
     * @param {Record} record
     * @param {number} index
     */
    onClickDownloadButton(record: Record, index: number): void {
      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          this.$store.dispatch(testerRecordUriTypes.ACTION_TESTER_RECORD_URI, {record_id: parseInt(record.id)} as TesterRecordUriRequestType)
            .then((adapter: TesterRecordUriAdapter) => {
              if (adapter.url == null) {
                // レコードがない場合
                this.$modals.showErrorAlert('動画がありません。', {hideBackdrop: true} as ModalOptions)
                  .then(() => {
                    reject()
                  })
              } else {
                this.download(adapter.url)

                resolve(true)
              }
            })
            .catch((e) => {
              // レコードがない場合
              this.$modals.showErrorAlert('動画がありません。', {hideBackdrop: true} as ModalOptions)
                .then(() => {
                  reject()
                })
            })
        }))
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
    },
    /**
     * ダウンロードします
     *
     * @param {string} url
     */
    download(url: string): void {
      const matched = url.match(/.*\/([^/]*)\?.*./) || []
      const fileName = (matched[1] as string) || 'unknown.webm'

      const el = document.createElement('a')
      el.href = url
      el.download = fileName
      el.target = '_blank'

      // 「ダウンロード」ボタン押下の際は、画面遷移抑制のポップアップが表示されないようにする
      const isBeforeUnload = this.$window.isBeforeUnload()
      this.$window.setBeforeUnload(false)

      el.click()

      // クリックイベント後に、画面遷移抑制のポップアップが表示されるように再設定する
      this.$nextTick(() => {
        this.$window.setBeforeUnload(isBeforeUnload)
      })
    },
    /**
     * ダウンロードボタンのキャプションを生成します
     *
     * @param {Record} record
     * @param {number} index
     * @return {string}
     */
    makeDownloadButtonTitle(record: Record, index: number): string {
      // フォーマットは'ダウンロード1（2020/00/00 00:00）長さ：m分s秒'

      const prefix = (this.displayLang as any).EXAMINEE_DETAIL_DOWNLOAD
      const no = index + 1
      const startAt = ((record.startAt || '') as string).substr(0, 'yyyy/mm/dd hh:mm'.length)

      // 動画の長さを計算し、「長さ：m分s秒」という文字列にする。
      const dateStartAt = record.playTimeFrom ? new Date(record.playTimeFrom).getTime() : 0;
      const dateStopAt = record.playTimeTo ? new Date(record.playTimeTo).getTime() : 0;
      const lengthOfMovieInSeconds = (dateStopAt - dateStartAt) / 1000;
      const minutes = Math.floor(lengthOfMovieInSeconds / 60);
      const seconds = lengthOfMovieInSeconds % 60;
      const lengthOfMovie = (dateStopAt) ? ('長さ：' + minutes + '分' + seconds + '秒') : '';

      return `${prefix}${no}（${startAt}）${lengthOfMovie}`;
    },
  },
});
</script>

