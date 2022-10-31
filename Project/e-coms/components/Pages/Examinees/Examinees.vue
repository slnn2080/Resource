<template>
  <div class="mt-4 mb-4">
    <ExamineesConditions />
    <ExamineesNormalTestersTable />

    <!-- 「テスト管理者」は「管理トップ」画面に遷移できないように「戻る」ボタンを非表示にする -->
    <template
      v-if="isSystemManager"
    >
      <BackButton
        :label="displayLang.MANAGEMETN_LINK_BACK"
        @click="$router.replace('/management')"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ExamineesConditions from '@/components/Common/Examinees/Conditions/ExamineesConditions.vue';
import ExamineesNormalTestersTable from '@/components/Common/Examinees/NormalTestersTable/ExamineesNormalTestersTable.vue';
import BackButton from '@/components/Common/Buttons/BackButton.vue';
import { LanguageEnum } from '~/store/enum/language';
import { Actor } from '@/store/enum/Actor';
import * as rootTypes from '@/store/types/rootType';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import { LoginAdapter } from '@/store/types/adapters/loginAdapter';
import * as loginTypes from '@/store/types/loginType';

export default Vue.extend({
  name: 'Examinees',
  components: {
    ExamineesConditions,
    ExamineesNormalTestersTable,
    BackButton,
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    /**
     * システム管理者か調べます
     *
     * @return {boolean}
     */
    isSystemManager(): boolean {
      const inParams = this.$store.getters[loginTypes.GETTER_LOGIN] as LoginAdapter;
      return inParams.actor == Actor.SYSTEM_MANAGER;
    },
  },
});
</script>

<style></style>
