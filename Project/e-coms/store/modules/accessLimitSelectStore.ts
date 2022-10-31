import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  AccessLimitSelectAdapter,
  AccessLimitSelectRequestType,
  AccessLimitSelectResponseType
} from '@/store/types/adapters/accessLimitSelectAdapter';
import * as types from '@/store/types/accessLimitSelectType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new AccessLimitSelectAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_ACCESS_LIMIT_SELECT](context, request: AccessLimitSelectRequestType): Promise<AccessLimitSelectAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.ACCESS_LIMIT_SELECT.url, request)
        .then((response: AccessLimitSelectResponseType) => {
          if (response.status === 200) {
            const adapter = new AccessLimitSelectAdapter(
              response.result || [],
            );

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ACCESS_LIMIT_SELECT,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject();
          }
        })
        .catch((e: any) => {
          console.error('[Access Limit Select error] : ', e);
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
