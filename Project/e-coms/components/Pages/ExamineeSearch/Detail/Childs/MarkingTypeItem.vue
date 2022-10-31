<template>
  <div class="tag">
    {{ mark }}
    <span class="badge badge-primary badge-pill">{{ formatCount(count) }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';

export default Vue.extend({
  name: 'MarkingTypeItem',
  components: {},
  props: {
    mark: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
    /**
     * 件数表示に変換します
     *
     * @param {number} value
     * @return {string}
     */
    formatCount(value: number): string {
      return '' + value + (this.displayLang as any).EXAMINEE_DETAIL_COUNT
    },
  },
});
</script>
