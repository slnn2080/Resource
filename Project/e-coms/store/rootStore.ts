import { GetterTree, ActionTree, MutationTree, ActionContext } from 'vuex';
import StartupAdapter, {
  RawStartupParameter,
} from '@/store/types/adapters/startupAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import {
  LoginAdapter,
  AccessToken,
} from '@/store/types/adapters/loginAdapter';
import {
  JapaneseLanguageEnum,
  EnglishLanguageEnum,
  LanguageEnum
} from '@/store/enum/language';
import { Endpoint } from '@/store/const/endpoint';

const state = () => {
  return {
    isStartupped: false as boolean,
    startup: new StartupAdapter(),
    displayLang: JapaneseLanguageEnum as LanguageEnum,
  };
};
type rootState = ReturnType<typeof state>;
type Context = ActionContext<rootState, rootState>;

const getters: GetterTree<rootState, rootState> = {
  [rootTypes.GETTER_IS_STARTUPPED](state: rootState): boolean {
    return state.isStartupped;
  },
  [rootTypes.GETTER_STARTUP](state: rootState): StartupAdapter {
    return state.startup;
  },
  [rootTypes.GETTER_STARTUP_URL](state: rootState): string {
    return state.startup.rawStartupUrl
  },
  [rootTypes.GETTER_DISPLAY_LANG](state: rootState): LanguageEnum {
    return state.displayLang;
  },
};

const mutations: MutationTree<rootState> = {
  [rootTypes.MUTATION_STARTUP](state: rootState, payload: StartupAdapter) {
    state.isStartupped = true
    state.startup = payload
  },
  [rootTypes.MUTATION_LANGUAGE](state: rootState, payload: string) {
    const langMap = {
      'ja': JapaneseLanguageEnum,
      'en': EnglishLanguageEnum,
      'zn': JapaneseLanguageEnum, // TODO: 
    } as any
    const langEnum = langMap[payload] || langMap['ja'] // TODO: デフォルトjaにしているが後で修正?

    state.displayLang = langEnum
  },
};

