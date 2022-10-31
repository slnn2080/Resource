/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';

import {
  GetMcTokenAdapter,
  GetMcTokenMode,
  GetMcTokenRequestType,
  GetMcTokenResponseType
} from '@/store/types/adapters/getMcTokenAdapter';
import * as types from '~/store/types/getMcTokenType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new GetMcTokenAdapter();
};

type GetMcTokenState = ReturnType<typeof state>;

const getters: GetterTree<GetMcTokenState, GetMcTokenState> = {
  [types.GETTER_GET_MC_TOKEN](state: GetMcTokenState): GetMcTokenAdapter {
    return { ...state };
  }
};

const mutations: MutationTree<GetMcTokenState> = {
  [types.MUTATION_SET_MODE](state: GetMcTokenState, payload: GetMcTokenAdapter) {
    state.mode = payload.mode;
  },
  [types.MUTATION_GET_MC_TOKEN](state: GetMcTokenState, payload: GetMcTokenAdapter) {
    state.accessToken = payload.accessToken;
    state.windowOpenURL = payload.windowOpenURL;
  }
};

const actions: ActionTree<GetMcTokenState, GetMcTokenState> = {
  [types.ACTION_GET_MC_TOKEN](context, mode: GetMcTokenMode): Promise<GetMcTokenAdapter> {
    console.log('[LOG INFO] get mc token data :', mode);
    context.commit(types.MUTATION_SET_MODE, new GetMcTokenAdapter(mode));
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.GET_MC_TOKEN.url, {
          mode
        })
        .then((response: GetMcTokenResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_GET_MC_TOKEN, {
              accessToken: response.result.access_token,
              windowOpenURL: response.result.window_open_url
            });
            resolve(context.getters[types.GETTER_GET_MC_TOKEN]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.GET_MC_TOKEN,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Get Mc Token error] : ', e);
          // TODO : エラー処理
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
