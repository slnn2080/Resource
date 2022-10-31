/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { TesterMarkingsRequestType, TesterMarkingsAdapter } from '@/store/types/adapters/testerMarkingsAdapter';
import { TesterHeadShotAdapter, TesterHeadShotPostRequestType } from '@/store/types/adapters/testerHeadShotAdapter';
import {
  KickOutMethod,
  TesterKickOutRequestType,
} from '@/store/types/adapters/testerKickOutAdapter';
import {
  MonitorPageAdapter,
} from '@/store/types/adapters/monitorPageAdapter';
import * as monitorPageTypes from '@/store/types/monitorPageType';
import * as testerMarkingTypes from '@/store/types/testerMarkingsType';
import * as testerKickOutTypes from '@/store/types/testerKickOutType';
import * as testerRejectedTypes from '@/store/types/testerRejectedType';
import * as marksTypes from '@/store/types/marksType';
import * as notifyListType from '@/store/types/fixedNotificationsType';
import * as testerTypes from '@/store/types/testerType';
import { TesterAdapter, TesterStatusRequestType } from '@/store/types/adapters/testerAdapter';
import {
  MatchingHistoriesAdapter,
  MatchingHistoriesRequestType,
  MatchingHistoriesResponseType,
} from '@/store/types/adapters/matchingHistoriesAdapter';
import * as matchingHistoriesTypes from '@/store/types/matchingHistoriesType';

const state = () => {
  return new MonitorPageAdapter();
};

type monitorPage = ReturnType<typeof state>;

const getters: GetterTree<monitorPage, monitorPage> = {
  [monitorPageTypes.GETTER_MONITOR_PAGE](state: MonitorPageAdapter) {
    return { ...state };
  },
  /**
   * マッチング履歴情報取得
   *
   * @return {MatchingHistoriesAdapter}
   */
  [monitorPageTypes.GETTER_MATCHING_HISTORIES](state: MonitorPageAdapter): MatchingHistoriesAdapter {
    return state.matchingHistories
  },
};

const mutations: MutationTree<monitorPage> = {
  [monitorPageTypes.MUTATION_MONITOR_PAGE_SET_IN_AUTH](state: monitorPage, payload: boolean) {
    state.inAuth = payload;
  },
  /**
   * マッチング履歴設定
   *
   * @param {monitorPage} state
   * @param {MatchingHistoriesAdapter} payload
   */
  [monitorPageTypes.MUTATION_MONITOR_PAGE_SET_MATCHING_HISTORIES](state: monitorPage, payload: MatchingHistoriesAdapter) {
    state.matchingHistories = payload
  },
};

const actions: ActionTree<monitorPage, monitorPage> = {
  // マーク取得
  [monitorPageTypes.ACTION_MONITOR_PAGE_MARKS](context) {
    return context.dispatch(marksTypes.ACTION_MARKS_GET_REQEUST);
  },
  [monitorPageTypes.ACTION_MONITOR_PAGE_NOTIFY_LIST](context) {
    return context.dispatch(notifyListType.ACTION_FIXEDNOTIFICATIONS_GET_REQEUST);
  },
  // 受験者情報取得処理
  [monitorPageTypes.ACTION_MONITOR_PAGE_GET_TESTER](context, testerId: number) {
    return new Promise((resolve) => {
      context.dispatch(testerTypes.ACTION_TESTER, testerId).then((testerAdapter: TesterAdapter) => {
        let quoteRemovedMemo = testerAdapter.startupParameters.memo.replace(/"$/, "").replace(/^"/, "").replace(/'$/, "").replace(/^'/, "");
        testerAdapter.startupParameters.memo = quoteRemovedMemo;
        resolve(testerAdapter);
      });
    });
  },
  // マーキング処理
  [monitorPageTypes.ACTION_MONITOR_PAGE_RECORD_MARKING](context, request: TesterMarkingsRequestType) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(testerMarkingTypes.ACTION_TESTER_MARKINGS_RECORD_MARKING, request)
        .then((resData: TesterMarkingsAdapter) => {
          resolve(resData);
        })
        .catch((e) => {
          console.error(e);
        });
    });
  },
  [monitorPageTypes.ACTION_MONITOR_PAGE_TESTER_KICK_OUT](context, testerId: number) {
    context.dispatch(testerKickOutTypes.ACTION_TESTER_KICK_OUT, {
      tester_id: testerId,
      method: KickOutMethod.PUT,
    } as TesterKickOutRequestType);
  },
  [monitorPageTypes.ACTION_MONITOR_PAGE_ACCEPT](context, request: TesterStatusRequestType) {
    context.dispatch(testerTypes.ACTION_TESTER_STATUS, request);
  },
  [monitorPageTypes.ACTION_MONITOR_PAGE_SET_IN_AUTH](context, payload: boolean) {
    context.commit(monitorPageTypes.MUTATION_MONITOR_PAGE_SET_IN_AUTH, payload);
  },
  [monitorPageTypes.ACTION_MONITOR_PAGE_REJECT](context, payload: { testerId: number, method: string }) {
    return context.dispatch(testerRejectedTypes.ACTION_TESTER_REJECTED, payload);
  },
  /**
   * マッチング履歴を取得します
   *
   * @param {MatchingHistoriesRequestTyp} payload
   * @return {Promise<MatchingHistoriesAdapter>}
   */
  [monitorPageTypes.ACTION_MONITOR_PAGE_GET_MATCHING_HISTORIES](context, payload: MatchingHistoriesRequestType): Promise<MatchingHistoriesAdapter> {
    return new Promise((resolve, reject) => {
      context.dispatch(matchingHistoriesTypes.ACTION_MATCHING_HISTORIES_GET, payload)
        .then((adapter: MatchingHistoriesAdapter) => {
          context.commit(monitorPageTypes.MUTATION_MONITOR_PAGE_SET_MATCHING_HISTORIES, adapter);
          resolve(adapter)
        })
        .catch((e) => {
          console.error('[MatchingHistories error] : ', e);
          reject(e)
        })
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