const actions: ActionTree<rootState, rootState> = {
  /**
   * アプリケーションのスタートアップを行います
   *
   * @param {Context} context
   * @return {string} query
   */
  [rootTypes.ACTION_STARTUP](context: Context, query: string) {
    // TODO: 本来、sessionStorageが使えるかのチェック前に使うのは、ダメなんだがスタートアップパラメータを設定するためにしょうがない
    // 現在の動作がF5を押しても微妙に復帰するので、その挙動を損なわないようにこの処理を行う
    // layouts/default.vueのbeforeCreatedも参照
    try {
      window.sessionStorage.setItem('startup', query); //
    } catch (e) {
    }

    context.dispatch(rootTypes.ACTION_SET_RAW_STARTUP_PARAMETER, StartupAdapter.toRawStartupParameterFromQuery(query))
    const inParams = context.getters[rootTypes.GETTER_STARTUP] as StartupAdapter;

    // スタートアップパラメータからアクセストークンをまず設定する。
    //
    // 受験者&J-Testingの場合は、スタートアップパラメータの中にログイン情報があるため、ログイン情報の設定を行う
    // それ以外の場合は、「ログイン」画面に遷移する
    //
    // @see front/middleware/initCheck.ts initCheckMiddleware()関数
    // @see front/layouts/default.vue beforeCreate()関数
    context.dispatch(loginTypes.ACTION_SET_ACCESS_TOKEN, {accessToken: inParams.accessToken} as AccessToken);
    if (inParams.actor == 1) {
      // 受験者
      if (StartupAdapter.isJtStartUp(inParams)) {
        // J-Testing の場合
        // 受験者&J-Testingの場合、スタートアップパラメータにログイン情報が仕込まれているので、ここでログイン情報の設定を行う
        context.dispatch(loginTypes.ACTION_LOGIN_FOR_JTESTING, inParams)
      } else {
        // J-Testing 以外の場合
      }
    } else {
      // 管理者 / 監視者
    }
  },
  /**
   * アプリケーションのスタートアップを行います(F5対策)
   *
   * @param {Context} context
   */
  [rootTypes.ACTION_STARTUP_FOR_F5](context: Context) {
    const isStartupped = context.getters[rootTypes.GETTER_IS_STARTUPPED]
    if (!isStartupped) {
      let query: string
      try {
        query = window.sessionStorage.getItem('startup') as string
      } catch (e) {
        console.log('window.sessionStorageが使用できませんでした。')
        return
      }

      context.dispatch(rootTypes.ACTION_SET_RAW_STARTUP_PARAMETER, StartupAdapter.toRawStartupParameterFromQuery(query))
      const inParams = context.getters[rootTypes.GETTER_STARTUP] as StartupAdapter;

      // スタートアップパラメータからアクセストークンをまず設定する。
      //
      // J-Testingの場合は、スタートアップパラメータの中にログイン情報があるため、復帰させる場合はログイン情報も復帰させる必要がある
      // TODO: スタートアップパラメータのアクセストークンよりも後に発行される、アクセストークンがもしあるならばsessionStorage()の中身も更新する必要があるかもしれない
      context.dispatch(loginTypes.ACTION_SET_ACCESS_TOKEN, {accessToken: inParams.accessToken} as AccessToken);
      if (inParams.actor == 1) {
        if (StartupAdapter.isJtStartUp(inParams)) {
          // 受験者&J-Testingの場合、スタートアップパラメータにログイン情報が仕込まれているので、ここでログイン情報の設定を行う
          context.dispatch(loginTypes.ACTION_LOGIN_FOR_JTESTING, inParams)
        } else {
          // nop
        }
      } else {
        // nop
      }
    }
  },
  /**
   * アプリケーションのスタートアップを行います(子ウィンドウ用)
   *
   * @param {Context} context
   * @param {{rawStartupParameter: RawStartupParameter, loginData: LoginAdapter}} payload
   */
  [rootTypes.ACTION_STARTUP_FOR_CHILD_WINDOW](context: Context, payload: {rawStartupParameter: RawStartupParameter, loginData: LoginAdapter}) {
    const rawStartupParameter = payload.rawStartupParameter;
    const loginData = payload.loginData;

    context.dispatch(rootTypes.ACTION_SET_RAW_STARTUP_PARAMETER, rawStartupParameter)
    context.dispatch(loginTypes.ACTION_LOGIN_FOR_CHILD_WINDOW, loginData)
  },
  /**
   * スタートアップパラメータを設定します
   *
   * @private
   * @param {Context} context
   * @param {RawStartupParamter} rawStartupParameter
   */
  [rootTypes.ACTION_SET_RAW_STARTUP_PARAMETER](context: Context, rawStartupParameter: RawStartupParameter) {
    // スタートアップパラメータ設定
    context.commit(rootTypes.MUTATION_STARTUP, StartupAdapter.fromRawStartupParameter(rawStartupParameter));

    const inParams = context.getters[rootTypes.GETTER_STARTUP]
    context.commit(rootTypes.MUTATION_LANGUAGE, inParams.lang);
  },
  /**
   * ログアウトして、ログイン画面に遷移します startupURLにリダイレクトするため、ストア内のデータをすべて初期化します
   *
   * @param {Context} context
   * @return {Promise<any>}
   */
   [rootTypes.ACTION_LOGOUT_AND_REDIRECT_LOGIN_PAGE](context) {
    const startupUrl = context.getters[rootTypes.GETTER_STARTUP_URL]

    return new Promise((resolve) => {
      context.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          context.dispatch(loginTypes.ACTION_LOGOUT)
            .then(() => this.app.$window.setBeforeUnload(false))
            .then(() => (location.href = startupUrl))
            .finally(() => resolve())
        }))
        .finally(() => {
          // 画面遷移前にローディングフィルタが解除されるので、この処理はいらない
          // どうせ、画面遷移するので
          // context.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false);
          resolve(true)
        })
    })
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
