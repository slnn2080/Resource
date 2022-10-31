<template>
  <div>
    <ValidationObserver ref="obs" v-slot="obsProps">
      <b-modal
        :id="id"
        :size="'lg'"
        :no-close-on-backdrop="true"
        :no-close-on-esc="true"
        :hide-header-close="true"
        :modal-class="'success-modal'"
        :title="displayLang.DELETE_SETTING_EDIT_MODAL_TITLE"
        @shown="onShow()"
      >
        <template>
          <div class="container">
            <div class="mt-4 mb-4">
              <div class="form-inline">
                <ValidationProvider
                  v-slot="{ errors, dirty, invalid }"
                  :name="displayLang.DELETE_SETTING_GROUP_ID_LABEL"
                  rules="required"
                  sim
                >
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control mr-1"
                      :class="/*[(dirty && invalid) ? 'is-invalid' : '']*/[]"
                      :disabled="true"
                      v-model="groupId"
                    >
                    <!--
                    <template v-if="dirty && invalid">
                      <div class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </template>
                    -->
                  </div>
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors, dirty, invalid }"
                  :name="displayLang.DELETE_SETTING_DURATION_LABEL"
                  rules="required"
                  sim
                >
                  <div class="form-group">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      class="form-control mr-2 text-right"
                      :class="/*[(dirty && invalid) ? 'is-invalid' : '']*/[]"
                      v-model="duration"
                    >{{ displayLang.DELETE_SETTING_DURATION }}
                    <!--
                    <template v-if="dirty && invalid">
                      <div class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </template>
                    -->
                  </div>
                </ValidationProvider>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:modal-footer="{ close }">
          <button
            class="btn btn-secondary"
            @click="close()"
          >
            {{ displayLang.DELETE_SETTING_CLOSE_BUTTON_LABEL }}
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :disabled="/*!obsProps.dirty ||*/ obsProps.invalid"
            @click="onClickPost"
          >{{ buttonLabel }}</button>
        </template>

      </b-modal>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as deleteSettingPageTypes from '@/store/types/deleteSettingPageType';
import {
  DeleteSettingSpecialGroupId,
  DeleteSetting,
  DeleteSettingUpdateAdapter,
  DeleteSettingUpdateRequestType,
  DeleteSettingUpdateResponseType,
} from '@/store/types/adapters/deleteSettingAdapter';
import * as VeeValidate from 'vee-validate';

export default Vue.extend({
  name: 'EditModal',
  props: {
    deleteSetting: {
      type: Object as PropType<DeleteSetting>,
      required: false,
    },
  },
  data() {
    return {
      id: HtmlId.DELETE_SETTING_EDIT_MODAL as string,
      formValues: {
        groupId: '' as string,
        duration: 0 as number,
      },
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG]
    },
    groupId: {
      get(): string {
        return this.formValues.groupId
      },
      set(value: string) {
        this.formValues.groupId = value
      },
    },
    duration: {
      get(): number {
        return this.formValues.duration
      },
      set(value: number) {
        this.formValues.duration = value
      },
    },
    buttonLabel: {
      get(): string {
        if (this.deleteSetting.duration == null) {
          return (this.displayLang as any).DELETE_SETTING_POST_REGISTER_BUTTON_LABEL
        }
        return (this.displayLang as any).DELETE_SETTING_POST_UPDATE_BUTTON_LABEL
      },
    },
  },
  methods: {
    /**
     * 表示時のイベント 初期化を行う
     */
    onShow() {
      const map: {[key: string]: string} = {}
      map[DeleteSettingSpecialGroupId.SYSTEM_LOG]      = (this.displayLang as any).DELETE_SETTING_SPECIAL_GROUP_ID_SYSTEM_LOG
      map[DeleteSettingSpecialGroupId.MONITOR_HISTORY] = (this.displayLang as any).DELETE_SETTING_SPECIAL_GROUP_ID_MONITOR_HISTORY
      map[DeleteSettingSpecialGroupId.DEFAULT_SETTING] = (this.displayLang as any).DELETE_SETTING_SPECIAL_GROUP_ID_DEFAULT_SETTING

      this.formValues.groupId = '' + (map[this.deleteSetting.groupId] || this.deleteSetting.groupId)
      this.formValues.duration = (this.deleteSetting.duration || 14)as number
    },
    /**
     * 「更新」ボタン
     */
    onClickPost() {
      const request = {
        group_id: this.deleteSetting.groupId,
        duration: this.formValues.duration,
      } as DeleteSettingUpdateRequestType
      this.$emit('post', request) 
    },
  },
});
</script>
<style scoped></style>
