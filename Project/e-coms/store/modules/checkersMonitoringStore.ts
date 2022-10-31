/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  CheckersMonitoringAdapter,
  CheckersMonitoringResponseType,
  Matching,
  Tester,
} from '@/store/types/adapters/checkersMonitoringAdapter';
import * as types from '@/store/types/checkersMonitoringType';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';

const state = () => {
  return new CheckersMonitoringAdapter();
}

type CheckersMonitoringState = ReturnType<typeof state>;

const getters: GetterTree<CheckersMonitoringState, CheckersMonitoringState> = {
};

const mutations: MutationTree<CheckersMonitoringState> = {
};

const actions: ActionTree<CheckersMonitoringState, CheckersMonitoringState> = {
  [types.ACTION_CHECKERS_MONITORING](context): Promise<{ matchings: Matching[], notMatchings: Tester[], kickedUsers: Tester[], }> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.CHECKERS_MONITORING.url)
        .then((response: CheckersMonitoringResponseType) => {
          if (response.status === 200) {
            const matchings: Matching[] = response.result.matchings.map(matching => Matching.fromResponse(matching));
            const notMatchings = response.result.not_matchings?.map(tester => Tester.fromResponse(tester));
            const kickedUsers = response.result.kicked_users?.map(tester => Tester.fromResponse(tester));
            resolve({ matchings, notMatchings, kickedUsers });
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.CHECKERS_MONITORING,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject();
          }
        })
        .catch((e: any) => {
          console.error('[Checkers Monitoring error] : ', e);
          // TODO : will be implement error log api request.
          reject();
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
