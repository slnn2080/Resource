import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  TesterKickOutAdapter,
  TesterKickOutRequestType,
  TesterKickOutResponseType
} from '@/store/types/adapters/testerKickOutAdapter';
import * as types from '@/store/types/testerKickOutType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new TesterKickOutAdapter();
};

type TesterKickOutState = ReturnType<typeof state>;

const getters: GetterTree<TesterKickOutState, TesterKickOutState> = {
};

const mutations: MutationTree<TesterKickOutState> = {
};

const actions: ActionTree<TesterKickOutState, TesterKickOutState> = {
  [types.ACTION_TESTER_KICK_OUT](context, request: TesterKickOutRequestType) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_KICK_OUT.url, request)
        .then((response: TesterKickOutResponseType) => {
          if (response.status === 200) {
            resolve();
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_KICK_OUT,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Tester Kick Out error] : ', e);
          // エラー時の処理
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
