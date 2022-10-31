import { GetterTree, ActionTree, MutationTree } from 'vuex';
import VueRouter from 'vue-router';
import * as rootTypes from '@/store/types/rootType';
import {
  AccessLimitPageAdapter,
  SelectableAccessLimit,
  AccessLimitFormValues,
  AccessLimitTableValues,
} from '@/store/types/adapters/accessLimitPageAdapter';
import * as pageTypes from '@/store/types/accessLimitPageType';
import {
  AccessLimitSelectAdapter,
  AccessLimitSelectRequestType,
  AccessLimitSelectResponseType,
} from '@/store/types/adapters/accessLimitSelectAdapter';
import * as accessLimitSelectTypes from '@/store/types/accessLimitSelectType';
import {
  AccessLimitInsertAdapter,
  AccessLimitInsertRequestType,
  AccessLimitInsertResponseType,
} from '@/store/types/adapters/accessLimitInsertAdapter';
import * as accessLimitInsertTypes from '@/store/types/accessLimitInsertType';
import {
  AccessLimitDeleteAdapter,
  AccessLimitDeleteRequestType,
  AccessLimitDeleteResponseType,
} from '@/store/types/adapters/accessLimitDeleteAdapter';
import * as accessLimitDeleteTypes from '@/store/types/accessLimitDeleteType';

const state = () => {
  return new AccessLimitPageAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  /**
   * フォームの値を取得する
   */
  [pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES](state: StateType) {
    return state.formValues;
  },
  /**
   * テーブルの値を取得する
   */
  [pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_TABLE_VALUES](state: StateType) {
    return state.tableValues;
  },
};

const mutations: MutationTree<StateType> = {
  /**
   * フォームの値を設定する
   */
  [pageTypes.MUTATION_ACCESS_LIMIT_PAGE_SET_FORM_VALUES](state: StateType, payload: AccessLimitFormValues) {
    state.formValues = payload;
  },
  /**
   * フォームの値をクリアする
   */
  [pageTypes.MUTATION_ACCESS_LIMIT_PAGE_CLEAR_FORM_VALUES](state: StateType) {
    state.formValues.clear();
  },
  /**
   * テーブルの値を設定する
   */
  [pageTypes.MUTATION_ACCESS_LIMIT_PAGE_SET_TABLE_VALUES](state: StateType, payload: AccessLimitTableValues) {
    state.tableValues = payload;
  },
  /**
   * テーブルの値をクリアする
   */
  [pageTypes.MUTATION_ACCESS_LIMIT_PAGE_CLEAR_TABLE_VALUES](state: StateType) {
    state.tableValues.clear();
  },
};

const actions: ActionTree<StateType, StateType> = {
  /**
   * フォームの値を設定する
   */
  [pageTypes.ACTION_ACCESS_LIMIT_PAGE_SET_FORM_VALUES](context, payload: AccessLimitFormValues): void {
    context.commit(pageTypes.MUTATION_ACCESS_LIMIT_PAGE_SET_FORM_VALUES, payload);
  },
  /**
   * フォームの値をクリアする
   */
  [pageTypes.ACTION_ACCESS_LIMIT_PAGE_CLEAR_FORM_VALUES](context): void {
    context.commit(pageTypes.MUTATION_ACCESS_LIMIT_PAGE_CLEAR_FORM_VALUES);
  },
  /**
   * テーブルの値を設定する
   */
  [pageTypes.ACTION_ACCESS_LIMIT_PAGE_SET_TABLE_VALUES](context, payload: AccessLimitTableValues): void {
    context.commit(pageTypes.MUTATION_ACCESS_LIMIT_PAGE_SET_TABLE_VALUES, payload);
  },
  /**
   * テーブルの値をクリアする
   */
  [pageTypes.ACTION_ACCESS_LIMIT_PAGE_CLEAR_TABLE_VALUES](context): void {
    context.commit(pageTypes.MUTATION_ACCESS_LIMIT_PAGE_CLEAR_TABLE_VALUES);
  },
  /**
   * アクセス制限/SELECT
   */
  [pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_SELECT](context): Promise<void>{
    return new Promise((resolve, reject) => {
      const request: AccessLimitSelectRequestType = {
      };

      context
        .dispatch(accessLimitSelectTypes.ACTION_ACCESS_LIMIT_SELECT, request)
        .then((adapter: AccessLimitSelectAdapter) => {
          const tableValues = context.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_TABLE_VALUES];
          tableValues.setAccessLimits(adapter);

          context.commit(pageTypes.MUTATION_ACCESS_LIMIT_PAGE_SET_TABLE_VALUES, tableValues);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  /**
   * アクセス制限/INSERT
   */
  [pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_INSERT](context): Promise<void>{
    return new Promise((resolve, reject) => {
      const formValues = context.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_FORM_VALUES];
      const request: AccessLimitInsertRequestType = {
        server: formValues.server,
        ip: formValues.ip,
        domain: formValues.domain,
        actor: formValues.actor,
      };

      context
        .dispatch(accessLimitInsertTypes.ACTION_ACCESS_LIMIT_INSERT, request)
        .then((adapter: AccessLimitInsertAdapter) => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  /**
   * アクセス制限/DELETE
   */
  [pageTypes.ACTION_ACCESS_LIMIT_PAGE_CALL_API_DELETE](context): Promise<void>{
    return new Promise((resolve, reject) => {
      const tableValues = context.getters[pageTypes.GETTER_ACCESS_LIMIT_PAGE_GET_TABLE_VALUES];
      const request: AccessLimitDeleteRequestType = (tableValues.accessLimits as SelectableAccessLimit[]).filter(v => v.selected).map(v => v.id);

      context
        .dispatch(accessLimitDeleteTypes.ACTION_ACCESS_LIMIT_DELETE, request)
        .then((adapter: AccessLimitDeleteAdapter) => {
          resolve();
        })
        .catch(() => {
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
