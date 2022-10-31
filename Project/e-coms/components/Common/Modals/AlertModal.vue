<template>
  <!-- @see https://bootstrap-vue.org/docs/components/modal -->
  <b-modal
    :id="id"
    :title="modalOptions.title || displayLang.MODAL_ERROR_TITLE_DEFAULT"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    :dialog-class="dialogClass"
    :modal-class="modalClass"
    header-class="modal-header"
    footer-class="modal-footer text-center"
    :hide-backdrop="!!modalOptions.hideBackdrop"
    @show="$emit('show')"
    @hidden="$emit('hidden')"
  >
    <template v-if="bodyStrings.length <= 1">
      {{ bodyStrings[0] }}
    </template>
    <template v-else>
      <template v-for="(item, index) in bodyStrings">
        {{ item }}<br>
      </template>
    </template>

    <template #modal-footer="{close}">
      <b-button
        variant="secondary"
        @click="close()"
      >
        {{ displayLang.MODAL_BUTTON_LABEL_CLOSE }}
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import {LanguageEnum} from "@/store/enum/language";
import * as rootTypes from "@/store/types/rootType";
import { ModalOptions } from '@/plugins/global/modals'

export default Vue.extend({
  name: 'AlertModal',
  props: {
    modalOptions: {
      type: Object as PropType<ModalOptions>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    id(): string {
      return HtmlId.GLOBAL_ALERT_MODAL
    },
    dialogClass(): string {
      let classes: string[] = []

      return classes.join(' ')
    },
    modalClass(): string {
      let classes: string[] = []

      switch (this.modalOptions.modalType) {
        case 'error':
          classes = classes.concat(['failure-modal'])
          break;

        case 'caution':
          classes = classes.concat(['caution-modal'])
          break;

        case 'success':
        default:
          classes = classes.concat(['success-modal'])
          break;
      }

      return classes.join(' ')
    },
    bodyStrings(): string[] {
      if (typeof this.modalOptions.body === 'string') {
        return (this.modalOptions.body as string).split('\n');
      }

      return this.modalOptions.body as string[];
    },
  },
});
</script>

<style scoped>
/* このidはb-modalが自動で生成するIDなので不用意に変えてはいけない HtmlId.GLOBAL_ALERT_MODALを変更する場合はこれも変える必要がある */
#global-alert-modal___BV_modal_outer_ {
  z-index: 10000000 !important;
}
</style>
