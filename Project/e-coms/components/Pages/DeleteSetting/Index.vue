<template>
  <div class="mt-4 mb-4">
    <div class="page-title">{{ displayLang.DELETE_SETTING_TITLE }}</div>

    <div class="table-title">{{ displayLang.DELETE_SETTING_SYSTEM_TITLE }}</div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th class="w30p">{{ displayLang.DELETE_SETTING_TABLE_HEADER_KIND }}</th>
          <th class="w30p">{{ displayLang.DELETE_SETTING_TABLE_HEADER_DURATION }}</th>
          <th class="w30p">{{ displayLang.DELETE_SETTING_TABLE_HEADER_UPDATED_AT }}</th>
          <th class="w10p"></th>
        </tr>
      </thead>
      <tbody>
        <TableRecord
          :delete-setting="systemLog"
          @update="onClickUpdate"
        />
        <TableRecord
          :delete-setting="monitorHistory"
          @update="onClickUpdate"
        />
      </tbody>
    </table>

    <div class="table-title">
      {{ displayLang.DELETE_SETTING_GROUP_TITLE }}
      <button
        type="button"
        class="btn btn-secondary ml-3"
        @click="onClickAdd"
      ><i class="fa fa-plus"></i>{{ displayLang.DELETE_SETTING_ADD_BUTTON_LABEL }}</button>
    </div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th class="w30p">&nbsp;</th>
          <th class="w30p">{{ displayLang.DELETE_SETTING_TABLE_HEADER_DURATION }}</th>
          <th class="w30p">{{ displayLang.DELETE_SETTING_TABLE_HEADER_UPDATED_AT }}</th>
          <th class="w10p"></th>
        </tr>
      </thead>
      <tbody>
        <TableRecord
          :delete-setting="defaultSetting"
          @update="onClickUpdate"
        />
        <template v-for="item in deleteSettingList">
          <TableRecord
            :delete-setting="item"
            @update="onClickUpdate"
          />
        </template>
      </tbody>
    </table>

    <div class="mt-4">
      <BackButton
        :label="displayLang.MANAGEMETN_LINK_BACK"
        @click="$router.replace('/management')"
      />
    </div>

    <CreateModal
      @post="onClickCreateModalPost"
    />
    <EditModal
      :delete-setting="editModalData.deleteSetting"
      @post="onClickEditModalPost"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TableRecord from './Childs/TableRecord.vue';
import CreateModal from './Childs/CreateModal.vue';
import EditModal from './Childs/EditModal.vue';
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as deleteSettingPageTypes from '@/store/types/deleteSettingPageType';
import {
  DeleteSettingSpecialGroupId,
  DeleteSetting,
  DeleteSettingStoreAdapter,
  DeleteSettingStoreRequestType,
  DeleteSettingStoreResponseType,
  DeleteSettingUpdateAdapter,
  DeleteSettingUpdateRequestType,
  DeleteSettingUpdateResponseType,
} from '@/store/types/adapters/deleteSettingAdapter';
import { HtmlId } from '@/store/enum/HtmlId'
import { ModalOptions } from '@/plugins/global/modals';

