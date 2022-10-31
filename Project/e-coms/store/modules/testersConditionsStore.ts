/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  TestersConditions,
  TestersConditionsAdapter,
  TestersConditionsResponseType
} from '@/store/types/adapters/testersConditionsAdapter';
import * as types from '@/store/types/testersConditionsType';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';

const state = () => {
  return new TestersConditionsAdapter();
}

type TestersConditionsState = ReturnType<typeof state>;

const getters: GetterTree<TestersConditionsState, TestersConditionsState> = {
};

const mutations: MutationTree<TestersConditionsState> = {
};

const actions: ActionTree<TestersConditionsState,TestersConditionsState> = {
  [types.ACTION_TESTERS_CONDITIONS](context): Promise<TestersConditions> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TESTERS_CONDITIONS.url)
        .then((response: TestersConditionsResponseType) => {
          if (response.status === 200) {
            const conditions = response.result.conditions;
            resolve({
              groups: 'groups' in conditions ? conditions.groups : [],
              testNames: conditions.test_names,
              regions: conditions.regions,
              records: conditions.records,
              withMarks: conditions.with_marks,
              marks: conditions.marks,
              cheatingLevel: conditions.cheating_level,
              aiAnalysisFlag: conditions.ai_analysis_flag,
              times: conditions.times,
            });
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTERS_CONDITIONS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject();
          }
        })
        .catch((reason: any) => {
          reject();
        });
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
