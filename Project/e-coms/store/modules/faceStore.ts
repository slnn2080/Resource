/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { FaceAdapter, FaceResponseType, FaceRequestType } from '~/store/types/adapters/faceAdapter';
import { ErrorStatus } from '../types/adapters/errorAdapter';
import * as faceTypes from '~/store/types/faceType';
import * as testerPageTypes from '~/store/types/testerPageType';
import * as errorTypes from '~/store/types/errorType';
import { Endpoint } from '~/store/const/endpoint';

const state = () => {
  return new FaceAdapter();
};

type FaceState = ReturnType<typeof state>;

const getters: GetterTree<FaceState, FaceState> = {
  [faceTypes.GETTER_FACE](state: FaceState) {
    return { ...state };
  }
};

const mutations: MutationTree<FaceState> = {
  [faceTypes.MUTATION_FACE](state: FaceState, payload: FaceAdapter) {
    state.status = payload.status;
    state.process = payload.process;
    state.faceRetry = payload.faceRetry;
    state.idCardRetry = payload.idCardRetry;
    state.faceUrl = payload.faceUrl;
    state.idCardUrl = payload.idCardUrl;
    state.messages = payload.messages;
    state.updatedAt = (new Date()).getTime();
  }
};

const actions: ActionTree<FaceState, FaceState> = {
  [faceTypes.ACTION_REQUEST_POST_FACE](
    context,
    { image, content_type }: FaceRequestType
  ): Promise<FaceResponseType | ErrorStatus> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.FACE.url, {
          image,
          content_type
        })
        .then((response: FaceResponseType) => {
          // TODO : 2020/10/14 - レスポンスが正しく修正されてないので、処置
          const result = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
          if (response.status === 200) {
            context.commit(faceTypes.MUTATION_FACE, {
              status: result.status,
              faceRetry: result.face_retry,
              idCardRetry: result.id_card_retry,
              faceUrl: result.face_url,
              idCarUrl: result.id_card_url,
              messages: result.messages
            });
            // context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_COUNT_RETRY_NUM, result.face_retry);
            context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_COUNT_RETRY_NUM, result.ai_all_retry);
            resolve(context.getters[faceTypes.GETTER_FACE]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.FACE,
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
          console.error('[face http request error] : ', e);
          reject(e);
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
