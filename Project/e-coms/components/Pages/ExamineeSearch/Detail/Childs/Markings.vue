<template>
  <div>
    <slot name="marking-summaries-anchor"></slot>

    <div class="section">
      <div class="headline">
        <slot name="marking-summaries-headline"></slot>
        <a href="#" class="backlink ml-3"><i class="fa fa-chevron-circle-up" aria-hidden="true" @click.stop.prevent=""></i>{{ displayLang.EXAMINEE_DETAIL_GOTO_PAGE_TOP }}</a>
      </div>
      <div class="card fraud-info-list">
        <div class="card-body">
          <MarkingTypeItem
            v-for="(summary, index) in markingSummaries"
            :key="index"
            :mark="summary.mark"
            :count="summary.count"
          />
        </div>
      </div>
    </div>

    <template v-if="isDownload">
      <Download
        :records="records"
      />
    </template>

    <slot name="markings-anchor"></slot>

    <div class="section">
      <div class="headline">
        <slot name="markings-headline"></slot>
        <a href="#" class="backlink ml-3"><i class="fa fa-chevron-circle-up" aria-hidden="true" @click.stop.prevent=""></i>{{ displayLang.EXAMINEE_DETAIL_GOTO_PAGE_TOP }}</a>
      </div>
      <MarkingTimeline
        :score="score"
        :markings="markings"
        :records="records"
        :count-label="countLabel"
        :score-label="scoreLabel"
        :video-modal-muted="false"
      >
      </MarkingTimeline>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as examineeDetailPageTypes from '@/store/types/examineeDetailPageType';
import { MarkingSummary } from '@/store/types/adapters/testerDetailAdapter';
import { Marking, Record } from '@/store/types/adapters/commonMarkingTimelineAdapter';
import MarkingTypeItem from './MarkingTypeItem.vue';
import MarkingTimeline from '@/components/Common/MarkingTimeline/MarkingTimeline.vue';
import Download from '@/components/Common/MarkingTimeline/Download.vue';

export default Vue.extend({
  name: 'Markings',
  components: {
    MarkingTypeItem,
    MarkingTimeline,
    Download,
  },
  props: {
    isDownload: {
      type: Boolean,
      required: true,
    },
    markingSummaries: {
      type: Array as PropType<MarkingSummary[]>,
      required: true,
    },
    score: {
      type: Number,
      required: false,
    },
    markings: {
      type: Array as PropType<Marking[]>,
      required: true,
    },
    records: {
      type: Array as PropType<Record[]>,
      required: true,
    },
    countLabel: {
      type: String,
      required: false,
    },
    scoreLabel: {
      type: String,
      required: false,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>
