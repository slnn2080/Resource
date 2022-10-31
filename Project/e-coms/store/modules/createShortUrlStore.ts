import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
    CreateShortUrlSelectAdapter,
    CreateShortUrlSelectRequestType,
    CreateShortUrlSelectResponseType,
    CreateShortUrlInsertAdapter,
    CreateShortUrlInsertRequestType,
    CreateShortUrlInsertResponseType,
    CreateShortUrlUpdateAdapter,
    CreateShortUrlUpdateRequestType,
    CreateShortUrlUpdateResponseType,
    CreateShortUrlDeleteAdapter,
    CreateShortUrlDeleteRequestType,
    CreateShortUrlDeleteResponseType,
} from '@/store/types/adapters/createShortUrlAdapter';
import * as createShortUrlTypes from '@/store/types/createShortUrlType';
import { Endpoint } from '@/store/const/endpoint';
import * as errorTypes from '@/store/types/errorType';
import { ErrorStatus } from '../types/adapters/errorAdapter';

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
   * 短縮URL一覧を取得する
   * 
   * @param {Context} context
   * @param {CreateShortUrlSelectRequestType} request
   * @return {Promise<CreateShortUrlSelectAdapter>}
   */
    [createShortUrlTypes.ACTION_SELECT_SHORTEN_URL](context, request: CreateShortUrlSelectRequestType): Promise<CreateShortUrlSelectAdapter> {
        return new Promise((resolve, reject) => {
            this.$axios
                .$get(Endpoint.SELECT_SHORTEN_URL.url, {
                    params: request
                })
                .then((response: CreateShortUrlSelectResponseType) => {
                    if (response.status === 200) {
                        const adapter = CreateShortUrlSelectAdapter.fromResponse(response)
                        resolve(adapter);
                    } else {
                        const err: ErrorStatus = {
                            endpoint: Endpoint.SELECT_SHORTEN_URL,
                            status: response.status,
                            message: response.message
                        };
                        context.dispatch(errorTypes.ACTION_SET_ERROR, err);
                        reject(err);
                    }
                })
                .catch((e: any) => {
                    console.error('[CreateShortUrlSelect error] : ', e);
                    // エラー時の処理
                    reject(e);
                })
        });
    },

    /**
       * 短縮URLの新規追加
       * 
       * @param {Context} context
       * @param {CreateShortUrlInsertRequestType} request
       * @return {Promise<CreateShortUrlInsertAdapter>}
       */
    [createShortUrlTypes.ACTION_INSERT_SHORTEN_URL](context, request: CreateShortUrlInsertRequestType): Promise<CreateShortUrlInsertAdapter> {
        console.log('[LOG] CreateShortUrlInsert request:', request)
        return new Promise((resolve, reject) => {
            this.$axios
                .$post(Endpoint.INSERT_SHORTEN_URL.url, request)
                .then((response: CreateShortUrlInsertResponseType) => {
                    if (response.status === 200) {
                        const adapter = CreateShortUrlInsertAdapter.fromResponse(response)

                        resolve(adapter);
                    } else {
                        const err: ErrorStatus = {
                            endpoint: Endpoint.INSERT_SHORTEN_URL,
                            status: response.status,
                            message: response.message
                        };
                        context.dispatch(errorTypes.ACTION_SET_ERROR, err);
                        reject(err);
                    }
                })
                .catch((e: any) => {
                    console.error('[CreateShortUrlInsert error] : ', e);
                    // エラー時の処理
                    reject(e)
                });
        });
    },

    /**
     * 短縮URLの更新
     * 
     * @param {Context} context
     * @param {CreateShortUrlUpdateRequestType} request
     * @return {Promise<CreateShortUrlUpdateAdapter>}
     */
    [createShortUrlTypes.ACTION_UPDATE_SHORTEN_URL](context, request: CreateShortUrlUpdateRequestType): Promise<CreateShortUrlUpdateAdapter> {
        return new Promise((resolve, reject) => {
            this.$axios
                .$post(Endpoint.UPDATE_SHORTEN_URL.url, request)
                .then((response: CreateShortUrlUpdateResponseType) => {
                    if (response.status === 200) {
                        const adapter = CreateShortUrlUpdateAdapter.fromResponse(response)

                        resolve(adapter);
                    } else {
                        const err: ErrorStatus = {
                            endpoint: Endpoint.UPDATE_SHORTEN_URL,
                            status: response.status,
                            message: response.message
                        };
                        context.dispatch(errorTypes.ACTION_SET_ERROR, err);
                        reject(err);
                    }
                })
                .catch((e: any) => {
                    console.error('[CreateShortUrlUpdate error] : ', e);
                    reject(e)
                });
        });
    },
    /**
     * 短縮URLの削除
     * 
     * @param {Context} context
     * @param {CreateShortUrlDeleteRequestType} request
     * @return {Promise<CreateShortUrlDeleteAdapter>}
     */
    [createShortUrlTypes.ACTION_DELETE_SHORTEN_URL](context, request: CreateShortUrlDeleteRequestType): Promise<CreateShortUrlDeleteAdapter> {
        return new Promise((resolve, reject) => {
            this.$axios
                .$post(Endpoint.DELETE_SHORTEN_URL.url, request)
                .then((response: CreateShortUrlDeleteResponseType) => {
                    if (response.status === 200) {
                        const adapter = CreateShortUrlDeleteAdapter.fromResponse(response)

                        resolve(adapter);
                    } else {
                        const err: ErrorStatus = {
                            endpoint: Endpoint.DELETE_SHORTEN_URL,
                            status: response.status,
                            message: response.message
                        };
                        context.dispatch(errorTypes.ACTION_SET_ERROR, err);
                        reject(err);
                    }
                })
                .catch((e: any) => {
                    console.error('[CreateShortUrlDelete error] : ', e);
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
