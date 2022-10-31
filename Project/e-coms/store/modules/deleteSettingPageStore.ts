import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  DeleteSettingPageAdapter,
} from '@/store/types/adapters/deleteSettingPageAdapter';
import * as deleteSettingPageTypes from '@/store/types/deleteSettingPageType';
import {
  DeleteSettingIndexAdapter,
  DeleteSettingIndexRequestType,
  DeleteSettingIndexResponseType,
  DeleteSettingStoreAdapter,
  DeleteSettingStoreRequestType,
  DeleteSettingStoreResponseType,
  DeleteSettingUpdateAdapter,
  DeleteSettingUpdateRequestType,
  DeleteSettingUpdateResponseType,
  DeleteSetting,
} from '@/store/types/adapters/deleteSettingAdapter';
import * as deleteSettingTypes from '@/store/types/deleteSettingType';

const state = () => {
  return new DeleteSettingPageAdapter();
}
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  /**
   * 削除設定 一覧取得
   * 
   * @param {StateType} state
   * @return {DeleteSetting[]}
   */
  [deleteSettingPageTypes.GETTER_DELETE_SETTING_PAGE_GET_INDEX_LIST](state: StateType): DeleteSetting[] {
    return state.deleteSettingIndexAdapter.list
  },
}

const mutations: MutationTree<StateType> = {
  /**
   * 削除設定 一覧設定
   *
   * @param {StateType} state
   * @param {DeleteSettingIndexAdapter} adapter
   */
  [deleteSettingPageTypes.MUTATION_DELETE_SETTING_PAGE_SET_INDEX](state: StateType, adapter: DeleteSettingIndexAdapter) {
    state.deleteSettingIndexAdapter = adapter
  },
}

const actions: ActionTree<StateType, StateType> = {
  /**
   * 削除設定 一覧取得
   *
   * @param {Context} context
   * @return {Promise<DeleteSettingIndexAdapter>}
   */
  [deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_GET_INDEX](context): Promise<DeleteSettingIndexAdapter> {
    return new Promise((resolve, reject) => {
      const request = {
      } as DeleteSettingIndexRequestType

      context.dispatch(deleteSettingTypes.ACTION_DELETE_SETTING_INDEX, request)
        .then((adapter: DeleteSettingIndexAdapter) => {
          context.commit(deleteSettingPageTypes.MUTATION_DELETE_SETTING_PAGE_SET_INDEX, adapter);
          resolve(adapter)
        })
        .catch((e) => {
          reject(e)
        });
    });
  },
  /**
   * 削除設定 新規追加
   *
   * @param {Context} context
   * @param {DeleteSettingStoreRequestType} request
   * @return {Promise<DeleteSettingStoreAdapter>}
   */
  [deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_POST_STORE](context, request: DeleteSettingStoreRequestType): Promise<DeleteSettingStoreAdapter> {
    return new Promise((resolve, reject) => {
      context.dispatch(deleteSettingTypes.ACTION_DELETE_SETTING_STORE, request)
        .then((adapter: DeleteSettingStoreAdapter) => {
          resolve(adapter)
        })
        .catch((e) => {
          reject(e)
        });
    });
  },
  /**
   * 削除設定 更新
   *
   * @param {Context} context
   * @param {DeleteSettingUpdateRequestType} request
   * @return {Promise<DeleteSettingUpdateAdapter>}
   */
  [deleteSettingPageTypes.ACTION_DELETE_SETTING_PAGE_POST_UPDATE](context, request: DeleteSettingUpdateRequestType): Promise<DeleteSettingUpdateAdapter> {
    return new Promise((resolve, reject) => {
      context.dispatch(deleteSettingTypes.ACTION_DELETE_SETTING_UPDATE, request)
        .then((adapter: DeleteSettingUpdateAdapter) => {
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
