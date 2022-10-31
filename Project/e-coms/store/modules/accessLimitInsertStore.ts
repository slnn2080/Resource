import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  AccessLimitInsertAdapter,
  AccessLimitInsertRequestType,
  AccessLimitInsertResponseType
} from '@/store/types/adapters/accessLimitInsertAdapter';
import * as types from '@/store/types/accessLimitInsertType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new AccessLimitInsertAdapter();
};

type AccessLimitInsertState = ReturnType<typeof state>;

const getters: GetterTree<AccessLimitInsertState, AccessLimitInsertState> = {
};

const mutations: MutationTree<AccessLimitInsertState> = {
};

const actions: ActionTree<AccessLimitInsertState, AccessLimitInsertState> = {
  [types.ACTION_ACCESS_LIMIT_INSERT](context, request: AccessLimitInsertRequestType): Promise<AccessLimitInsertAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.ACCESS_LIMIT_INSERT.url, request)
        .then((response: AccessLimitInsertResponseType) => {
          if (response.status === 200) {
            const adapter = new AccessLimitInsertAdapter(
            );

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ACCESS_LIMIT_INSERT,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject();
          }
        })
        .catch((e: any) => {
          console.error('[Access Limit Insert error] : ', e);
          // エラー時の処理
          reject();
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
