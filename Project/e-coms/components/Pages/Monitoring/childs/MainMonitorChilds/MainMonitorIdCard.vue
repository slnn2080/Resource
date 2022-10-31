<template>
 <label class="id-card">
   <input type="checkbox" checked="">
   <img :src="monitorObject.data.idCardUrl">
 </label>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {LanguageEnum} from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { MonitorPageAdapter, MonitorObject, MonitorObjectActions } from '@/store/types/adapters/monitorPageAdapter';

export default Vue.extend({
  name: 'MainMonitorIdCard',
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
  data() {
    return {
      tempIdCardUrl: null as string | null,
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
});
</script>

<style scoped></style>
