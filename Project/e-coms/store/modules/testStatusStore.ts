import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  TestStatusAdapter,
  TestStatusRequestType,
  TestStatusResponseType
} from '@/store/types/adapters/testStatusAdapter';
import * as types from '@/store/types/testStatusType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new TestStatusAdapter();
};

type TestStatusState = ReturnType<typeof state>;

const getters: GetterTree<TestStatusState, TestStatusState> = {
};

const mutations: MutationTree<TestStatusState> = {
};

const actions: ActionTree<TestStatusState, TestStatusState> = {
  [types.ACTION_CHANGE_TEST_STATUS](context, payload: TestStatusRequestType): Promise<TestStatusAdapter> {
    console.log('[LOG INFO] get tester recording start');
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TEST_STATUS.url, {
          login_id: payload.loginId,
          term_set_code: payload.termSetCode,
          process: payload.process,
          eai: payload.eai,
          test_name: payload.testName,
          region: payload.region,
          group_id: payload.groupId,
          group: payload.group
        })
        .then((response: TestStatusResponseType) => {
          if (response.status === 200) {
            const adapter = TestStatusAdapter.fromResponse(response)
            resolve(adapter);
          } else {
            // TODO : 試験の開始、中断、終了、再開に応じて処理を分岐（必要なら）
            const err: ErrorStatus = {
              endpoint: Endpoint.TEST_STATUS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch((e: any) => {
          console.error('[Tester Recording error start] : ', e);
          reject(e)
        });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
