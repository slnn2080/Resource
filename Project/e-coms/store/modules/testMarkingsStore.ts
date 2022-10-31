/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';

import { Endpoint } from '@/store/const/endpoint';
import { TestMarkingsAdapter, TestMarkingsResponseType } from '@/store/types/adapters/testMarkingsAdapter';
import * as types from '@/store/types/testMarkingsType';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new TestMarkingsAdapter();
};

type TestMarkingsState = ReturnType<typeof state>;

const getters: GetterTree<TestMarkingsState, TestMarkingsState> = {
  [types.GETTER_TEST_MARKINGS](state: TestMarkingsState): TestMarkingsAdapter {
    return { ...state };
  }
};

const mutations: MutationTree<TestMarkingsState> = {
  [types.MUTATION_TEST_MARKINGS](state: TestMarkingsState, payload: TestMarkingsAdapter) {
    state.testId = payload.testId;
    state.markings = payload.markings;
    state.markingTotalScore = payload.markingTotalScore;
    state.records = payload.records;
  }
};

const actions: ActionTree<TestMarkingsState, TestMarkingsState> = {
  [types.ACTION_TEST_MARKINGS](context, testId: number): Promise<TestMarkingsAdapter> {
    context.commit(types.MUTATION_TEST_MARKINGS, new TestMarkingsAdapter(testId));
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TEST_MARKINGS.url, {
          params: {
            test_id: testId
          }
        })
        .then((response: TestMarkingsResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TEST_MARKINGS, {
              testId,
              markings: response.result.markings.map(marking => ({
                markingAt: marking.marking_at,
                url: marking.url,
                mark: marking.mark,
                recordId: marking.record_id,
              })),
              markingTotalScore: response.result.marking_total_score,
              records: response.result.records.map(record => ({
                id: record.id,
                startAt: record.start_at,
                stopAt: record.stop_at,
                url: record.url,
              })),
            });
            resolve(context.getters[types.GETTER_TEST_MARKINGS]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TEST_MARKINGS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Test Markings error] : ', e);
          // TODO : will be implement error log api request.
          reject(e);
        });
    });
  },
  // TODO k-nishigaki 2020/07/06 ACTION_TEST_MARKINGSとほとんど同じ まとめたい
  [types.ACTION_TEST_MARKINGS_LATEST](context): Promise<TestMarkingsAdapter> {
    context.commit(types.MUTATION_TEST_MARKINGS, new TestMarkingsAdapter());
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TEST_MARKINGS.url, {
          params: {}
        })
        .then((response: TestMarkingsResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TEST_MARKINGS, {
              markings: response.result.markings.map(marking => ({
                markingAt: marking.marking_at,
                url: marking.url,
                mark: marking.mark,
                recordId: marking.record_id,
              })),
              markingTotalScore: response.result.marking_total_score,
              records: response.result.records.map(record => ({
                id: record.id,
                startAt: record.start_at,
                stopAt: record.stop_at,
                url: record.url,
              })),
            });
            resolve(context.getters[types.GETTER_TEST_MARKINGS]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Test Markings error] : ', e);
          // TODO : will be implement error log api request.
          reject(e);
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
