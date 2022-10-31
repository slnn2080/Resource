/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';
import { MonitorActivateAdapter, MonitorActivateRequestType, MonitorActivateResponseType } from '@/store/types/adapters/monitorActivateAdapter';
import * as monitorActivateTypes from '@/store/types/monitorActivateType';
import * as errorTypes from '@/store/types/errorType';

const state = () => {
  return new MonitorActivateAdapter();
};

type StoreType = ReturnType<typeof state>;

const getters: GetterTree<StoreType, StoreType> = {
};

const mutations: MutationTree<StoreType> = {
};

const actions: ActionTree<StoreType, StoreType> = {
  [monitorActivateTypes.ACTION_MONITOR_ACTIVATE_POST_REQEUST](context, request: MonitorActivateRequestType): Promise<MonitorActivateAdapter> {
    console.log('[LOG INFO] StoreType data post');
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.MONITOR_ACTIVATE.url, request)
        .then((response: MonitorActivateResponseType) => {
          if (response.status === 200) {
            const adapter = MonitorActivateAdapter.fromResponse(response)
            resolve(adapter)
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.MONITOR_ACTIVATE,
              message: response.message,
              status: response.status
            };
            console.error('[LOG ERROR]: ', err);
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
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
