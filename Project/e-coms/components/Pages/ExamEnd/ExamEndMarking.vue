<template>
  <div>
    <p class="exp-text">{{ displayLang.EXAM_END_MARKING_ALERT_TEXT }}</p>
    <div class="section">
      <MarkingTimeline
        :score="score"
        :markings="markings"
        :records="records"
        :count-label="displayLang.MARKING_TIMELINE_COUNT_LABEL"
        :score-label="displayLang.MARKING_TIMELINE_SCORE_LABEL"
        :video-modal-muted="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { Marking, Record } from '@/store/types/adapters/commonMarkingTimelineAdapter';
import MarkingTimeline from '@/components/Common/MarkingTimeline/MarkingTimeline.vue';

export default Vue.extend({
  name: 'ExamEndMarking',
  components: {
    MarkingTimeline,
  },
  props: {
    score: {
      type: Number,
      required: true
    },
    markings: {
      type: Array as PropType<Marking[]>,
      required: true
    },
    records: {
      type: Array as PropType<Record[]>,
      required: true
    },
  },
  data() {
    return {};
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  },
  methods: {}
});
</script>
