import { GetterTree, ActionTree, MutationTree } from 'vuex';
import * as types from '@/store/types/analysisRequestIndexApiType';
import {
  AnalysisRequestIndexApiAdapter,
  AnalysisRequest,
  AnalysisRequestIndexApiSettingType,
  AnalysisRequestIndexApiRequestType,
  AnalysisRequestIndexApiSettingAndRequestType,
  AnalysisRequestIndexApiResponseType,
} from '@/store/types/adapters/analysisRequestIndexApiAdapter.ts';
import { Endpoint } from '@/store/const/endpoint.ts';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return new AnalysisRequestIndexApiAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};
const mutations: MutationTree<StateType> = {
}
const actions: ActionTree<StateType, StateType> = {
  [types.ACTION_ANALYSIS_REQUEST_INDEX_API](context, payload: AnalysisRequestIndexApiSettingAndRequestType): Promise<AnalysisRequestIndexApiAdapter> {
    const setting = payload.setting;
    const request = payload.request;

    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.ANALYSIS_REQUEST_INDEX.url, {
          baseURL: setting.domain,
          params: request,
        })
        .then((response: AnalysisRequestIndexApiResponseType) => {
          if (response.status === 200) {
            const analysisRequests = AnalysisRequestIndexApiAdapter.fromResponse(response);
            resolve(analysisRequests);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ANALYSIS_REQUEST_INDEX,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error(`[API ${Endpoint.ANALYSIS_REQUEST_INDEX.url} error] : `, e);
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
