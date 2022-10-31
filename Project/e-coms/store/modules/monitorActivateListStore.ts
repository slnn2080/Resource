/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';
import { MonitorActivateListAdapter, MonitorActivateListResponseType } from '@/store/types/adapters/monitorActivateListAdapter';
import * as monitorActivateListTypes from '@/store/types/monitorActivateListType';
import * as errorTypes from '@/store/types/errorType';

const state = () => {
  return new MonitorActivateListAdapter();
};

type StoreType = ReturnType<typeof state>;

const getters: GetterTree<StoreType, StoreType> = {
};

const mutations: MutationTree<StoreType> = {
};

const actions: ActionTree<StoreType, StoreType> = {
  [monitorActivateListTypes.ACTION_MONITOR_ACTIVATE_LIST_GET_REQEUST](context): Promise<MonitorActivateListAdapter> {
    console.log('[LOG INFO] StoreType data post');
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.MONITOR_ACTIVATE_LIST.url)
        .then((response: MonitorActivateListResponseType) => {
          if (response.status === 200) {
            const adapter = MonitorActivateListAdapter.fromResponse(response)
            resolve(adapter)
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.MONITOR_ACTIVATE_LIST,
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
