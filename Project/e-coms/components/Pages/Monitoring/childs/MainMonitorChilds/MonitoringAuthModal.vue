<template>
  <div>
    <b-modal
      :id="id"
      :title="displayLang.MONITORING_AUTH_MODAL_TITLE"
      @ok="handleOk($event)"
    >
      <img
        :src="src"
        class="img-fluid"
      />
      <template v-slot:modal-footer="{ ok, cancel }">
        <button class="btn btn-secondary" @click="cancel()">
          {{ displayLang.MONITORING_AUTH_MODAL_CANCEL }}
        </button>
        <button class="btn btn-primary" @click="ok()">
          {{ displayLang.MONITORING_AUTH_MODAL_DONE }}
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
export default Vue.extend({
  name: 'MonitoringAuthModal',
  props: {
    handleOk: {
      type: Function,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    id(): string {
      return HtmlId.MONITOR_AUTH_MODAL
    },
  },
  methods: {}
});
</script>
<style scoped></style>
