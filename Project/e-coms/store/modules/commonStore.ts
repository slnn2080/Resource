import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { CommonAdapter, LoadingAlertType, LoadingAlertOptions } from '@/store/types/adapters/commonAdapter';
import * as types from '@/store/types/commonType';

const state = () => {
  return new CommonAdapter();
};

type common = ReturnType<typeof state>;

const getters: GetterTree<common, common> = {
  [types.GETTER_COMMON](state: common) {
    return { ...state };
  },
  [types.GETTER_COMMON_IS_LAYOUT_VISIBLE](state: common) {
    return state.isLayoutVisible
  },
  [types.GETTER_COMMON_GET_HEADER_LOGOUT_BUTTON_DISABLED](state: common) {
    return state.headerLogoutButtonDisabled
  },
  [types.GETTER_COMMON_IS_LOADING](state: common): boolean {
    return state.loadingCounter > 0
  },
  [types.GETTER_COMMON_IS_LOADING_ALERT_VISIBLE](state: common): boolean {
    return (
      (state.uploadingAlertCounter > 0)
    )
  },
  [types.GETTER_COMMON_IS_UPLOADING_ALERT_VISIBLE](state: common): boolean {
    return state.uploadingAlertCounter > 0
  },
};

const mutations: MutationTree<common> = {
  [types.MUTATION_COMMON_SET_LAYOUT_VISIBLE](state: common, payload: boolean) {
    state.isLayoutVisible = payload;
  },
  [types.MUTATION_COMMON_SET_HEADER_LOGOUT_BUTTON_DISABLED](state: common, payload: boolean) {
    state.headerLogoutButtonDisabled = payload
  },
  /**
   * ローディングフィルタの表示/非表示を設定します
   *
   * @param {common} state
   * @param {boolean} payload
   */
  [types.MUTATION_COMMON_SET_LOADING](state: common, payload: boolean) {
    state.loadingCounter += (payload ? 1 : -1);
  },
  /**
   * ローディングフィルタのアラートの表示/非表示 等を設定します
   *
   * @param {common} state
   * @param {LoadingAlertOptions} options
   */
  [types.MUTATION_COMMON_SET_LOADING_ALERT](state: common, options: LoadingAlertOptions) {
    switch (options.loadingAlertType) {
      case LoadingAlertType.UPLOADING:
        state.uploadingAlertCounter += (options.visible ? 1 : -1)
        break;
    }
  },
};

const actions: ActionTree<common, common> = {
  [types.ACTION_COMMON_SET_LAYOUT_VISIBLE](context, payload: boolean) {
    context.commit(types.MUTATION_COMMON_SET_LAYOUT_VISIBLE, payload);
  },
  [types.ACTION_COMMON_SET_HEADER_LOGOUT_BUTTON_DISABLED](context, payload: boolean) {
    context.commit(types.MUTATION_COMMON_SET_HEADER_LOGOUT_BUTTON_DISABLED, payload);
  },
  /**
   * ローディングフィルタの表示/非表示を設定します
   *
   * この表示フラグは内部でインクリメントカウンタで実装されています。
   * true/falseの呼び出しが常に対になるように呼び出してください
   *
   * @param {Context} context
   * @param {boolean} payload
   */
  [types.ACTION_COMMON_SET_LOADING](context, payload: boolean) {
    context.commit(types.MUTATION_COMMON_SET_LOADING, payload);
  },
  /**
   * ローディングフィルタのアラートの表示/非表示 等を設定します
   *
   * @param {Context} context
   * @param {LoadingAlertOptions} options
   */
  [types.ACTION_COMMON_SET_LOADING_ALERT](context, options: LoadingAlertOptions) {
    context.commit(types.MUTATION_COMMON_SET_LOADING_ALERT, options);
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
