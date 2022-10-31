<template>
  <div>
    <AlertModal
      :modal-options="alertModalOptions"
      @hidden="onHiddenAlertModal"
    />
    <ConfirmModal
      :modal-options="confirmModalOptions"
      @hidden="onHiddenConfirmModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import {LanguageEnum} from "@/store/enum/language";
import * as rootTypes from "@/store/types/rootType";
import AlertModal from '@/components/Common/Modals/AlertModal.vue'
import ConfirmModal from '@/components/Common/Modals/ConfirmModal.vue'
import { ModalType, ModalOptions, AlertModalEvent, ConfirmModalEvent } from '@/plugins/global/modals'

export default Vue.extend({
  name: 'Modals',
  components: {
    AlertModal,
    ConfirmModal,
  },
  data(): any {
    return {
      alertModalOptions: {
        modalType: ModalType.SUCCESS,
        title: '',
        body: [],
        hideBackdrop: false,
      } as ModalOptions,
      confirmModalOptions: {
        modalType: ModalType.SUCCESS,
        title: '',
        body: [],
        hideBackdrop: false,
      } as ModalOptions,
    } as any;
  },
  mounted() {
    this.$modals.eventBus.$on('global-alert-modal-show', (options: ModalOptions) => {
      Object.assign(this.alertModalOptions, options)
      this.$bvModal.show(HtmlId.GLOBAL_ALERT_MODAL);
    })
    this.$modals.eventBus.$on('global-confirm-modal-show', (options: ModalOptions) => {
      Object.assign(this.confirmModalOptions, options)
      this.$bvModal.show(HtmlId.GLOBAL_CONFIRM_MODAL);
    })
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
  },
  methods: {
    onHiddenAlertModal() {
      this.$modals.eventBus.$emit('global-alert-modal-hidden', {} as AlertModalEvent)
    },
    onHiddenConfirmModal(ok: boolean) {
      this.$modals.eventBus.$emit('global-confirm-modal-hidden', {ok: ok} as ConfirmModalEvent)
    },
  },
});
</script>

<style scoped>
</style>
