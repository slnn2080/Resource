import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  LoginsAdapter,
  LoginsRequestType,
  LoginsResponseType
} from '@/store/types/adapters/loginsAdapter';
import * as loginsTypes from '@/store/types/loginsType';
import { Endpoint } from '@/store/const/endpoint';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new LoginsAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  [loginsTypes.ACTION_LOGINS_CALL_API](context, request: LoginsRequestType): Promise<LoginsAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.LOGINS.url, {
          params: request
        })
        .then((response: LoginsResponseType) => {
          if (response.status === 200) {
            const adapter = LoginsAdapter.fromResponse(response.result)

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.LOGINS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Logins error] : ', e);
          // エラー時の処理
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
