<template>
  <div class="alert alert-complete">
    <div class="alert-icon">
      <i class="fa fa-check-circle" aria-hidden="true"></i>
    </div>
    <div class="alert-text">
      {{ displayLang.EXAM_END_ALERT_TEXT_FORMER }}
      <br />
      {{ displayLang.EXAM_END_ALERT_TEXT_LATTER }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
export default Vue.extend({
  name: 'ExamEnd',
  components: {},
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
