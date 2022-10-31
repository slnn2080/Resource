/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  TesterRejectedAdapter,
  TesterRejectedRequestType,
  TesterRejectedResponseType
} from '@/store/types/adapters/testerRejectedAdapter';
import { Endpoint } from '@/store/const/endpoint';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import * as types from '@/store/types/testerRejectedType';
import * as errTypes from '@/store/types/errorType';

const state = () => {
  return new TesterRejectedAdapter();
}

type TesterRejectedState = ReturnType<typeof state>;

const getters: GetterTree<TesterRejectedState, TesterRejectedState> = {
};

const mutations: MutationTree<TesterRejectedState> = {
};

const actions: ActionTree<TesterRejectedState, TesterRejectedState> = {
  [types.ACTION_TESTER_REJECTED](context, payload: TesterRejectedRequestType): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_REJECTED.url, {
          tester_id: payload.testerId,
          method: payload.method
        })
        .then(({ status, message }: TesterRejectedResponseType) => {
          if (status === 200) {
            resolve();
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_REJECTED,
              status,
              message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject();
          }
        })
        .catch(err => {
          console.error(err);
          reject();
        });
    });
  }
}

export default {
  state,
  getters,
  mutations,
  actions
};
