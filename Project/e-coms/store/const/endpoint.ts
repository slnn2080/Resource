/* eslint-disable prefer-const */

/* eslint-disable prettier/prettier */
// const envSet = require(`@/env/env.${process.env.NODE_ENV || 'development'}.js`);
import { Context } from '@nuxt/types';
import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import * as startupAdapter from '@/store/types/adapters/startupAdapter';
import * as logReceiveAdapter from '@/store/types/adapters/logReceiveAdapter';
import * as loginTypes from '@/store/types/loginType';
import { AccessTokenWithActor } from '@/store/types/adapters/loginAdapter';

type EndpointFuncOptions = {
  context: Context;
}
/** @type レスポンスがエラーか調べる関数の型 */
type IsResponseSuccess = (response: AxiosResponse<any>, options: EndpointFuncOptions) => boolean;
/** @type リクエストのログを残すかデバッグレベルから判断します */
type IsLoggingRequest = (isDebug: startupAdapter.IsDebug, config: AxiosRequestConfig, options: EndpointFuncOptions) => boolean;
/** @type レスポンスのログを残すかデバッグレベルから判断します */
type IsLoggingSuccessResponse = (isDebug: startupAdapter.IsDebug, response: AxiosResponse<any>, options: EndpointFuncOptions) => boolean;
/** @type レスポンスのログを残すかデバッグレベルから判断します */
type IsLoggingErrorResponse = (isDebug: startupAdapter.IsDebug, response: AxiosResponse<any>, options: EndpointFuncOptions) => boolean;
/** @type レスポンスのログを残すかデバッグレベルから判断します */
type IsLoggingError = (isDebug: startupAdapter.IsDebug, error: AxiosError<any>, options: EndpointFuncOptions) => boolean;
/** @type ログAPIのdetailフィールド用の文字列を生成する関数の型 */
type ToDetailFromRequestConfig = (config: AxiosRequestConfig, options: EndpointFuncOptions) => string;
type ToDetailFromResponse = (response: AxiosResponse<any>, options: EndpointFuncOptions) => string;
type ToDetailFromError = (error: AxiosError<any>, options: EndpointFuncOptions) => string;

/** @type エンドポイント情報の型 */
export type EndpointType = {
  url: string;
  apiType: string;
  isLogging: boolean;
  isLoggingRequest: IsLoggingRequest;
  isLoggingSuccessResponse: IsLoggingSuccessResponse;
  isLoggingErrorResponse: IsLoggingErrorResponse;
  isLoggingError: IsLoggingError;
  isResponseSuccess: IsResponseSuccess;
  toDetailFromRequestConfig: ToDetailFromRequestConfig;
  toDetailFromResponse: ToDetailFromResponse;
  toDetailFromError: ToDetailFromError;
};

/**
 * デフォルトメソッド
 *
 * @class
 */
