/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {ActionContext} from "aws-sdk/clients/codepipeline";
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import * as errorTypes from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';
import {
  MatchingHistoriesAdapter,
  MatchingHistoriesRequestType,
  MatchingHistoriesResponseType,
} from '@/store/types/adapters/matchingHistoriesAdapter';
import * as matchingHistoriesTypes from '@/store/types/matchingHistoriesType';

const state = () => {
  return new MatchingHistoriesAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  /**
   * マッチング履歴を取得します
   *
   * @param {Context} context
   * @param {MatchingHistoriesRequestType} payload
   * @return {Promise<MatchingHistoriesAdapter>}
   */
  [matchingHistoriesTypes.ACTION_MATCHING_HISTORIES_GET](context, payload: MatchingHistoriesRequestType): Promise<MatchingHistoriesAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios.$get(Endpoint.MATCHING_HISTORIES.url, {params: payload})
        .then((response: MatchingHistoriesResponseType) => {
          if (response.status === 200) {
            const adapter = MatchingHistoriesAdapter.fromResponse(response)
            resolve(adapter)
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.MATCHING_HISTORIES,
              status: response.status,
              message: response.message,
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch(err => {
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
