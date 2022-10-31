import { GetterTree, ActionTree, MutationTree } from 'vuex';
import * as managementInitialParamTypes from '@/store/types/managementInitialParamType';
import {
  ManagementInitialParamAdapter,
  ManagementInitialParamRequestType,
  ManagementInitialParamResponseType
} from '@/store/types/adapters/managementInitialParamAdapter.ts';
import { Endpoint } from '@/store/const/endpoint.ts';
import * as errorTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return {}
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
}

const mutations: MutationTree<StateType> = {
}

const actions: ActionTree<StateType, StateType> = {
  [managementInitialParamTypes.ACTION_MANAGEMENT_INITIAL_PARAM](context, payload: ManagementInitialParamRequestType): Promise<ManagementInitialParamAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.MANAGEMENT_INITIAL_PARAM.url, payload)
        .then((response: ManagementInitialParamResponseType) => {
          if (response.status === 200) {
            const r = ManagementInitialParamAdapter.fromResponse(response);
            resolve(r);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.MANAGEMENT_INITIAL_PARAM,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error(`[API ${Endpoint.MANAGEMENT_INITIAL_PARAM.url} error] : `, e);
          reject(e);
        });
    });
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
};
