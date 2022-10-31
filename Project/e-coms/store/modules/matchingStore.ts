/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { uniqueId } from 'lodash';
import { ErrorStatus } from '../types/adapters/errorAdapter';
import * as testerPageTypes from '~/store/types/testerPageType';
import * as errorTypes from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';
import {
  MatchingAdapter,
  Matching,
  MatchingDefaultRequestType,
  MatchingPostStatusRequestType,
  MatchingCommandRequestType,
  MatchingResponseType,
  DeleteMatchingRequestType,
  DeleteMatchingResponseType,
} from '@/store/types/adapters/matchingAdapter';
import * as matchingTypes from '@/store/types/matchingType';

const state = () => {
  return {
    adapter: new MatchingAdapter(),
    matchingPromises: {} as {[key: string]: Promise<any> | null},
  }
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
  /**
   *
   *
   * @param {StateType} state
   * @return {Matching[]}
   */
  [matchingTypes.GETTER_MATCHING](state: StateType): Matching[] {
    return state.adapter.matchings
  },
  /**
   *
   *
   * @param {StateType} state
   * @return {boolean}
   */
  [matchingTypes.GETTER_IS_ACCESSING](state: StateType): boolean {
    return Object.values(state.matchingPromises).length > 0
  },
};

const mutations: MutationTree<StateType> = {
  [matchingTypes.MUTATION_MATCHING](state: StateType, payload: Matching[]) {
    state.adapter.matchings = payload
  },
  [matchingTypes.MUTATION_DELETE_MATCHING](state: StateType, testerId: number) {
    state.adapter.matchings = state.adapter.matchings.filter((v) => (v.testerId != testerId))
  },
  [matchingTypes.MUTATION_ADD_PROMISE](state: StateType, payload: {key: string; promise: Promise<any>}) {
    state.matchingPromises[payload.key] = payload.promise
  },
  [matchingTypes.MUTATION_REMOVE_PROMISE](state: StateType, payload: {key: string;}) {
    if (state.matchingPromises[payload.key]) {
      delete state.matchingPromises[payload.key]
    }
  },
};

const actions: ActionTree<StateType, StateType> = {
  /**
   * マッチングステータス(KVSの接続情報)をポストして、マッチング情報を取得します
   *
   * API呼び出し監視版
   *
   * @param {Context} context
   * @param {MatchingDefaultRequestType | MatchingPostStatusRequestType | MatchingCommandRequestType} request
   * @return {Promise<MatchingAdapter>}
   */
  [matchingTypes.ACTION_MATCHING](
    context,
    request: (MatchingDefaultRequestType | MatchingPostStatusRequestType | MatchingCommandRequestType)
  ): Promise<MatchingAdapter> {
    return new Promise((resolve, reject) => {
      const promise = context.dispatch(matchingTypes.ACTION_MATCHING__, request)

      // matching.phpのポーリング処理を停止させる場合、すべてのAPIの完了を待つ必要があるので、
      // Promiseを連想配列に入れて管理する. 処理の成功失敗については考慮しない
      const key = uniqueId() as string
      context.commit(matchingTypes.MUTATION_ADD_PROMISE, {key: key, promise: promise})
      const removePromise = () => { context.commit(matchingTypes.MUTATION_REMOVE_PROMISE, {key: key}) }

      promise
        .then((adapter: MatchingAdapter) => resolve(adapter))
        .catch((e) => reject(e))
        .finally(() => removePromise())
    })
  },
  /**
   * マッチングを削除します
   *
   * API呼び出し監視版
   *
   * @param {Context} context
   * @param {DeleteMatchingRequestType} request
   * @return {Promise<boolean>}
   */
  [matchingTypes.ACTION_DELETE_MATCHING](context, request: DeleteMatchingRequestType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promise = context.dispatch(matchingTypes.ACTION_DELETE_MATCHING__, request)

      // matching.phpのポーリング処理を停止させる場合、すべてのAPIの完了を待つ必要があるので、
      // Promiseを連想配列に入れて管理する. 処理の成功失敗については考慮しない
      const key = uniqueId() as string
      context.commit(matchingTypes.MUTATION_ADD_PROMISE, {key: key, promise: promise})
      const removePromise = () => { context.commit(matchingTypes.MUTATION_REMOVE_PROMISE, {key: key}) }

      promise
        .then(() => resolve(true))
        .catch((e) => reject(e))
        .finally(() => removePromise())
    })
  },
  /**
   * マッチング情報を取得します
   *
   * 通常のAPI呼び出し。
   *
   * @param {Context} context
   * @param {MatchingDefaultRequestType | MatchingPostStatusRequestType | MatchingCommandRequestType} request
   * @return {Promise<MatchingAdapter>}
   */
  [matchingTypes.ACTION_MATCHING__](
    context,
    request: (MatchingDefaultRequestType | MatchingPostStatusRequestType | MatchingCommandRequestType)
  ): Promise<MatchingAdapter> {
    console.log('[LOG INFO] matching data post (WebRTC stat Request)');
    return new Promise((resolve, reject) => {
      this.$axios.$post(Endpoint.MATCHING.url, request)
        .then((response: MatchingResponseType) => {
          if (response.status === 200) {
            context.commit(matchingTypes.MUTATION_MATCHING, response.result.matchings.map(v => Matching.fromResponse(v)))
            resolve(context.getters[matchingTypes.GETTER_MATCHING]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.MATCHING,
              status: response.status,
              message: response.message,
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
          if (response.status === 401) {
            context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_LOGOUT);
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  },
  /**
   * マッチングを削除します
   *
   * 通常のAPI呼び出し。
   *
   * @param {Context} context
   * @param {DeleteMatchingRequestType} request
   * @return {Promise<boolean>}
   */
  [matchingTypes.ACTION_DELETE_MATCHING__](context, request: DeleteMatchingRequestType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$axios.$post(Endpoint.DELETE_MATCHING.url, request)
        .then(({ status, message }: DeleteMatchingResponseType) => {
          if (status === 200) {
            // TODO:本来は消す必要があるが、十分考慮してないためエラーが出たのでとりあえずコメントアウト
            context.commit(matchingTypes.MUTATION_DELETE_MATCHING, request.tester_id)
            resolve();
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.DELETE_MATCHING,
              status,
              message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
          if (status === 401) {
            context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_LOGOUT);
          }
        })
        .catch(err => {
          console.error(err);
          reject(err);
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
