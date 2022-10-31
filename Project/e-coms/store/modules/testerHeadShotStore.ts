import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import {
  TesterHeadShotAdapter,
  TesterHeadShotPostRequestType,
  TesterHeadShotPostResponseType,
  TesterHeadShotGetRequestType,
  TesterHeadShotGetResponseType,
} from '@/store/types/adapters/testerHeadShotAdapter';
import * as testerHeadShotTypes from '@/store/types/testerHeadShotType';
import * as errorTypes from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';

const state = () => {
  return new TesterHeadShotAdapter();
};

type StateType = ReturnType<typeof state>;

const getters: GetterTree<StateType, StateType> = {
};

const mutations: MutationTree<StateType> = {
};

const actions: ActionTree<StateType, StateType> = {
  /**
   *
   *
   * @param {Context} context
   * @param {TesterHeadShotPostRequestType} request
   * @return {Promise<TesterHeadShotAdapter>}
   */
  [testerHeadShotTypes.ACTION_TESTER_HEAD_SHOT_POST](context, request: TesterHeadShotPostRequestType): Promise<TesterHeadShotAdapter> {
    console.log(request);
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_HEAD_SHOT.url, request)
        .then((response: TesterHeadShotPostResponseType) => {
          if (response.status === 200) {
            const adapter = TesterHeadShotAdapter.fromPostResponse(response)
            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_HEAD_SHOT,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch((e: any) => {
          // TODO: エラー時の処理を追加
          reject(e)
        });
    });
  },
  /**
   *
   *
   * @param {Context} context
   * @param {TesterHeadShotGetRequestType} request
   * @return {Promise<TesterHeadShotAdapter>}
   */
  [testerHeadShotTypes.ACTION_TESTER_HEAD_SHOT_GET](context, request: TesterHeadShotGetRequestType): Promise<TesterHeadShotAdapter> {
    console.log(request);
    return new Promise((resolve, reject) => {
      this.$axios
        .$get(Endpoint.TESTER_HEAD_SHOT.url, {
          params: request
        })
        .then((response: TesterHeadShotGetResponseType) => {
          if (response.status === 200) {
            const adapter = TesterHeadShotAdapter.fromGetResponse(response)
            resolve(adapter);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER_HEAD_SHOT,
              status: response.status,
              message: response.message
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            reject(err)
          }
        })
        .catch((e: any) => {
          // TODO: エラー時の処理を追加
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
