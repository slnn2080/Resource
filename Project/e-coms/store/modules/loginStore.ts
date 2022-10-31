/* eslint-disable camelcase */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import StartupAdapter from '../types/adapters/startupAdapter';
import { ErrorStatus } from '../types/adapters/errorAdapter';
import {
  LoginAdapter,
  AccessToken,
  AccessTokenWithActor,
  LoginRequestType,
  LoginResponseType
} from '@/store/types/adapters/loginAdapter';
import * as loginTypes from '@/store/types/loginType';
import * as rootTypes from '@/store/types/rootType';
import * as errorTypes from '@/store/types/errorType';
import { Endpoint } from '@/store/const/endpoint';

const state = () => {
  return {
    isLoggedIn: false as boolean,
    loginAdapter: new LoginAdapter(),
  }
};

type LoginState = ReturnType<typeof state>;

const getters: GetterTree<LoginState, LoginState> = {
  /**
   * ログインしているか調べます
   *
   * @return {boolean}
   */
  [loginTypes.GETTER_IS_LOGGED_IN](state: LoginState): boolean {
    return state.isLoggedIn;
  },
  // ログインストアデータ取得処理
  [loginTypes.GETTER_LOGIN](state: LoginState) {
    return { ...state.loginAdapter };
  },
  // アクセストークン有無取得処理
  [loginTypes.GETTER_HAS_ACCESS_TOKEN](state: LoginState): boolean {
    return !!state.loginAdapter.accessToken;
  },
  // アクセストークン取得処理
  [loginTypes.GETTER_GET_ACCESS_TOKEN](state: LoginState): string | null {
    return state.loginAdapter.accessToken;
  },
};

const mutations: MutationTree<LoginState> = {
  /**
   * アクセストークンを設定します
   *
   * ※この処理はログイン処理よりも前に一度だけ行われる
   * ログイン処理よりも後に行われると不具合になることに注意
   *
   * @param {LoginState} state
   * @param {LoginAdapter} payload
   */
  [loginTypes.MUTATION_SET_ACCESS_TOKEN](state: LoginState, payload: LoginAdapter) {
    // 初期値falseのままで問題なし、設定不要
    // state.isLoggedIn = false
    state.loginAdapter = payload
  },
  /**
   * アクセストークンを設定します
   *
   * ※この処理はログイン処理よりも前に一度だけ行われる
   * ログイン処理よりも後に行われると不具合になることに注意
   *
   * @param {LoginState} state
   * @param {LoginAdapter} payload
   * @dependent 使ってはいけない
   */
  [loginTypes.MUTATION_SET_ACCESS_TOKEN_WITH_ACTOR](state: LoginState, payload: LoginAdapter) {
    // 初期値falseのままで問題なし、設定不要
    // state.isLoggedIn = false
    state.loginAdapter = payload
  },
  /**
   * ログインストア更新処理
   *
   * @param {LoginState} state
   * @param {LoginAdapter} payload
   */
  [loginTypes.MUTATION_LOGIN](state: LoginState, payload: LoginAdapter) {
    state.isLoggedIn = true
    state.loginAdapter = payload
  },
  /**
   * ログインストアクリア処理
   *
   * @param {LoginState} state
   */
  [loginTypes.MUTATION_LOGOUT](state: LoginState) {
    state.isLoggedIn = false
    state.loginAdapter = new LoginAdapter()
  },
};

const actions: ActionTree<LoginState, LoginState> = {
  /**
   * アクセストークンを設定するための処理
   *
   * この処理は、スタートアップパラメータのアクセストークンを可能な限り早く
   * このストアに設定するための処理です。たぶん。
   * 以下の処理よりも先にアクセストークンを設定するための処理です
   * <li>loginTypes.ACTION_LOGIN
   * <li>loginTypes.ACTION_LOGIN_FOR_JTESTING
   * <li>loginTypes.ACTION_LOGIN_FOR_CHILD_WINDOW
   *
   * @param {Context} context
   * @param {AccessToken} payload
   */
  [loginTypes.ACTION_SET_ACCESS_TOKEN](context, payload: AccessToken) {
    context.commit(loginTypes.MUTATION_SET_ACCESS_TOKEN, LoginAdapter.fromAccessToken(payload));
  },
  /**
   * アクセストークンを設定するための処理
   *
   * @param {Context} context
   * @param {AccessTokenWithActor} payload
   * @dependent 使ってはいけない
   */
  [loginTypes.ACTION_SET_ACCESS_TOKEN_WITH_ACTOR](context, payload: AccessTokenWithActor) {
    context.commit(loginTypes.MUTATION_SET_ACCESS_TOKEN_WITH_ACTOR, LoginAdapter.fromAccessTokenWithActor(payload));
  },
  /**
   * 通常のログインAPIによる認証
   *
   * @param {Context} context
   * @param {LoginRequestType} payload
   * @return {Promise<LoginResponseType | ErrorStatus>}
   */
  [loginTypes.ACTION_LOGIN](context, { login_id, password }: LoginRequestType): Promise<LoginResponseType | ErrorStatus> {
    if (login_id != null && login_id.length > 0) {
      login_id = login_id.trim();
    }
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(Endpoint.LOGIN.url, {
          login_id,
          password
        })
        .then(({ status, result, message }: LoginResponseType) => {
          // LOGIN_ID or PASSWORD エラー
          if (status === 200) {
            context.commit(loginTypes.MUTATION_LOGIN, LoginAdapter.fromResponse(result))
            resolve({ status, result, message });
          } else {
            const err: ErrorStatus = {
              endpoint: Endpoint.LOGIN,
              status,
              message,
              result
            };
            context.dispatch(errorTypes.ACTION_SET_ERROR, err);
            resolve({ status, result, message });
          }
        })
        .catch((e: any) => {
          console.error('[Login error] : ', e);
          reject(e);
        });
    });
  },
  /**
   * J-Testingのログイン 通常のログインAPIによる認証は行わない
   *
   * @param {Context} context
   * @param {StartupAdapter} payload
   */
  [loginTypes.ACTION_LOGIN_FOR_JTESTING](context, payload: StartupAdapter) {
    context.commit(loginTypes.MUTATION_LOGIN, LoginAdapter.fromStartupAdapter(payload))
  },
  /**
   * 別ウィンドウを開くためのログイン処理 通常のログインAPIによる認証は行わない
   *
   * @param {Context} context
   * @param {LoginAdapter} payload
   */
  [loginTypes.ACTION_LOGIN_FOR_CHILD_WINDOW](context, payload: LoginAdapter) {
    context.commit(loginTypes.MUTATION_LOGIN, payload);
  },
  /**
   * ログアウト処理
   *
   * @param {Context} context
   * @return {Promise<void>}
   */
  [loginTypes.ACTION_LOGOUT](context): Promise<void> {
    console.log('[LOG INFO] logout data : ');
    return new Promise((resolve, reject) => {
      this.$axios
        .$post(
          Endpoint.LOGOUT.url,
          {},
          {
            params: {
              p: 'self'
            }
          }
        )
        .then(() => {
          context.commit(loginTypes.MUTATION_LOGOUT);
          resolve();
        })
        .catch((e: any) => {
          console.error('[Logout error] : ', e);
          reject(e);
        });
    })
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
