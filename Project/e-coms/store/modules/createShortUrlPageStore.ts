import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
    CreateShortUrlPageAdapter,
} from '@/store/types/adapters/createShortUrlPageAdapter';
import * as createShortUrlPageTypes from '@/store/types/createShortUrlPageType';
import {
    CreateShortUrlSelectAdapter,
    CreateShortUrlSelectRequestType,
    CreateShortUrlInsertAdapter,
    CreateShortUrlInsertRequestType,
    CreateShortUrlUpdateAdapter,
    CreateShortUrlUpdateRequestType,
    CreateShortUrlDeleteAdapter,
    CreateShortUrlDeleteRequestType,
    ShortUrl,
} from '@/store/types/adapters/createShortUrlAdapter';
import * as createShortUrlTypes from '@/store/types/createShortUrlType';

const state = () => {
    return new CreateShortUrlPageAdapter();
};
type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
    /**
     * 短縮URL一覧取得
     * 
     * @param {StateType} state
     * @return {ShortUrl[]}
     */
    [createShortUrlPageTypes.GETTER_SELECT_SHORTEN_URL_LIST](state: StateType): ShortUrl[] {
        return state.createShortUrlSelectAdapter.shortUrls
    },
};

const mutations: MutationTree<StateType> = {
    /**
     * 短縮URL一覧設定
     * 
     * @param {StateType} state
     * @param {CreateShortUrlSelectAdapter} adapter
     */
    [createShortUrlPageTypes.MUTATION_SELECT_SHORTEN_URL](state: StateType, adapter: CreateShortUrlSelectAdapter) {
        state.createShortUrlSelectAdapter = adapter
    },
};

const actions: ActionTree<StateType, StateType> = {
    /**
     * 短縮URL一覧取得
     * 
     * @param {Context} context
     * @return {Promise<CreateShortUrlSelectAdapter>}
     */
    [createShortUrlPageTypes.ACTION_SELECT_SHORTEN_URL_GET](context): Promise<CreateShortUrlSelectAdapter> {
        return new Promise((resolve, reject) => {
            const request = {} as CreateShortUrlSelectRequestType

            context.dispatch(createShortUrlTypes.ACTION_SELECT_SHORTEN_URL, request)
                .then((adapter: CreateShortUrlSelectAdapter) => {
                    context.commit(createShortUrlPageTypes.MUTATION_SELECT_SHORTEN_URL, adapter);
                    resolve(adapter)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
    /**
     * 短縮URL 新規作成
     * 
     * @param {Context} context
     * @param {CreateShortUrlInsertRequestType} request
     * @return {Promise<CreateShortUrlInsertAdapter>}
     */
    [createShortUrlPageTypes.ACTION_INSERT_SHORTEN_URL_POST](context, request: CreateShortUrlInsertRequestType): Promise<CreateShortUrlInsertAdapter> {
        return new Promise((resolve, reject) => {
            context.dispatch(createShortUrlTypes.ACTION_INSERT_SHORTEN_URL, request)
                .then((adapter: CreateShortUrlInsertAdapter) => {
                    resolve(adapter)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
    /**
     * 短縮URL 更新
     * 
     * @param {Context} context
     * @param {CreateShortUrlUpdateRequestType} request
     * @return {Promise<CreateShortUrlUpdateAdapter>}
     */
    [createShortUrlPageTypes.ACTION_UPDATE_SHORTEN_URL_POST](context, request: CreateShortUrlUpdateRequestType): Promise<CreateShortUrlUpdateAdapter> {
        return new Promise((resolve, reject) => {
            context.dispatch(createShortUrlTypes.ACTION_UPDATE_SHORTEN_URL, request)
                .then((adapter: CreateShortUrlUpdateAdapter) => {
                    resolve(adapter)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
    /**
     * 短縮URL 削除
     * 
     * @param {Context} context
     * @param {CreateShortUrlDeleteRequestType} request
     * @return {Promise<CreateShortUrlDeleteAdapter>}
     */
    [createShortUrlPageTypes.ACTION_DELETE_SHORTEN_URL_POST](context, request: CreateShortUrlDeleteRequestType): Promise<CreateShortUrlDeleteAdapter> {
        return new Promise((resolve, reject) => {
            console.log(request)
            context.dispatch(createShortUrlTypes.ACTION_DELETE_SHORTEN_URL, request)
                .then((adapter: CreateShortUrlDeleteAdapter) => {
                    resolve(adapter)
                })
                .catch((e) => {
                    reject(e)
                });
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
