import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  LoginsPageAdapter,
  LoginsFormValues,
  LoginsTableValues,
} from '@/store/types/adapters/loginsPageAdapter';
import * as loginsPageTypes from '@/store/types/loginsPageType';
import {
  LoginsAdapter,
  LoginsRequestType,
  LoginsResponseType,
  ActorKind,
  LoginsItem,
} from '@/store/types/adapters/loginsAdapter';
import * as loginsTypes from '@/store/types/loginsType';

const state = () => {
  return new LoginsPageAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  /**
   * フォームの値を取得する
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_FORM_VALUES](state: StateType): LoginsFormValues {
    return state.formValues;
  },
  /**
   * フォームの値を取得する actorKind
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_FORM_VALUES_ACTOR_KIND](state: StateType): ActorKind {
    return state.formValues.actorKind
  },
  /**
   * フォームの値を取得する sortKey & sortOrder
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_FORM_VALUES_SORT](state: StateType): {sortKey: number | null; sortOrder: number | null} {
    return {
      sortKey: state.formValues.sortKey,
      sortOrder: state.formValues.sortOrder,
    }
  },
  /**
   * フォームの値を取得する page
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_FORM_VALUES_PAGE](state: StateType): number | null {
    return state.formValues.page;
  },
  /**
   * テーブルの値を取得する
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES](state: StateType): LoginsTableValues {
    return state.tableValues;
  },
  /**
   * テーブルの値を取得する page
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_PAGE](state: StateType): number {
    return state.tableValues.loginsAdapter.page
  },
  /**
   * テーブルの値を取得する pageCount
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_PAGE_COUNT](state: StateType): number {
    return state.tableValues.loginsAdapter.pageCount
  },
  /**
   * テーブルの値を取得する count
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_COUNT](state: StateType): number {
    return state.tableValues.loginsAdapter.count
  },
  /**
   * テーブルの値を取得する list
   */
  [loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES_LIST](state: StateType): LoginsItem[] {
    return state.tableValues.loginsAdapter.list
  },
}

const mutations: MutationTree<StateType> = {
  /**
   * フォームの値をクリアする
   */
  [loginsPageTypes.MUTATION_LOGINS_PAGE_CLEAR_FORM_VALUES](state: StateType) {
    state.formValues.clear();
  },
  /**
   * フォームの値を設定する
   */
  [loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES](state: StateType, payload: LoginsFormValues) {
    state.formValues = payload;
  },
  /**
   * フォームの値を設定する actorKind
   */
  [loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES_ACTOR_KIND](state: StateType, payload: ActorKind) {
    state.formValues.actorKind = payload;
  },
  /**
   * フォームの値を設定する sortKey & sortOrder
   */
  [loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES_SORT](state: StateType, payload: {sortKey: number | null; sortOrder: number | null}) {
    state.formValues.sortKey = payload.sortKey
    state.formValues.sortOrder = payload.sortOrder
  },
  /**
   * フォームの値を設定する page
   */
  [loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES_PAGE](state: StateType, payload: number) {
    state.formValues.page = payload;
  },
  /**
   * テーブルの値をクリアする
   */
  [loginsPageTypes.MUTATION_LOGINS_PAGE_CLEAR_TABLE_VALUES](state: StateType) {
    state.tableValues.clear();
  },
  /**
   * テーブルの値を設定する
   */
  [loginsPageTypes.MUTATION_LOGINS_PAGE_SET_TABLE_VALUES](state: StateType, payload: LoginsTableValues) {
    state.tableValues = payload;
  },
}

const actions: ActionTree<StateType, StateType> = {
  /**
   * フォームの値をクリアする
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_CLEAR_FORM_VALUES](context): void {
    context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_CLEAR_FORM_VALUES);
  },
  /**
   * フォームの値を設定する
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES](context, payload: LoginsFormValues): void {
    context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES, payload);
  },
  /**
   * フォームの値を設定する actorKiind
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_ACTOR_KIND](context, payload: ActorKind): void {
    context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES_ACTOR_KIND, payload);
  },
  /**
   * フォームの値を設定する sortKey & sortOrder
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_SORT](context, payload: {sortKey: number | null; sortOrder: number | null}): void {
    context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES_SORT, payload);
  },
  /**
   * フォームの値を設定する page
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_SET_FORM_VALUES_PAGE](context, payload: number): void {
    context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_SET_FORM_VALUES_PAGE, payload);
  },
  /**
   * テーブルの値をクリアする
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_CLEAR_TABLE_VALUES](context): void {
    context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_CLEAR_TABLE_VALUES);
  },
  /**
   * テーブルの値を設定する
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_SET_TABLE_VALUES](context, payload: LoginsTableValues): void {
    context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_SET_TABLE_VALUES, payload);
  },
  /**
   * API呼び出し
   */
  [loginsPageTypes.ACTION_LOGINS_PAGE_CALL_API_GET_LOGINS](context): Promise<LoginsAdapter>{
    return new Promise((resolve, reject) => {
      const formValues = context.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_FORM_VALUES]
      const request = formValues.getLoginsRequest()

      context
        .dispatch(loginsTypes.ACTION_LOGINS_CALL_API, request)
        .then((adapter: LoginsAdapter) => {
          const tableValues = context.getters[loginsPageTypes.GETTER_LOGINS_PAGE_GET_TABLE_VALUES];
          tableValues.setLoginsAdapter(adapter);

          context.commit(loginsPageTypes.MUTATION_LOGINS_PAGE_SET_TABLE_VALUES, tableValues);
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