const Defaults: any = {
  /**
   * デバッグレベルからリクエストのログを取るか調べます
   *
   * @param {startupAdapter.IsDebug} isDebug
   * @param {AxiosRequestConfig} config
   * @param {EndpointFuncOptions} options
   * @return {boolean}
   */
  isLoggingRequest(isDebug: startupAdapter.IsDebug, config: AxiosRequestConfig, options: EndpointFuncOptions): boolean {
    if (!isDebug) {
      return false;
    }

    return (isDebug >= 3);
  },

  /**
   * デバッグレベルから成功レスポンスのログを取るか調べます
   *
   * @param {startupAdapter.IsDebug} isDebug
   * @param {AxiosResponse<any>} response
   * @param {EndpointFuncOptions} options
   * @return {boolean}
   */
  isLoggingSuccessResponse(isDebug: startupAdapter.IsDebug, response: AxiosResponse<any>, options: EndpointFuncOptions): boolean {
    if (!isDebug) {
      return false;
    }

    return (isDebug >= 3);
  },

  /**
   * デバッグレベルから失敗レスポンスのログを取るか調べます
   *
   * @param {startupAdapter.IsDebug} isDebug
   * @param {AxiosResponse<any>} response
   * @param {EndpointFuncOptions} options
   * @return {boolean}
   */
  isLoggingErrorResponse(isDebug: startupAdapter.IsDebug, response: AxiosResponse<any>, options: EndpointFuncOptions): boolean {
    if (!isDebug) {
      return false;
    }

    return (isDebug >= 1);
  },

  /**
   * デバッグレベルから失敗レスポンスのログを取るか調べます
   *
   * @param {startupAdapter.IsDebug} isDebug
   * @param {AxiosError<any>} error
   * @param {EndpointFuncOptions} options
   * @return {boolean}
   */
  isLoggingError(isDebug: startupAdapter.IsDebug, error: AxiosError<any>, options: EndpointFuncOptions): boolean {
    if (!isDebug) {
      return false;
    }

    return (isDebug >= 1);
  },

  /**
   * レスポンスがエラーか調べます
   *
   * @param {AxiosResponse<any>} response
   * @param {EndpointFuncOptions} options
   * @return {boolean}
   */
  isResponseSuccess(response: AxiosResponse<any>, options: EndpointFuncOptions): boolean {
    if (response.status != 200) {
      return false;
    }
    if (response.data && response.data.status != 200) {
        return false;
    }
    return true;
  },

  /**
   * ログAPIのdetailフィールド用の文字列を生成します
   *
   * @param {AxiosRequestConfig} config
   * @param {EndpointFuncOptions} options
   * @return {string}
   */
  toDetailFromRequestConfig(config: AxiosRequestConfig, options: EndpointFuncOptions): string {
    const data:any = 
      config.params != null
        ? typeof config.params === 'string'
        　　? config.params
            : JSON.stringify(config.params)
        : config.data != null
          ? typeof config.data === 'string'
            ? config.data
            : JSON.stringify(config.data)
          : '';
    const detail:string = data.slice(0, logReceiveAdapter.DETAILS_MAX_LENGTH) || 'detail is empty!!'; // detailが空文字の場合,logging.phpがエラーになるので何かを送る
    return detail;
  },

  /**
   * ログAPIのdetailフィールド用の文字列を生成します
   *
   * @param {AxiosResponse<any>} response
   * @param {EndpointFuncOptions} options
   * @return {string}
   */
  toDetailFromResponse(response: AxiosResponse<any>, options: EndpointFuncOptions): string {
    const data:any = response.data || null;
    const detail:string = JSON.stringify(data).slice(0, logReceiveAdapter.DETAILS_MAX_LENGTH) || 'detail is empty!!'; // detailが空文字の場合,logging.phpがエラーになるので何かを送る
    return detail;
  },

  /**
   * ログAPIのdetailフィールド用の文字列を生成します
   *
   * @param {AxiosError<any>} error
   * @param {EndpointFuncOptions} options
   * @return {string}
   */
  toDetailFromError(error: AxiosError<any>, options: EndpointFuncOptions): string {
    const data:string = error.response?.data || null;
    const detail:string = JSON.stringify(data).slice(0, logReceiveAdapter.DETAILS_MAX_LENGTH) || 'detail is empty!!'; // detailが空文字の場合,logging.phpがエラーになるので何かを送る
    return detail;
  },
};

/** @const APIの何か */
const valSet: string = '.php';

