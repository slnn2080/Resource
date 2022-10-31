<template>
  <div>
    <div v-if="monitorObject.data.headShotUrl" class="monitor mb-3">
      <img
        class="img-fluid"
        :src="monitorObject.data.headShotUrl"
      />
      <div class="media-info">
        <div class="media-label">{{ testerInfo }}</div>
      </div>
    </div>
    <!-- 以下は本人認証画像なしの場合のレイアウト -->
    <div v-else class="monitor no-photo mb-3">
      <div class="no-connect-item">
        <div class="no-connect-icon">
          <i class="fa fa-camera-retro" aria-hidden="true"></i>
        </div>
        <div class="no-connect-label">{{ displayLang.MONITOR_NO_CONNECT }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';

export default Vue.extend({
  name: 'MainHeadShot',
  props: {
    monitorObject: {
      type: Object as PropType<MonitorObject>,
      required: true,
    },
    monitorObjectActions: {
      type: Object as PropType<MonitorObjectActions>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    examName(): string {
      const matching = this.monitorObject.data.matching
      if (!matching) {
        return ''
      }

      return matching!.examName || '' 
    },
    testerInfo(): string {
      if (this.examName) {
        return this.examName + ' / 確認写真';
      } else {
        return '';
      }
    },
  },
});
</script>

<style scoped></style>
