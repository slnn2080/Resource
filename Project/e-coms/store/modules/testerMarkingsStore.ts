/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ErrorStatus } from '../types/adapters/errorAdapter';
import {
  TesterMarkingsAdapter,
  TesterMarkingsRequestType,
  TesterMarkingsResponseType
} from '@/store/types/adapters/testerMarkingsAdapter';
import * as types from '@/store/types/testerMarkingsType';
import * as errTypes from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';

const state = () => {
  return new TesterMarkingsAdapter();
};

type TesterMarkingsState = ReturnType<typeof state>;

const getters: GetterTree<TesterMarkingsState, TesterMarkingsState> = {
  [types.GETTER_TESTER_MARKINGS_RECORD_MARKING](state: TesterMarkingsState) {
    return { ...state };
  }
};

const mutations: MutationTree<TesterMarkingsState> = {
  [types.MUTATION_TESTER_MARKINGS_RECORD_MARKING](state: TesterMarkingsState, payload: TesterMarkingsAdapter) {
    state.testerId = payload.testerId;
    state.mark = payload.mark;
    state.image = payload.image;
    state.contentType = payload.contentType;
    state.timeLag = payload.timeLag;
    state.alert = payload.alert;
    state.url = payload.url;
  }
};

const actions: ActionTree<TesterMarkingsState, TesterMarkingsState> = {
  [types.ACTION_TESTER_MARKINGS_RECORD_MARKING](
    context,
    { testerId, mark, image, contentType, timeLag, notification }: TesterMarkingsRequestType
  ) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_MARKINGS.url, {
          tester_id: testerId,
          mark,
          image,
          content_type: contentType,
          time_lag: timeLag,
          notification,
        })
        .then((response: TesterMarkingsResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TESTER_MARKINGS_RECORD_MARKING, {
              testerId,
              mark,
              image,
              contentType,
              timeLag,
              alert: response.result.alert,
              url: response.result.url
            });
            resolve(context.getters[types.GETTER_TESTER_MARKINGS_RECORD_MARKING]);

          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_MARKINGS,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
          }
        })
        .catch(() => {
          // TODO : 失敗時の処理を書くこと
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
