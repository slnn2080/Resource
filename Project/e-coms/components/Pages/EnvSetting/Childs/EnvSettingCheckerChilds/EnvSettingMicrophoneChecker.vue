<template>
  <li
    class="list-group-item"
    :class="{
      'permission-denied': deviceState === DeviceState.BEFORE_CHECK,
      'check-on': deviceState === DeviceState.ALLOWED,
      'check-error': deviceState === DeviceState.DENIED
    }"
  >
    <span class="check-type-icon">
      <i class="fa fa-microphone" aria-hidden="true"></i>
    </span>
    {{ displayLang.ENV_SETTING_MICROPHONE_CHECK }}
    <button v-if="deviceState === DeviceState.DENIED" type="button" class="btn btn-secondary" @click="reconfirm">
      {{ displayLang.ENV_SETTING_RECONFIRM }}
    </button>
    <span v-if="deviceState !== DeviceState.BEFORE_CHECK" class="check-status">
      <i class="fa fa-check-circle" aria-hidden="true" :class="{
        'fa-check-circle': deviceState === DeviceState.ALLOWED,
        'fa-times-circle': deviceState === DeviceState.DENIED
      }"></i>
    </span>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import * as rootTypes from '@/store/types/rootType';
import * as pageTypes from '@/store/types/testerPageType';
import { TesterPageAdapter } from '@/store/types/adapters/testerPageAdapter';
import { LanguageEnum } from '@/store/enum/language';
import { DeviceState } from '@/store/enum/deviceState';
import { MediaStreamResultType } from '@/plugins/global/mediaDevices';

export default Vue.extend({
  name: 'EnvSettingMicrophoneChecker',
  data() {
    return {
      DeviceState
    }
  },
  computed: {
    selectData(): TesterPageAdapter {
      return this.$store.getters[pageTypes.GETTER_TESTER_PAGE];
    },
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    deviceState(): DeviceState {
      return this.selectData.enableMicrophone;
    }
  },
  methods: {
    reconfirm() {
      this.$mediaDevices.createFrontCameraMediaStream((this.selectData.enableCamera === DeviceState.ALLOWED), true)
        .then((value: MediaStreamResultType) => {
          this.$store.dispatch(pageTypes.ACTION_TESTER_PAGE_ENABLE_MICROPHONE, value.isEnableAudio ? DeviceState.ALLOWED : DeviceState.DENIED);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }
});
</script>
