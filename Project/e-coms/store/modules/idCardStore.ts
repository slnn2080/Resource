/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { IdCardAdapter, IdCardResponseType, IdCardRequestType } from '~/store/types/adapters/idCardAdapter';
import { ErrorStatus } from '../types/adapters/errorAdapter';
import * as idCardType from '~/store/types/idCardType';
import * as testerPageType from '~/store/types/testerPageType';
import * as errorType from '~/store/types/errorType';
import { Endpoint } from '~/store/const/endpoint';

const state = () => {
  return new IdCardAdapter();
};

type IdCardState = ReturnType<typeof state>;

const getters: GetterTree<IdCardState, IdCardState> = {
  [idCardType.GETTER_ID_CARD](state: IdCardState) {
    return { ...state };
  }
};

const mutations: MutationTree<IdCardState> = {
  [idCardType.MUTATION_ID_CARD](state: IdCardState, payload: IdCardAdapter) {
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

const actions: ActionTree<IdCardState, IdCardState> = {
  [idCardType.ACTION_REQUEST_POST_ID_CARD](
    context,
    { image, content_type }: IdCardRequestType
  ): Promise<IdCardResponseType | ErrorStatus> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.ID_CARD.url, {
          image,
          content_type
        })
        .then((response: IdCardResponseType) => {
          // TODO : 2020/10/14 - レスポンスが正しく修正されてないので、処置
          const result = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
          if (response.status === 200) {
            context.commit(idCardType.MUTATION_ID_CARD, {
              status: result.status,
              faceRetry: result.face_retry,
              idCardRetry: result.id_card_retry,
              faceUrl: result.face_url,
              idCardUrl: result.id_card_url,
              messages: result.messages
            });
            // context.dispatch(testerPageType.ACTION_TESTER_PAGE_COUNT_RETRY_NUM, result.id_card_retry);
            context.dispatch(testerPageType.ACTION_TESTER_PAGE_COUNT_RETRY_NUM, result.ai_all_retry);
            resolve(context.getters[idCardType.GETTER_ID_CARD]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.ID_CARD,
              status: response.status,
              message: response.message,
              result: result
            };
            context.dispatch(errorType.ACTION_SET_ERROR, err);
            resolve(err);
          }
        })
        .catch((e: any) => {
          console.error('[idCard http request error] : ', e);
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