/** @const APIの何か */
export const Endpoint: {[key:string]: EndpointType} = {
  // プロクター起動処理
  START_UP: {
    url: '/api/v1/startup' + valSet,
    apiType: 'startup',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // チェッカー画面
  CHECKER: {
    url: '/checker/',
    apiType: 'checker',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // プロクターログイン処理
  LOGIN: {
    url: '/api/v1/login' + valSet,
    apiType: 'login',
    isLogging: true,
    isLoggingRequest: () => false,
    isLoggingSuccessResponse: (isDebug: startupAdapter.IsDebug, response: AxiosResponse<any>, options: EndpointFuncOptions) => {
      // TODO: ログインAPIのストアで値を格納するのが本来の流れだが、その前にログAPIを投げたいので、無理やり。お作法としては、最悪なコードです^^
      const context = options.context
      context.store.dispatch(loginTypes.ACTION_SET_ACCESS_TOKEN_WITH_ACTOR, {
        accessToken: response.data.result.access_token,
        actor: response.data.result.actor,
      } as AccessTokenWithActor)

      return Defaults.isLoggingSuccessResponse(isDebug, response)
    },
    isLoggingErrorResponse: () => false,
    isLoggingError: () => false,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // プロクターログアウト処理
  LOGOUT: {
    url: '/api/v1/logout' + valSet,
    apiType: 'logout',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: (isDebug: startupAdapter.IsDebug, response: AxiosResponse<any>, options: EndpointFuncOptions) => {
      // ログアウト成功の場合は、ログAPIを叩くと失敗するのでログは残せない
      return false
    },
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 動作・監査ログ処理
  LOG_RECEIVE: {
    url: '/api/v1/log_receive' + valSet,
    apiType: 'log_receive',
    isLogging: false,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // カメラ情報をサーバー側に渡す処理
  DEVICE_LOGGING: {
    url: '/api/v1/device_logging' + valSet,
    apiType: 'device_logging',
    isLogging: false,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者と監視者のマッチング処理
  MATCHING: {
    url: '/api/v1/matching' + valSet,
    apiType: 'matching',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者マッチング解除
  DELETE_MATCHING: {
    url: '/api/v1/delete_matching' + valSet,
    apiType: 'delete_matching',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // KVS再接続
  KVS_RECONNECT: {
    url: '/api/v1/kvs_reconnect' + valSet,
    apiType: 'kvs_reconnect',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 試験開始・終了処理(MC+)
  EXAM_STATUS: {
    url: '/api/v1/exam/status' + valSet,
    apiType: 'exam/status',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 試験開始・終了処理
  TEST_STATUS: {
    url: '/api/v1/test/status' + valSet,
    apiType: 'tester-status',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者情報取得処理
  TESTER: {
    url: '/api/v1/tester' + valSet,
    apiType: 'tester',
    isLogging: true,
    isResponseSuccess: Defaults.isResponseSuccess,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者ステータス更新処理
  TESTER_STATUS: {
    url: '/api/v1/tester/status' + valSet,
    apiType: 'tester/status',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 録画開始処理[post], 録画ステータス取得処理[get], 録画終了処理[post]
  TESTER_RECORDING: {
    url: '/api/v1/tester/recording' + valSet,
    apiType: 'tester/recording',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 録画データ復旧
  TESTER_RECORD_RECOVERY: {
    url: '/api/v1/recovery' + valSet,
    apiType: 'recovery',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 動画URI取得
  TESTER_RECORD_URI: {
    url: '/api/v1/get_onetime_uri' + valSet,
    apiType: 'get_onetime_uri',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 不正箇所マーキング処理
  TESTER_MARKINGS: {
    url: '/api/v1/tester/markings' + valSet,
    apiType: 'tester/markings',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 不正疑惑行為サマリ取得処理
  TEST_MARKINGS: {
    url: '/api/v1/test/markings' + valSet,
    apiType: 'test/markings',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者一覧取得処理
  TESTERS: {
    url: '/api/v1/testers' + valSet,
    apiType: 'testers',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者一覧ダウンロード
  DOWNLOAD_EXAM_USER_LIST: {
    url: '/api/v1/downloadExamUserList' + valSet,
    apiType: 'downloadExamUserList',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者詳細取得処理
  TESTER_DETAIL: {
    url: '/api/v1/tester/detail' + valSet,
    apiType: 'tester/detail',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // デバイストークン登録処理
  SET_DEVICE_TOKEN: {
    url: '/api/v1/set_device_token' + valSet,
    apiType: 'set_device_token',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 本人画像登録処理
  TESTER_HEAD_SHOT: {
    url: '/api/v1/tester/head_shot' + valSet,
    apiType: 'tester/head_shot',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // MC+起動処理
  GET_MC_TOKEN: {
    url: '/api/v1/get_mc_token' + valSet,
    apiType: 'get_mc_token',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者強制退出
  TESTER_KICK_OUT: {
    url: '/api/v1/tester/kick_out' + valSet,
    apiType: 'tester/kick_out',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 受験者一覧検索項目取得処理
  TESTERS_CONDITIONS: {
    url: '/api/v1/testers/conditions' + valSet,
    apiType: 'testers/conditions',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 試験合否情報書換処理
  TEST_PASS: {
    url: '/api/v1/test/pass' + valSet,
    apiType: 'test/pass',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 監視者マッチング状況
  CHECKERS_MONITORING: {
    url: '/api/v1/checkers/monitoring' + valSet,
    apiType: 'checkers/monitoring',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // マッチング履歴取得
  MATCHING_HISTORIES: {
    url: '/api/v1/checkers/matching_histories' + valSet,
    apiType: 'checkers_matching_histories',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 本人認証
  TESTER_REJECTED: {
    url: '/api/v1/tester/rejected' + valSet,
    apiType: 'tester/rejected',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // WebRTCメッセージ通知
  WEBRTC_MESSAGE: {
    url: '/api/v1/webrtc_message' + valSet,
    apiType: 'webrtc_message',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 固定文言発言リスト取得処理
  FIXED_NOTIFICATIONS: {
    url: '/api/v1/fixed_notifications' + valSet,
    apiType: 'fixed_notifications',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // モニター割り当て制御処理
  MONITOR_ACTIVATE: {
    url: '/api/v1/tester/monitor_activate' + valSet,
    apiType: 'tester/monitor_activate',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // モニター割り当てリスト取得処理
  MONITOR_ACTIVATE_LIST: {
    url: '/api/v1/tester/monitor_activate_list' + valSet,
    apiType: 'tester/monitor_activate_list',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // マークリスト取得処理
  MARKS: {
    url: '/api/v1/marks' + valSet,
    apiType: 'marks',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 顔画像送信処理
  FACE: {
    url: '/api/v1/ai_auth/face' + valSet,
    apiType: 'ai_auth/face',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 身分証画像送信処理
  ID_CARD: {
    url: '/api/v1/ai_auth/id_card' + valSet,
    apiType: 'ai_auth/id_card',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // AI本人認証 - ステータス取得処理
  AI_AUTH_STATUS: {
    url: '/api/v1/ai_auth/status' + valSet,
    apiType: 'ai_auth/status',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 初管理画初期化情報
  MANAGEMENT_INITIAL_PARAM: {
    url: '/api/v1/management_initial_param.php',
    apiType: 'management_initial_param',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 管理画面サマリー情報取得
  MANAGEMENT_SUMMARY: {
    url: '/api/v1/management_summary' + valSet,
    apiType: 'management_summary',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // AI解析依頼初期パラメータ取得処理
  ANALYSIS_REQUEST_INITIAL_PARAM: {
    url: '/api/v1/analysis_request/initial_param' + valSet,
    apiType: 'analysis_request/initial_param',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // AI解析依頼処理
  ANALYSIS_REQUEST_REQUEST: {
    url: '/api/v1/analysis_request/request' + valSet,
    apiType: 'analysis_request/request',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // AI解析情報取得処理
  ANALYSIS_REQUEST_INDEX: {
    url: '/api/v1/analysis_request/index' + valSet,
    apiType: 'analysis_request/index',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // アクセス制限/SELECT
  ACCESS_LIMIT_SELECT: {
    url: '/api/v1/access_limit/select_access_limit' + valSet,
    apiType: 'access_limit/select_access_limit',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // アクセス制限/INSERT
  ACCESS_LIMIT_INSERT: {
    url: '/api/v1/access_limit/insert_access_limit' + valSet,
    apiType: 'access_limit/insert_access_limit',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // アクセス制限/DELETE
  ACCESS_LIMIT_DELETE: {
    url: '/api/v1/access_limit/delete_access_limit' + valSet,
    apiType: 'access_limit/delete_access_limit',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // ログインリスト取得
  LOGINS: {
    url: '/api/v1/logins' + valSet,
    apiType: 'logins',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 削除予定CSVダウンロード
  DELETE_PLAN_DOWNLOAD: {
    url: '/api/v1/cleaner/csv.php',
    apiType: '/api/v1/cleaner/csv.php',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 削除設定 一覧
  DELETE_SETTING_INDEX: {
    url: '/api/v1/cleaner/setting_index.php',
    apiType: '/api/v1/cleaner/setting_index.php',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 削除設定 新規追加
  DELETE_SETTING_STORE: {
    url: '/api/v1/cleaner/setting_store.php',
    apiType: '/api/v1/cleaner/setting_store.php',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 削除設定 更新
  DELETE_SETTING_UPDATE: {
    url: '/api/v1/cleaner/setting_update.php',
    apiType: '/api/v1/cleaner/setting_update.php',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 短縮URL SELECT
  SELECT_SHORTEN_URL: {
    url: '/api/v1/shorten_url/select_shorten_url.php',
    apiType: 'shorten_url/select_shorten_url',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 短縮URL UPDATE
  UPDATE_SHORTEN_URL: {
    url: '/api/v1/shorten_url/update_shorten_url.php',
    apiType: 'shorten_url/update_shorten_url',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 短縮URL INSERT
  INSERT_SHORTEN_URL: {
    url: '/api/v1/shorten_url/insert_shorten_url.php',
    apiType: 'shorten_url/insert_shorten_url',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // 短縮URL DELETE
  DELETE_SHORTEN_URL: {
    url: '/api/v1/shorten_url/delete_shorten_url.php',
    apiType: 'shorten_url/delete_shorten_url',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
  // メニュー表示許可チェック
  PROCTOR_ADMIN_PERMISSION_IP: {
    url: '/api/v1/admin_permission.php',
    apiType: 'admin_permission',
    isLogging: true,
    isLoggingRequest: Defaults.isLoggingRequest,
    isLoggingSuccessResponse: Defaults.isLoggingSuccessResponse,
    isLoggingErrorResponse: Defaults.isLoggingErrorResponse,
    isLoggingError: Defaults.isLoggingError,
    isResponseSuccess: Defaults.isResponseSuccess,
    toDetailFromRequestConfig: Defaults.toDetailFromRequestConfig,
    toDetailFromResponse: Defaults.toDetailFromResponse,
    toDetailFromError: Defaults.toDetailFromError,
  },
};