export default Vue.extend({
  name: 'Index',
  components: {
    TableRecord,
    CreateModal,
    EditModal,
    BackButton,
  },
  data() {
    return {
      editModalData: {
        deleteSetting: null as DeleteSetting | null,
      },
    }
  },
  created() {
    this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
      .then(() => new Promise((resolve) => {
        Promise.all([
          this.$store.dispatch(deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_GET_INDEX)
        ])
        .finally(() => {
          resolve(true)
        })
      }))
      .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    systemLog(): DeleteSetting {
      return this.getSpecialDeleteSetting(DeleteSettingSpecialGroupId.SYSTEM_LOG)
    },
    monitorHistory(): DeleteSetting {
      return this.getSpecialDeleteSetting(DeleteSettingSpecialGroupId.MONITOR_HISTORY)
    },
    defaultSetting(): DeleteSetting {
      return this.getSpecialDeleteSetting(DeleteSettingSpecialGroupId.DEFAULT_SETTING)
    },
    deleteSettingList(): DeleteSetting {
      const list  = this.$store.getters[deleteSettingPageTypes.GETTER_DELETE_SETTING_PAGE_GET_INDEX_LIST]
      return list
        .filter(
          (v: DeleteSetting) => ![
            DeleteSettingSpecialGroupId.SYSTEM_LOG,
            DeleteSettingSpecialGroupId.MONITOR_HISTORY,
            DeleteSettingSpecialGroupId.DEFAULT_SETTING,
          ].includes(v.groupId as any)
        )
        .slice(0)
        .sort((l: DeleteSetting, r: DeleteSetting) => (l.id as number) - (r.id as number))
    },
  },
  methods: {
    /**
     * 特殊な削除設定を生成します
     *
     * @param {DeleteSettingSpecialGroupId} specialGroupId
     * @return {DeleteSetting}
     */
    getSpecialDeleteSetting(specialGroupId: DeleteSettingSpecialGroupId): DeleteSetting {
      const list  = this.$store.getters[deleteSettingPageTypes.GETTER_DELETE_SETTING_PAGE_GET_INDEX_LIST]
      const find = list.find((v: DeleteSetting) => v.groupId == specialGroupId)

      return Object.assign(
        {
          id: null,
          groupId: specialGroupId,
          duration: null,
          updatedAt: null,
        },
        find || {},
      ) as DeleteSetting

    },
    /**
     * 「追加」ボタンのイベントハンドラ
     */
    onClickAdd() {
      this.$bvModal.show(HtmlId.DELETE_SETTING_CREATE_MODAL)
    },
    /**
     * 「追加」モーダルの「登録」ボタンのイベントハンドラ
     */
    onClickCreateModalPost(request: DeleteSettingStoreRequestType) {
      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {

          this.$store.dispatch(deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_POST_STORE, request)
            .then((adapter: DeleteSettingStoreAdapter) => {
              this.$modals.showSuccessAlert((this.displayLang as any).DELETE_SETTING_CREATE_SUCCESS_MESSAGE, {hideBackdrop: true} as ModalOptions)
                .then(() => {
                  this.$store.dispatch(deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_GET_INDEX)
                    .finally(() => {
                      this.$bvModal.hide(HtmlId.DELETE_SETTING_CREATE_MODAL)
          
                      resolve(true)
                    })
                })
            })
            .catch((e: any) => {
              this.$modals.showErrorAlert((this.displayLang as any).DELETE_SETTING_CREATE_ERROR_MESSAGE, {hideBackdrop: true} as ModalOptions)
                .then(() => {
                  reject(e)
                })
            })
        }))
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
    },
    /**
     * 「更新」します
     *
     * @param {DeleteSetting} deleteSetting
     */
    onClickUpdate(deleteSetting: DeleteSetting) {
      this.$set(this.editModalData, 'deleteSetting', deleteSetting)

      this.$bvModal.show(HtmlId.DELETE_SETTING_EDIT_MODAL)
    },
    /**
     * 「更新」モーダルの「更新」ボタンのイベントハンドラ
     */
    onClickEditModalPost(request: DeleteSettingUpdateRequestType) {
      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {

          this.$store.dispatch(deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_POST_UPDATE, request)
            .then((adapter: DeleteSettingStoreAdapter) => {
              this.$modals.showSuccessAlert((this.displayLang as any).DELETE_SETTING_EDIT_SUCCESS_MESSAGE, {hideBackdrop: true} as ModalOptions)
                .then(() => {
                  this.$store.dispatch(deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_GET_INDEX)
                    .finally(() => {
                      this.$bvModal.hide(HtmlId.DELETE_SETTING_EDIT_MODAL)
          
                      resolve(true)
                    })
                })
            })
            .catch((e: any) => {
              this.$modals.showErrorAlert((this.displayLang as any).DELETE_SETTING_EDIT_ERROR_MESSAGE, {hideBackdrop: true} as ModalOptions)
                .then(() => {
                  reject(e)
                })
            })
        }))
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false))
    },
  },
});
</script>

<style></style>
