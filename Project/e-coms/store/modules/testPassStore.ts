/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  TestPassAdapter,
  SwitchTestPassResponseType,
  SwitchTestPassRequestType,
  GetTestPassRequestType,
  GetTestPassResponseType
} from '@/store/types/adapters/testPassAdapter';
import * as types from '@/store/types/testPassType';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';

const state = () => {
  return new TestPassAdapter();
};

type TestPassState = ReturnType<typeof state>;

const getters: GetterTree<TestPassState, TestPassState> = {
  [types.GETTER_TEST_PASS](state: TestPassState): TestPassAdapter {
    return { ...state };
  }
};

const mutations: MutationTree<TestPassState> = {
  [types.MUTATION_TEST_PASS](state: TestPassState, payload: TestPassAdapter) {
    state.status = payload.status;
  }
};

const actions: ActionTree<TestPassState, TestPassState> = {
  [types.ACTION_SWITCH_TEST_PASS](context, payload: SwitchTestPassRequestType): Promise<TestPassAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TEST_PASS.url, {
          test_id: payload.test_id,
          method: payload.method
        })
        .then((response: GetTestPassResponseType) => {
          if (response.status === 200) {
            resolve(context.getters[types.GETTER_TEST_PASS]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TEST_PASS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Test Pass error] : ', e);
          // TODO : will be implement error log api request.
          reject(e);
        });
    });
  },
  [types.ACTION_GET_TEST_PASS](context, testId: number): Promise<TestPassAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TEST_PASS.url, {
          params: {
            test_id: testId,
          }
        })
        .then((response: GetTestPassResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TEST_PASS, {
              status: response.result.status,
            });
            resolve(context.getters[types.GETTER_TEST_PASS]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TEST_PASS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Test Pass error] : ', e);
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
