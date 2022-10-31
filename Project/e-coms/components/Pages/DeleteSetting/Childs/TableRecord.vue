<template>
  <tr>
    <td>{{ groupId }}</td>
    <td>{{ duration }}</td>
    <td>{{ updatedAt }}</td>
    <td class="text-center">
      <button
        type="button"
        class="btn btn-secondary"
        @click="$emit('update', deleteSetting)"
      >{{ buttonLabel }}</button>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import { DeleteSettingSpecialGroupId, DeleteSetting } from '@/store/types/adapters/deleteSettingAdapter';

export default Vue.extend({
  name: 'TableRecord',
  components: {
  },
  props: {
    deleteSetting: {
      type: Object as PropType<DeleteSetting>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    groupId(): string {
      const map: {[key: string]: string} = {}
      map[DeleteSettingSpecialGroupId.SYSTEM_LOG]      = (this.displayLang as any).DELETE_SETTING_SPECIAL_GROUP_ID_SYSTEM_LOG
      map[DeleteSettingSpecialGroupId.MONITOR_HISTORY] = (this.displayLang as any).DELETE_SETTING_SPECIAL_GROUP_ID_MONITOR_HISTORY
      map[DeleteSettingSpecialGroupId.DEFAULT_SETTING] = (this.displayLang as any).DELETE_SETTING_SPECIAL_GROUP_ID_DEFAULT_SETTING

      return '' + (map[this.deleteSetting.groupId] || this.deleteSetting.groupId)
    },
    duration(): string {
      if (this.deleteSetting.duration == null) {
        return '-'
      }

      return '' + this.deleteSetting.duration + (this.displayLang as any).DELETE_SETTING_DURATION
    },
    updatedAt(): string {
      if (this.deleteSetting.updatedAt == null) {
        return '--/--/-- --:--:--'
      }

      return this.deleteSetting.updatedAt
    },
    buttonLabel(): string {
      if (this.deleteSetting.duration == null) {
        return (this.displayLang as any).DELETE_SETTING_CREATE_MODAL_TITLE
      }
      return (this.displayLang as any).DELETE_SETTING_UPDATE_BUTTON_LABEL
    },
  },
  methods: {
  },
});
</script>

<style></style>

