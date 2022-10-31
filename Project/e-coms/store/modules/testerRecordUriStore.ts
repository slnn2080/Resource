/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {ActionContext} from "aws-sdk/clients/codepipeline";
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import * as errorTypes from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';
import {
  TesterRecordUriAdapter,
  TesterRecordUriRequestType,
  TesterRecordUriResponseType,
} from '@/store/types/adapters/testerRecordUriAdapter';
import * as testerRecordUriTypes from '@/store/types/testerRecordUriType';

const state = () => {
  return new TesterRecordUriAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  /**
   * 動画URIを取得します
   *
   * @param {Context} context
   * @param {TesterRecordUriRequestType} payload
   * @return {Promise<TesterRecordUriAdapter>}
   */
  [testerRecordUriTypes.ACTION_TESTER_RECORD_URI](context, payload: TesterRecordUriRequestType): Promise<TesterRecordUriAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios.$get(Endpoint.TESTER_RECORD_URI.url, { params: payload })
        .then((response: TesterRecordUriResponseType) => {
          if (response.status === 200) {
            const adapter = TesterRecordUriAdapter.fromResponse(response)
            resolve(adapter)
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_RECORD_URI,
              status: response.status,
              message: response.message,
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((err: any) => {
          console.error(err);
          reject(err);
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
