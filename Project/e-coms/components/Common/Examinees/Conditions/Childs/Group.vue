<template>
  <ValidationObserver ref="groupObserver" v-slot="{ dirty, invalid }" slim>
    <div class="form-row">
      <div class="form-group col-6">
        <label for="testing_organization">{{ displayLang.EXAMINEES_CONDITIONS_GROUP }}</label>
        <ValidationProvider
          vid="group"
          v-slot="{ drity, invalid, errors }"
          rules="group_or_group_code:group,groupCode"
          slim
        >
          <select
            id="testing_organization"
            class="form-control"
            :class="[(dirty && invalid) ? 'is-invalid' : '']"
            ref="group"
            v-model="group"
          >
            <option :value="null">-</option>
            <option v-for="item in conditions.groups" :value="item.id">{{ item.value + '(' + item.group_code + ')' }}</option>
          </select>
          <template v-if="dirty && invalid">
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </template>
          <div class="form-text text-muted mt-2">{{ displayLang.EXAMINEES_CONDITIONS_GROUP_ALERT }}</div>
        </ValidationProvider>
      </div>
      <div class="form-group col-3">
        <label for="testing_organization_code">{{ displayLang.EXAMINEES_CONDITIONS_GROUP_CODE }}</label>
        <ValidationProvider
          vid="groupCode"
          v-slot="{ drity, invalid }"
          rules="group_or_group_code:group,groupCode"
          slim
        >
          <input
            type="text"
            class="form-control"
            :class="[(dirty && invalid) ? 'is-invalid' : '']"
            autocomplete="off"
            id="testing_organization_code"
            ref="groupCode"
            v-model="groupCode"
          >
        </ValidationProvider>
      </div>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue';
import { LanguageEnum } from '~/store/enum/language';
import * as commonExamineesTypes from '@/store/types/commonExamineesType';
import * as rootTypes from '~/store/types/rootType';
import { TestersConditions } from '@/store/types/adapters/testersConditionsAdapter';

export default Vue.extend({
  name: 'Group',
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    conditions(): TestersConditions {
      return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_TESTERS_CONDITIONS];
    },
    group: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_GROUP];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_GROUP, value);
      }
    },
    groupCode: {
      get(): string {
        return this.$store.getters[commonExamineesTypes.GETTER_COMMON_EXAMINEES_GET_GROUP_CODE];
      },
      set(value: string) {
        this.$store.dispatch(commonExamineesTypes.ACTION_COMMON_EXAMINEES_SET_GROUP_CODE, value);
      },
    },
  },
});
</script>

<style scoped></style>
