import { GetterTree, ActionTree, MutationTree } from 'vuex';
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
} from '@/store/types/adapters/deleteSettingAdapter';
import * as deleteSettingTypes from '@/store/types/deleteSettingType';
import * as managementPageTypes from '@/store/types/managementPageType';
import { Endpoint } from '@/store/const/endpoint';
import * as errorTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';

const state = () => {
  return {}
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  /**
   * 削除設定一覧を取得します
   *
   * @param {Context} context
   * @param {DeleteSettingIndexRequestType} request
   * @return {Promise<DeleteSettingIndexAdapter>}
   */
  [deleteSettingTypes.ACTION_DELETE_SETTING_INDEX](context, request: DeleteSettingIndexRequestType): Promise<DeleteSettingIndexAdapter> {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.DELETE_SETTING_INDEX.url, {
          params: request
        })
        .then((response: DeleteSettingIndexResponseType) => {
          if (response.status === 200) {
            const adapter = DeleteSettingIndexAdapter.fromResponse(response)

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.DELETE_SETTING_INDEX,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[DeleteSettingIndex error] : ', e);
          // エラー時の処理
          reject(e)
        });
    });
  },
  /**
   * 削除設定を新規追加します
   *
   * @param {Context} context
   * @param {DeleteSettingStoreRequestType} request
   * @return {Promise<DeleteSettingStoreAdapter>}
   */
  [deleteSettingTypes.ACTION_DELETE_SETTING_STORE](context, request: DeleteSettingStoreRequestType): Promise<DeleteSettingStoreAdapter> {
    console.log('[LOG] DeleteSettingStore request:', request)
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.DELETE_SETTING_STORE.url, request)
        .then((response: DeleteSettingStoreResponseType) => {
          if (response.status === 200) {
            const adapter = DeleteSettingStoreAdapter.fromResponse(response)

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.DELETE_SETTING_STORE,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[DeleteSettingStore error] : ', e);
          // エラー時の処理
          reject(e)
        });
    });
  },
  /**
   * 削除設定を更新します
   *
   * @param {Context} context
   * @param {DeleteSettingUpdateRequestType} request
   * @return {Promise<DeleteSettingUpdateAdapter>}
   */
  [deleteSettingTypes.ACTION_DELETE_SETTING_UPDATE](context, request: DeleteSettingUpdateRequestType): Promise<DeleteSettingUpdateAdapter> {
    console.log('[LOG] DeleteSettingUpdate request:', request)
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.DELETE_SETTING_UPDATE.url, request)
        .then((response: DeleteSettingUpdateResponseType) => {
          if (response.status === 200) {
            const adapter = DeleteSettingUpdateAdapter.fromResponse(response)

            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.DELETE_SETTING_UPDATE,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[DeleteSettingUpdate error] : ', e);
          // エラー時の処理
          reject(e)
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
