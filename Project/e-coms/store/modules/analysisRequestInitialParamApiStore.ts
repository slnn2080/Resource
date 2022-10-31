import { GetterTree, ActionTree, MutationTree } from 'vuex';
import * as types from '@/store/types/analysisRequestInitailParamApiType';
import {
  AnalysisRequestInitialParamApiAdapter,
  AnalysisRequestInitialParamApiRequestType,
  AnalysisRequestInitialParamApiResponseType
} from '@/store/types/adapters/analysisRequestInitialParamApiAdapter.ts';
import { Endpoint } from '@/store/const/endpoint.ts';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new AnalysisRequestInitialParamApiAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};
const mutations: MutationTree<StateType> = {
}
const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_ANALYSIS_REQUEST_INITIAL_PARAM_API](context, payload: AnalysisRequestInitialParamApiRequestType): Promise<AnalysisRequestInitialParamApiAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.ANALYSIS_REQUEST_INITIAL_PARAM.url, payload)
        .then((response: AnalysisRequestInitialParamApiResponseType) => {
          if (response.status === 200) {
            const r = AnalysisRequestInitialParamApiAdapter.fromResponse(response);
            resolve(r);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ANALYSIS_REQUEST_INITIAL_PARAM,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error(`[API ${Endpoint.ANALYSIS_REQUEST_INITIAL_PARAM.url} error] : `, e);
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
