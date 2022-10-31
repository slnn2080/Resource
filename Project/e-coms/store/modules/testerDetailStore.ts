import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  TesterDetailAdapter,
  TesterDetailRequestType,
  TesterDetailResponseType,
} from '@/store/types/adapters/testerDetailAdapter';
import * as types from '@/store/types/testerDetailType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new TesterDetailAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_GET_TESTER_DETAIL](context, request: TesterDetailRequestType): Promise<TesterDetailAdapter> {
    console.log('[LOG INFO] get tester detail start');
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TESTER_DETAIL.url, {
          params: request,
        })
        .then((response: TesterDetailResponseType) => {
          if (response.status === 200) {
            resolve(TesterDetailAdapter.fromResponse(response.result));
          } else {
console.error(response)
              const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_DETAIL,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[get tester detail error start] : ', e);
          reject(e);
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
