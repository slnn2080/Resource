import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  AccessLimitDeleteAdapter,
  AccessLimitDeleteRequestType,
  AccessLimitDeleteResponseType
} from '@/store/types/adapters/accessLimitDeleteAdapter';
import * as types from '@/store/types/accessLimitDeleteType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new AccessLimitDeleteAdapter();
};

type AccessLimitDeleteState = ReturnType<typeof state>;

const getters: GetterTree<AccessLimitDeleteState, AccessLimitDeleteState> = {
};

const mutations: MutationTree<AccessLimitDeleteState> = {
};

const actions: ActionTree<AccessLimitDeleteState, AccessLimitDeleteState> = {
  [types.ACTION_ACCESS_LIMIT_DELETE](context, request: AccessLimitDeleteRequestType): Promise<AccessLimitDeleteAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.ACCESS_LIMIT_DELETE.url, request)
        .then((response: AccessLimitDeleteResponseType) => {
          if (response.status === 200) {
            const adapter = new AccessLimitDeleteAdapter(
            );

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ACCESS_LIMIT_DELETE,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject();
          }
        })
        .catch((e: any) => {
          console.error('[Access Limit Delete error] : ', e);
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
