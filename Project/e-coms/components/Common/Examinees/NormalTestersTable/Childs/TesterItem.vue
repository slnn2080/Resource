<template>
  <tr class="clickable" @click.prevent.stop="onClick">
    <td>
        {{ tester.group }}
    </td>
    <td>{{ tester.testName }}</td>
    <td>{{ tester.region }}</td>
    <td class="text-center">{{ tester.testAt }}～<br>{{ tester.stopAt }}<br></td>
    <td>{{ tester.examName }}</td>
    <td class="text-center">
      <template v-if="tester.withMark">{{ displayLang.EXAMINEES_CONDITIONS_YES }}</template>
      <template v-else>{{ displayLang.EXAMINEES_CONDITIONS_NO }}</template>
    </td>
    <td class="text-center">{{ tester.totalScore }}</td>
    <td class="text-center">
      {{ tester.record }}
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '~/store/types/rootType';
import { Tester } from '@/store/types/adapters/testersAdapter';
import { TesterDetailRequestType, TesterDetailParamLatestMode } from '@/store/types/adapters/testerDetailAdapter';
import * as examineeDetailPageTypes from "~/store/types/examineeDetailPageType";
import * as commonTypes from "~/store/types/commonType";
import { GetTestPassRequestType } from '@/store/types/adapters/testPassAdapter';

export default Vue.extend({
  name: 'TesterItem',
  components: {},
  props: {
    tester: {
      type: Object as PropType<Tester>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    }
  },
  methods: {
    onClick() {
      const userId = this.tester.userId;
      const testId = this.tester.testId;

      this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => {
          return this.$store.dispatch(examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_GET_TESTER_DETAIL, {user_id: userId, test_id: testId, latest_mode: TesterDetailParamLatestMode.NONE } as TesterDetailRequestType)
            .then((detail) => {
              return new Promise((resolve) => {
                // ローカル環境で、このAPIは動かないので失敗しても画面遷移を行う
                return this.$store.dispatch(examineeDetailPageTypes.ACTION_EXAMINEE_DETAIL_PAGE_GET_TEST_PASS, { testId: testId } as GetTestPassRequestType)
                  .finally(() => {
                    this.$router.push('/examinees/' + userId)
                    resolve()
                  })
              });
            })
            .catch(() => {
              this.$modals.showErrorAlert('受験者詳細APIでエラーが発生しました')
            })
        })
        .finally(() => this.$store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false));
    },
  },
});
</script>

<style scoped>
</style>
