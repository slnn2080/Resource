/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {ActionContext} from "aws-sdk/clients/codepipeline";
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import * as errorTypes from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';
import {
  KvsReconnectAdapter,
  KvsReconnectRequestType,
  KvsReconnectResponseType,
} from '@/store/types/adapters/kvsReconnectAdapter';
import * as kvsReconnectTypes from '@/store/types/kvsReconnectType';

const state = () => {
  return new KvsReconnectAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  /**
   * KVSを再接続します
   *
   * @param {Context} context
   * @param {KvsReconnectRequestType} payload
   * @return {Promise<KvsReconnectAdapter>}
   */
  [kvsReconnectTypes.ACTION_KVS_RECONNECT](context, payload: KvsReconnectRequestType): Promise<KvsReconnectAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios.$get(Endpoint.KVS_RECONNECT.url, { params: payload })
        .then((response: KvsReconnectResponseType) => {
          if (response.status === 200) {
            const adapter = KvsReconnectAdapter.fromResponse(response)
            resolve(adapter)
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.KVS_RECONNECT,
              status: response.status,
              message: response.message,
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((err: any) => {
          console.error(err);
          reject(err);
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
