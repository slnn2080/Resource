import { GetterTree, ActionTree, MutationTree } from 'vuex';
import * as types from '@/store/types/analysisRequestRequestApiType';
import {
  AnalysisRequestRequestApiAdapter,
  AnalysisRequestRequestApiRequestType,
  AnalysisRequestRequestApiResponseType
} from '@/store/types/adapters/analysisRequestRequestApiAdapter.ts';
import { Endpoint } from '@/store/const/endpoint.ts';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new AnalysisRequestRequestApiAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};
const mutations: MutationTree<StateType> = {
}
const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_ANALYSIS_REQUEST_REQUEST_API](context, payload: AnalysisRequestRequestApiRequestType): Promise<AnalysisRequestRequestApiAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.ANALYSIS_REQUEST_REQUEST.url, payload)
        .then((response: AnalysisRequestRequestApiResponseType) => {
          if (response.status === 200) {
            const result = new AnalysisRequestRequestApiAdapter(response.message);

            resolve(result);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ANALYSIS_REQUEST_REQUEST,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error(`[API ${Endpoint.ANALYSIS_REQUEST_REQUEST.url} error] : `, e);
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
