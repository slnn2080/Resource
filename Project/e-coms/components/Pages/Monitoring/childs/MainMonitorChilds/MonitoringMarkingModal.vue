<template>
  <div>
    <b-modal
      :id="id"
      :title="displayLang.MONITORING_MARKING_MODAL_TITLE"
      @ok="handleOk($event, type.id, time, isNotification)"
    >
      <div class="row">
        <div class="col-6">
          <div class="media-photo">
            <img :src="src" class="img-fluid" />
          </div>
          <ul class="media-caption">
            <li>
              <i class="fa fa-clock-o" aria-hidden="true"></i>
              {{ monitoringScreenTime }}
            </li>
            <li>
              <i class="fa fa-tag" aria-hidden="true"></i>
              {{type.label}}
            </li>
          </ul>
        </div>
        <div class="col-6">
          <div class="form-headline">{{ displayLang.MONITORING_MARKING_MODAL_NOTIFY_SETTING }}</div>
          <div class>
            <div class="custom-control custom-radio">
              <input
                id="customRadio1"
                v-model="isNotification"
                type="radio"
                name="set-notification"
                class="custom-control-input"
                :value="true"
              />
              <label
                class="custom-control-label"
                for="customRadio1"
              >{{ displayLang.MONITORING_MARKING_MODAL_NOTIFY }}</label>
            </div>
            <div class="custom-control custom-radio">
              <input
                id="customRadio2"
                v-model="isNotification"
                type="radio"
                name="set-notification"
                class="custom-control-input"
                :value="false"
              />
              <label
                class="custom-control-label"
                for="customRadio2"
              >{{ displayLang.MONITORING_MARKING_MODAL_NOT_NOTIFY }}</label>
            </div>
          </div>
        </div>
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <button
          class="btn btn-secondary"
          @click="cancel()"
        >{{ displayLang.MONITORING_MARKING_MODAL_CANCEL }}</button>
        <button
          class="btn btn-primary"
          @click="ok()"
        >{{ displayLang.MONITORING_MARKING_MODAL_DONE }}</button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { Marks } from '~/store/types/adapters/marksAdapter';

export default Vue.extend({
  name: 'MonitoringMarkingModal',
  props: {
    monitoringScreenTime: {
      type: String,
      required: true
    },
    handleOk: {
      type: Function,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      type: {} as Marks,
      time: 0 as number,
      isNotification: true as boolean
    };
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    id(): string {
      return HtmlId.MONITOR_MARKING_MODAL
    },
  },
  created() {
    this.$nuxt.$on('markingEvent', (type: Marks, time: number) => {
      this.type = type;
      this.time = time;
    });
  },
  updated() {
    console.log(this.src);
    console.log('MonitoringMarkingModal Updated');
  },
});
</script>
<style scoped></style>
