<template>
  <div class="soundmeter">
    <div class="meter" :style="{ height: sideMeter}"></div>
    <div class="meter" :style="{ height: centerMeter}"></div>
    <div class="meter" :style="{ height: sideMeter}"></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as notifyListTypes from '@/store/types/fixedNotificationsType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import * as loginTypes from '@/store/types/loginType';
import { FixedNotification } from '@/store/types/adapters/fixedNotificationsAdapter';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';

export default Vue.extend({
  name: 'MonitoringSoundMeter',
  data() {
    return {
      sideMeter: '' as string,
      centerMeter: '' as string
    };
  },
  props: {
    monitorObject: {
      type: Object as PropType<MonitorObject>,
      required: true
    },
    monitorObjectActions: {
      type: Object as PropType<MonitorObjectActions>,
      required: true
    },
  },
  computed: {
    audioSize(): number {
      return this.monitorObject.data.audioSize
    },
  },
  watch: {
    audioSize(newAudioSize: number, oldAuidoSize: number) {
      this.updateAudioSize(newAudioSize)
    },
  },
  methods: {
    /**
     *
     *
     */
    updateAudioSize(audioSize: number) {
      if (audioSize >= 0 && audioSize <= 4) {
        this.sideMeter = '5px';
        this.centerMeter = '5px';
      } else if (audioSize >= 5 && audioSize <= 14) {
        this.sideMeter = '25%';
        this.centerMeter = '50%';
      } else if (audioSize >= 20) {
        this.sideMeter = '50%';
        this.centerMeter = '100%';
      }
    }
  }
});
</script>

<style scoped></style>
