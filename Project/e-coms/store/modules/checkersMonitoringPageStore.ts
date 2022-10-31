/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { CheckersMonitoringPageAdapter } from '@/store/types/adapters/checkersMonitoringPageAdapter';
import * as types from '@/store/types/checkersMonitoringPageType';
import * as checkersMonitoringTypes from '@/store/types/checkersMonitoringType';
import {
  KickOutMethod,
  TesterKickOutRequestType,
} from '@/store/types/adapters/testerKickOutAdapter';
import * as testerKickOutTypes from '@/store/types/testerKickOutType';
import * as testerRejectedTypes from '@/store/types/testerRejectedType';
import { Matching, Tester } from '@/store/types/adapters/checkersMonitoringAdapter';

const state = () => {
  return new CheckersMonitoringPageAdapter();
}

type checkersMonitoringPage = ReturnType<typeof state>;

const getters: GetterTree<checkersMonitoringPage, checkersMonitoringPage> = {
  [types.GETTER_CHECKERS_MONITORING_PAGE](state: checkersMonitoringPage): CheckersMonitoringPageAdapter {
    return { ...state };
  },
};

const mutations: MutationTree<checkersMonitoringPage> = {
  [types.MUTATION_CHECKERS_MONITORING_PAGE_SET](state: checkersMonitoringPage, payload: CheckersMonitoringPageAdapter) {
    state.matchings = payload.matchings;
    state.notMatchings = payload.notMatchings;
    state.kickedUsers = payload.kickedUsers;
  },
  [types.MUTATION_CHECKERS_MONITORING_PAGE_SET_NOT_MATCHINGS](state: checkersMonitoringPage, payload: Matching[]) {
    state.matchings = payload;
  },
  [types.MUTATION_CHECKERS_MONITORING_PAGE_SET_NOT_MATCHINGS](state: checkersMonitoringPage, payload: Tester[]) {
    state.notMatchings = payload;
  },
  [types.MUTATION_CHECKERS_MONITORING_PAGE_SET_KICKED_USERS](state: checkersMonitoringPage, payload: Tester[]) {
    state.kickedUsers = payload;
  },
};

const actions: ActionTree<checkersMonitoringPage, checkersMonitoringPage> = {
  [types.ACTION_CHECKERS_MONITORING_PAGE_GET_MONITORINGS](context): Promise<void> {
    return new Promise((resolve, reject) => {
      context
        .dispatch(checkersMonitoringTypes.ACTION_CHECKERS_MONITORING)
        .then((result: { matchings: Matching[], notMatchings: Tester[], kickedUsers: Tester[], }) => {
          context.commit(types.MUTATION_CHECKERS_MONITORING_PAGE_SET, result);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  [types.ACTION_CHECKERS_MONITORING_PAGE_KICK_OUT](context, payload: number) {
    return context.dispatch(testerKickOutTypes.ACTION_TESTER_KICK_OUT, {
      tester_id: payload,
      method: KickOutMethod.PUT,
    } as TesterKickOutRequestType);
  },
  /**
   * 強制退出を解除します。
   *
   * このアクションは内部からしか呼び出されません。
   *
   * @param {any} context
   * @param {number} payload 受験者ID
   * @return {Promise}
   */
  [types.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT](context, payload: number) {
    return context.dispatch(testerKickOutTypes.ACTION_TESTER_KICK_OUT, {
      tester_id: payload,
      method: KickOutMethod.DELETE,
    } as TesterKickOutRequestType);
  },
  /**
   * ログイン状態(未割り当て受験者/not_matchings)の受験者を強制退出を解除し、対象ユーザのステータスを変更します。
   *
   * @param {any} context
   * @param {number} payload 受験者ID
   * @return {Promise}
   */
  [types.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT_AND_CHANGE_STATUS](context, payload: number) {
    return context.dispatch(types.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT, payload)
      .then(() => {
        // TODO:この画面では、ポーリングしているためこの処理は不要なのだが、
        const pages = context.getters[types.GETTER_CHECKERS_MONITORING_PAGE];
        const newNotMatchings:Tester[] = pages.notMatchings.slice(0);
        const foundIndex = newNotMatchings.findIndex((v:Tester) => v.id == payload);
        if (foundIndex === -1) {
          return;
        }
        newNotMatchings[foundIndex].kicked = false;
        context.commit(types.MUTATION_CHECKERS_MONITORING_PAGE_SET_NOT_MATCHINGS, newNotMatchings);
      })
  },
  /**
   * 未ログイン状態(強制退出済み受験者/kicked_users)の受験者を強制退出を解除し、対象ユーザをkicked_usersから削除します。
   *
   * @param {any} context
   * @param {number} payload 受験者ID
   * @return {Promise}
   */
  [types.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT_AND_FILTER_KICKED_USERS](context, payload: number) {
    return context.dispatch(types.ACTION_CHECKERS_MONITORING_PAGE_DELETE_KICK_OUT, payload)
      .then(() => {
        // TODO:この画面では、ポーリングしているためこの処理は不要なのだが、
        const pages = context.getters[types.GETTER_CHECKERS_MONITORING_PAGE];
        const kickedUsers:Tester[] = pages.kickedUsers;
        const newKickedUsers = kickedUsers.filter((v:Tester) => v.id == payload);
        context.commit(types.MUTATION_CHECKERS_MONITORING_PAGE_SET_KICKED_USERS, newKickedUsers);
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
};
