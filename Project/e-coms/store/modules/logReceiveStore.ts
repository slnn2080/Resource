import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  LogReceiveAdapter,
  LogReceiveRequestType,
  LogReceiveResponseType
} from '@/store/types/adapters/logReceiveAdapter';
import * as types from '@/store/types/logReceiveType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new LogReceiveAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_POST_LOG_RECEIVE](context, request: LogReceiveRequestType): Promise<LogReceiveAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        // TODO: $post()ではなくpost()を使うのは、このAPIの戻り値が規約違反だから
        .post(Endpoint.LOG_RECEIVE.url, request)
        .then((rawResponse: any) => {
          if (rawResponse.data) {
            const response = rawResponse.data;
            if (response.status == 200) {
              const r = new LogReceiveAdapter();
              resolve(r);
            } else {
              const err: ErrorStatus = {
                endpoint: Endpoint.LOG_RECEIVE,
                status: response.status,
                message: response.message,
              };
              context.dispatch(errTypes.ACTION_SET_ERROR, err);
              reject(err);
            }
          } else {
            if (rawResponse.status == 200) {
              const r = new LogReceiveAdapter();
              resolve(r);
            } else {
              const err: ErrorStatus = {
                endpoint: Endpoint.LOG_RECEIVE,
                status: rawResponse.status,
                message: rawResponse.statusText || '',
              };
              context.dispatch(errTypes.ACTION_SET_ERROR, err);
              reject(err);
            }
          }
        })
        .catch((e: any) => {
          // エラー時の処理
          reject(e);
        })
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
