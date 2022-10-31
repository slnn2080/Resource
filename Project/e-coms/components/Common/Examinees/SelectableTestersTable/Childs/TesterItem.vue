<template>
  <tr class="clickable" @click="onClickRecord">
    <td>
      <input v-model="selected" :disabled="this.selectableTester.disabled" type="checkbox" @click.stop="">
    </td>
    <td>
        {{ selectableTester.tester.group }}
    </td>
    <td>{{ selectableTester.tester.testName }}</td>
    <td>{{ selectableTester.tester.region }}</td>
    <td class="text-center">{{ selectableTester.tester.testAt }}～<br>{{ selectableTester.tester.stopAt }}<br></td>
    <td>{{ selectableTester.tester.examName }}</td>
    <td class="text-center">
      <template v-if="selectableTester.tester.withMark">{{ displayLang.EXAMINEES_CONDITIONS_YES }}</template>
      <template v-else>{{ displayLang.EXAMINEES_CONDITIONS_NO }}</template>
    </td>
    <td class="text-center">{{ selectableTester.tester.totalScore }}</td>
    <td class="text-center">
      {{ selectableTester.tester.record }}
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as rootTypes from '~/store/types/rootType';
import * as commonExamineesTypes from '~/store/types/commonExamineesType';
import { SelectableTester } from '@/store/types/adapters/testersAdapter';

export default Vue.extend({
  name: 'TesterItem',
  components: {},
  props: {
    index: {
      type: Number,
      required: true,
    },
    selectableTester: {
      type: Object as PropType<SelectableTester>,
      required: true,
    },
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    selected: {
      get(): boolean {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_SELECTABLE_TESTERS][this.index].selected;
      },
      set(value: boolean) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_SELECTED_OF_TESTERS, {index: this.index, value});
      }
    },
  },
  methods: {
    onClickRecord() {
      if (this.selectableTester.disabled) {
        return;
      }

      this.selected = !this.selected;
    },
  },
});
</script>

<style scoped>
</style>
