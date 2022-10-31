/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { AiAuthStatusAdapter, AiAuthStatusResponseType } from '~/store/types/adapters/aiAuthStatusAdapter';
import { ErrorStatus } from '../types/adapters/errorAdapter';
import * as testerPageTypes from '~/store/types/testerPageType';
import * as aiAuthStatusTypes from '~/store/types/aiAuthStatusType';
import * as errorTypes from '~/store/types/errorType';
import { Endpoint } from '~/store/const/endpoint';

const state = () => {
  return new AiAuthStatusAdapter();
};

type AiAuthStatusState = ReturnType<typeof state>;

const getters: GetterTree<AiAuthStatusState, AiAuthStatusState> = {
  [aiAuthStatusTypes.GETTER_AI_AUTH_STATUS](state: AiAuthStatusState) {
    return { ...state };
  }
};

const mutations: MutationTree<AiAuthStatusState> = {
  [aiAuthStatusTypes.MUTATION_AI_AUTH_STATUS](state: AiAuthStatusState, payload: AiAuthStatusAdapter) {
    state.status = payload.status;
    state.process = payload.process;
    state.faceRetry = payload.faceRetry;
    state.idCardRetry = payload.idCardRetry;
    state.idCardUrl = payload.idCardUrl;
    state.faceUrl = payload.faceUrl;
    state.aiAllRetry = payload.aiAllRetry;
    state.messages = payload.messages;
  }
};

const actions: ActionTree<AiAuthStatusState, AiAuthStatusState> = {
  [aiAuthStatusTypes.ACTION_REQUEST_GET_AI_AUTH_STATUS](context, testerId? : number): Promise<AiAuthStatusResponseType | ErrorStatus> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.AI_AUTH_STATUS.url, {tester_id: testerId})
        // .$get(Endpoint.AI_AUTH_STATUS.url)
        .then((response: AiAuthStatusResponseType) => {
          const result = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
          if (response.status === 200) {
            context.commit(aiAuthStatusTypes.MUTATION_AI_AUTH_STATUS, {
              status: result.status,
              faceRetry: result.face_retry,
              idCardRetry: result.id_card_retry,
              aiAllRetry: result.ai_all_retry,
              messages: result.messages,
              faceUrl: result.face_url,
              idCardUrl: result.id_card_url
            });
            resolve(context.getters[aiAuthStatusTypes.GETTER_AI_AUTH_STATUS]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ID_CARD,
              status: response.status,
              message: response.message,
              result: result
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            resolve(err);
          }
          if (response.status === 401) {
            context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_LOGOUT);
          }
        })
        .catch((e: any) => {
          console.error('[aiAuthStatus http request error] : ', e);
          reject(e);
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
