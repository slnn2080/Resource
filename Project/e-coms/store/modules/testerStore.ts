/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';

import { TesterAdapter, TesterResponseType, TesterStatusRequestType, TesterStatusResponseType } from '@/store/types/adapters/testerAdapter';
import * as types from '@/store/types/testerType';
import * as testerPageTypes from '~/store/types/testerPageType';
import * as errTypes from '@/store/types/errorType';
import { ErrorStatus } from '@/store/types/adapters/errorAdapter';
import { Endpoint } from '@/store/const/endpoint';
import * as loginTypes from '@/store/types/loginType';
import * as LogReceiveAdapter from '@/store/types/adapters/logReceiveAdapter';
import * as logReceiveTypes from '@/store/types/logReceiveType';
import { Formatter } from '@/utils/Formatter';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as rootTypes from '@/store/types/rootType';

/**
 * 受験者情報API Store
 */
const state = () => {
  return new TesterAdapter();
};

type TesterState = ReturnType<typeof state>;

const getters: GetterTree<TesterState, TesterState> = {
  [types.GETTER_TESTER](state: TesterState): TesterAdapter {
    return { ...state };
  }
};

const mutations: MutationTree<TesterState> = {
  [types.MUTATION_TESTER](state: TesterState, payload: TesterAdapter) {
    state.testerId = payload.testerId;
    state.examName = payload.examName;
    state.status = payload.status;
    state.loginId = payload.loginId;
    state.startupParameters = payload.startupParameters;
    state.authenticatedAt = payload.authenticatedAt;
  },
  [types.MUTATION_TESTER_STATUS](state: TesterState, payload: number) {
    state.status = payload;
  }
};

const actions: ActionTree<TesterState, TesterState> = {
  [types.ACTION_TESTER](context, testerId: number | null = null): Promise<TesterAdapter> {
    console.log('[LOG INFO] tester data : ', testerId);
//    context.commit(types.MUTATION_TESTER, new TesterAdapter(testerId));
    return new Promise((resolve, reject) => {
      const params = (testerId === null) ? {} : {params: {tester_id: testerId}}
      this.$axios
        .$get(Endpoint.TESTER.url, params)
        .then((response: TesterResponseType) => {
          if (response.status === 200) {
            const startup_parameters = response.result.startup_parameters ? response.result.startup_parameters : {} as any;
            // 「空白」をJSで使用可能に処理する。
            let memo = encodeURIComponent(startup_parameters.memo);
            memo === '%22%22' || memo === '%27%27' ? memo = '' : memo = decodeURIComponent(memo);

            context.commit(types.MUTATION_TESTER, {
              testerId: response.result.tester_id,
              examName: response.result.exam_name,
              status: response.result.status,
              loginId: response.result.login_id,
              authenticatedAt: response.result.authenticated_at,
              startupParameters: {
                isProctor: startup_parameters.is_proctor * 1,
                memo,
              },
              rejected: response.result.rejected,
              testers: response.result.testers ? response.result.testers.map(tester => ({
                testerId: tester.tester_id,
                examName: tester.exam_name,
                status: tester.status,
                loginId: tester.login_id,
                startupParameters: {
                  isProctor: (tester.startup_parameters ? tester.startup_parameters : {} as any).is_proctor,
                },
              })) : [],
            });
            resolve(context.getters[types.GETTER_TESTER]);
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);


            // 認証エラーまたは二重ログインの場合はログをサーバーに保存
            if (response.status == 401 || response.status == 405) {
              const startup: StartupAdapter = context.getters[rootTypes.GETTER_STARTUP];
              if (startup.isDebug != null) {
                const exLoginId = context.getters[loginTypes.GETTER_LOGIN].loginId
                const token = context.getters[loginTypes.GETTER_GET_ACCESS_TOKEN]
                const data = {
                  error_reason: 'auth_error',
                  ex_login_id: exLoginId,
                  token: token,
                  response: response,
                }
                const detail:string = JSON.stringify(data).slice(0, LogReceiveAdapter.DETAILS_MAX_LENGTH) || 'detail is empty!!';
                context.dispatch(logReceiveTypes.ACTION_POST_LOG_RECEIVE, {
                  type: LogReceiveAdapter.LogReceiveType.ERROR,
                  path: Endpoint.TESTER.url,
                  module: 'front-api',
                  location: 'out/error:auth_error',
                  details: detail,
                  timestamp: Formatter.date('yyyy-MM-dd hh:mm:ss', new Date()),
                } as LogReceiveAdapter.LogReceiveRequestType);
              }
              /// / 二重ログインの場合はログアウト
              if (response.status == 405) {
                context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_LOGOUT);
              }
            }

            reject(err);
          }
        })
        .catch((e: any) => {
          console.error('[Tester error] : ', e);

          // ネットワークエラーの場合はログをサーバーに保存
          if (e.message == 'Network Error') {
            const startup: StartupAdapter = context.getters[rootTypes.GETTER_STARTUP];
            if (startup.isDebug != null) {
              const exLoginId = context.getters[loginTypes.GETTER_LOGIN].loginId
              const token = context.getters[loginTypes.GETTER_GET_ACCESS_TOKEN]
              const data = {
                error_reason: 'network_error',
                ex_login_id: exLoginId,
                token: token,
                response: { ...e },
              }
              const detail:string = JSON.stringify(data).slice(0, LogReceiveAdapter.DETAILS_MAX_LENGTH) || 'detail is empty!!';
              context.dispatch(logReceiveTypes.ACTION_POST_LOG_RECEIVE, {
                type: LogReceiveAdapter.LogReceiveType.ERROR,
                path: Endpoint.TESTER.url,
                module: 'front-api',
                location: 'out/error:network_error',
                details: detail,
                timestamp: Formatter.date('yyyy-MM-dd hh:mm:ss', new Date()),
              } as LogReceiveAdapter.LogReceiveRequestType);
            }
          }

          reject(e);
        });
    });
  },
  [types.ACTION_TESTER_STATUS](context, { tester_id, status }: TesterStatusRequestType) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.TESTER_STATUS.url, {
          tester_id,
          status
        })
        .then((response: TesterStatusResponseType) => {
          if (response.status === 200) {
            context.commit(types.MUTATION_TESTER_STATUS, status);
            resolve();
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.TESTER,
              status: response.status,
              message: response.message
            };
            context.dispatch(errTypes.ACTION_SET_ERROR, err);
            reject(err);
          }
          if (response.status === 401) {
            context.dispatch(testerPageTypes.ACTION_TESTER_PAGE_LOGOUT);
          }
        })
        .catch((e) => {
          // TODO : 失敗時の処理を書くこと
          reject(e);
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
