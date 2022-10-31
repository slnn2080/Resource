<template>
  <div>
    <b-modal
      :id="id"
      :title="displayLang.MONITORING_HISTORY_MODAL_TITLE"
      :hide-backdrop="false"
    >
      <table class="table table-bordered user-list">
        <thead>
          <tr>
            <th class="w25p">{{ displayLang.MONITORING_HISTORY_MODAL_TABLE_HEADER_LOGIN_ID }}</th>
            <th class="w25p">{{ displayLang.MONITORING_HISTORY_MODAL_TABLE_HEADER_NAME }}</th>
            <th class="w25p">{{ displayLang.MONITORING_HISTORY_MODAL_TABLE_HEADER_STATUS }}</th>
            <th class="w25p">{{ displayLang.MONITORING_HISTORY_MODAL_TABLE_HEADER_UPDATED_AT }}</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="user in users"
          >
            <tr
              class="clickable"
              data-href="#"
              @click="onClickRecord(user)"
            >
              <td>{{ user.exLoginId }}</td>
              <td>{{ user.examName }}</td>
              <td class="text-center">{{ user.statusString }}</td>
              <td class="text-center">{{ user.updatedAt }}</td>
            </tr>
          </template>
        </tbody>
      </table>

      <template v-slot:modal-footer="{ close }">
        <button class="btn btn-secondary" @click="close()">
          {{ displayLang.MONITORING_HISTORY_MODAL_CLOSE }}
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { HtmlId } from '@/store/enum/HtmlId'
import { LanguageEnum } from '@/store/enum/language';
import * as rootTypes from '@/store/types/rootType';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import { MatchingHistoriesUser } from '@/store/types/adapters/matchingHistoriesAdapter';

export default Vue.extend({
  name: 'MonitoringHistoryModal',
  props: {
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    id(): string {
      return HtmlId.MONITOR_HISTORY_MODAL
    },
    /**
     * マッチングしたユーザ一覧を取得します
     *
     * @return {MatchingHistoriesUser[]}
     */
    users(): MatchingHistoriesUser[] {
      return this.$store.getters[monitorPageTypes.GETTER_MATCHING_HISTORIES].users
    },
  },
  methods: {
    /**
     * レコードをクリックした際のイベントハンドラ
     *
     * @param {MatchingHistoriesUser} user
     */
    onClickRecord(user: MatchingHistoriesUser) {
      this.$window.openChildWindow(`/examinees/${user.examUserId}?disabledBackButton=1`, {examUserId: user.examUserId}, 'childwin')
    },
  },
});
</script>
<style scoped></style>
