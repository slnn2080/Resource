<template>
  <div v-if="!!monitorObject.data.headShotUrl"
    class="media-thumbnail"
  >
    <img
      class="img-fluid"
      :src="monitorObject.data.headShotUrl"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Matching } from '@/store/types/adapters/matchingAdapter';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';

export default Vue.extend({
  name: 'SubHeadShot',
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
  },
});
</script>

<style scoped></style>

