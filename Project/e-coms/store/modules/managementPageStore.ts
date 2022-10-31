import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  ManagementPageAdapter,
} from '@/store/types/adapters/managementPageAdapter';
import * as managementPageTypes from '@/store/types/managementPageType';
import {
  ManagementInitialParamAdapter,
  ManagementInitialParamRequestType,
  ManagementInitialParamResponseType,
} from '@/store/types/adapters/managementInitialParamAdapter';
import * as managementInitialParamTypes from '@/store/types/managementInitialParamType';
import {
  ManagementSummaryAdapter,
  ManagementSummaryRequestType,
  ManagementSummaryResponseType,
} from '@/store/types/adapters/managementSummaryAdapter';
import * as managementSummaryTypes from '@/store/types/managementSummaryType';

const state = () => {
  return new ManagementPageAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  /**
   * オリジンを取得する 
   *
   * @param {StateType} state
   * @return {string}
   */
  [managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_INITIAL_PARAM_ORIGIN](state: StateType): string {
    return state.managementInitialParamAdapter.origin
  },
  /**
   * ドメインを取得する 
   *
   * @param {StateType} state
   * @return {string}
   */
  [managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_INITIAL_PARAM_DOMAIN](state: StateType): string {
    return state.managementInitialParamAdapter.domain
  },
  /**
   * サマリーの値を取得する logins.testerCount
   *
   * @param {StateType} state
   * @return {number}
   */
  [managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_LOGINS_TESTER_COUNT](state: StateType): number {
    return state.managementSummaryAdapter.logins.testerCount
  },
  /**
   * サマリーの値を取得する logins.otherCount
   *
   * @param {StateType} state
   * @return {number}
   */
  [managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_LOGINS_OTHER_COUNT](state: StateType): number {
    return state.managementSummaryAdapter.logins.otherCount
  },
  /**
   * サマリーの値を取得する deletePlan.testerCount
   *
   * @param {StateType} state
   * @return {number}
   */
  [managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_DELETE_PLAN_TESTER_COUNT](state: StateType): number {
    return state.managementSummaryAdapter.deletePlan.testerCount
  },
  /**
   * サマリーの値を取得する logins.recordCount
   *
   * @param {StateType} state
   * @return {number}
   */
  [managementPageTypes.GETTER_MANAGEMENT_PAGE_GET_SUMMARY_DELETE_PLAN_RECORD_COUNT](state: StateType): number {
    return state.managementSummaryAdapter.deletePlan.recordCount
  },
}

const mutations: MutationTree<StateType> = {
  /**
   * 初期値を設定する
   *
   * @param {StateType} state
   * @param {ManagementInitialParamAdapter} payload
   */
  [managementPageTypes.MUTATION_MANAGEMENT_PAGE_SET_INITIAL_PARAM](state: StateType, payload: ManagementInitialParamAdapter) {
    state.isInitialized = true
    state.managementInitialParamAdapter = payload
  },
  /**
   * サマリーの値を設定する
   *
   * @param {StateType} state
   * @param {ManagementSummaryAdapter} payload
   */
  [managementPageTypes.MUTATION_MANAGEMENT_PAGE_SET_SUMMARY](state: StateType, payload: ManagementSummaryAdapter) {
    state.managementSummaryAdapter = payload
  },
}

const actions: ActionTree<StateType, StateType> = {
  /**
   * 初期パラメータ取得
   */
  [managementPageTypes.ACTION_MANAGEMENT_PAGE_GET_INITIAL_PARAM](context): Promise<ManagementInitialParamAdapter> {
    if (context.state.isInitialized) {
      return Promise.resolve(context.state.managementInitialParamAdapter)
    }

    return new Promise((resolve, reject) => {
      context
        .dispatch(managementInitialParamTypes.ACTION_MANAGEMENT_INITIAL_PARAM, {} as ManagementInitialParamRequestType)
        .then((adapter: ManagementInitialParamAdapter) => {
          context.commit(managementPageTypes.MUTATION_MANAGEMENT_PAGE_SET_INITIAL_PARAM, adapter);
          resolve(adapter)
        })
        .catch((e) => {
          reject(e)
        });
    });
  },
  /**
   * サマリー取得
   */
  [managementPageTypes.ACTION_MANAGEMENT_PAGE_GET_SUMMARY](context): Promise<ManagementSummaryAdapter>{
    return new Promise((resolve, reject) => {
      context
        .dispatch(managementSummaryTypes.ACTION_MANAGEMENT_SUMMARY, {} as ManagementSummaryRequestType)
        .then((adapter: ManagementSummaryAdapter) => {
          context.commit(managementPageTypes.MUTATION_MANAGEMENT_PAGE_SET_SUMMARY, adapter);
          resolve(adapter)
        })
        .catch((e) => {
          reject(e)
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
