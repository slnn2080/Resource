/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from '@nuxt/types';
import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as loginTypes from '@/store/types/loginType';
import * as logReceiveAdapter from '@/store/types/adapters/logReceiveAdapter';
import * as logReceiveTypes from '@/store/types/logReceiveType';
import * as testerPageTypes from '@/store/types/testerPageType';
import { Endpoint, EndpointType } from '@/store/const/endpoint';
import { Formatter } from '@/utils/Formatter';
import { pagePathInfoMap } from '@/store/enum/pageTransition';
import { Actor } from '@/store/enum/Actor';

export default function(context: Context) {
  /** @see https://axios.nuxtjs.org/helpers */

  const endpointFuncOptions = {
    context: context,
  };

  /*
   * リクエスト発効前に発火するイベントのハンドラ設定
   */
  context.$axios.onRequest((config: AxiosRequestConfig) => {
    const token = context.store.getters[loginTypes.GETTER_GET_ACCESS_TOKEN];
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`;
    }

    // APIリクエストのログに保存します。
    Utils.saveRequestLog(config);
  });

  /*
   * 成功リクエスト取得時に発火するイベントのハンドラ設定
   */
  context.$axios.onResponse((response: AxiosResponse<any>) => {
    // APIリクエストのログに保存します。
    Utils.saveResponseLog(response);

    // ネットワーク:OK
    context.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_SET_DISCONNECT, false)
  });

  /*
   * エラーが発生した際に発火するイベントのハンドラ設定
   */
  context.$axios.onError((error: AxiosError<any>) => {
    // APIリクエストのログに保存します。
    Utils.saveErrorLog(error);

    // ネットワーク:エラー
    if (error.message == 'Network Error') {
      context.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_SET_DISCONNECT, true)
    }

    // エラーが発生した場合の処理
    if (error.response && error.response.status === 500) {
      // ログAPIの失敗の場合は、システムエラーに飛ばさない
      const config:AxiosRequestConfig = error.config;
      const url:string = config.url as string;
      const found = Utils.findEndpoint(url);
      if (found === Endpoint.LOG_RECEIVE) {
        return;
      }

      // 受験者以外はシステムエラーに飛ばさない
      const inParams = context.store.getters[rootTypes.GETTER_STARTUP];
      if (inParams.actor != Actor.TESTER) {
        return
      }

      // 受験システム(MC+ or 外部試験)にログインしている状態ではシステムエラーに飛ばさない
      // 「受験者」以外はこのフラグは立たないので影響はない
      const isLoggedInTestSystem = context.store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_LOGGED_IN_TEST_SYSTEM];
      if (isLoggedInTestSystem) {
        return;
      }

      console.error('[Axios global onError]: do something');
      /////////////////////////////AI本認証エラー画面 del
      /// ------------------------------AI蓋開け：コメント外す
      context.app.router?.replace('/alerting/system-error');
    }
  });

  /**
   * ユーティリティ
   *
   * @class
   */
  class Utils
  {
    /**
     * リクエストログをサーバに保存します
     *
     * @param {AxiosRequestConfig} config
     */
    public static saveRequestLog(config: AxiosRequestConfig): Promise<logReceiveAdapter.LogReceiveAdapter>
    {
      const startup: StartupAdapter = context.store.getters[rootTypes.GETTER_STARTUP];

      const url:string = config.url as string;
      const found = Utils.findEndpoint(url);
      if (
        !found
        || !found.isLogging
        || !found.isLoggingRequest(startup.isDebug, config, endpointFuncOptions)
      ) {
        return Promise.resolve(new logReceiveAdapter.LogReceiveAdapter());
      }

      return context.store.dispatch(logReceiveTypes.ACTION_POST_LOG_RECEIVE, {
        type: logReceiveAdapter.LogReceiveType.TRACE,
        path: url,
        module: 'front-api',
        location: 'in',
        details: found.toDetailFromRequestConfig(config, endpointFuncOptions),
        timestamp: Utils.dateFormat(new Date()),
      } as logReceiveAdapter.LogReceiveRequestType);
    }

    /**
     * レスポンス成功ログをサーバに保存します
     *
     * @param {AxiosResponse} Request
     */
    public static saveResponseLog(response: AxiosResponse<any>): Promise<logReceiveAdapter.LogReceiveAdapter>
    {
      const startup: StartupAdapter = context.store.getters[rootTypes.GETTER_STARTUP];

      const config:AxiosRequestConfig = response.config;
      const url:string = config.url as string;
      const found = Utils.findEndpoint(url);
      if (
        !found
        || !found.isLogging
      ) {
        return Promise.resolve(new logReceiveAdapter.LogReceiveAdapter());
      }
      if (found.isResponseSuccess(response, endpointFuncOptions)) {
        // APIの戻り値が成功の場合
        if (!found.isLoggingSuccessResponse(startup.isDebug, response, endpointFuncOptions)) {
          return Promise.resolve(new logReceiveAdapter.LogReceiveAdapter());
        }
        return context.store.dispatch(logReceiveTypes.ACTION_POST_LOG_RECEIVE, {
          type: logReceiveAdapter.LogReceiveType.TRACE,
          path: url,
          module: 'front-api',
          location: 'out/success',
          details: found.toDetailFromResponse(response, endpointFuncOptions),
          timestamp: Utils.dateFormat(new Date()),
        } as logReceiveAdapter.LogReceiveRequestType);
      } else {
        // APIの戻り値がエラーの場合
        if (!found.isLoggingErrorResponse(startup.isDebug, response, endpointFuncOptions)) {
          return Promise.resolve(new logReceiveAdapter.LogReceiveAdapter());
        }
        return context.store.dispatch(logReceiveTypes.ACTION_POST_LOG_RECEIVE, {
          type: logReceiveAdapter.LogReceiveType.TRACE,
          path: url,
          module: 'front-api',
          location: 'out/error',
          details: found.toDetailFromResponse(response, endpointFuncOptions),
          timestamp: Utils.dateFormat(new Date()),
        } as logReceiveAdapter.LogReceiveRequestType);
      }
    }

    /**
     * レスポンスログをサーバに保存します
     *
     * @param {AxiosError<any>} error
     */
    public static saveErrorLog(error: AxiosError<any>): Promise<logReceiveAdapter.LogReceiveAdapter>
    {
      const startup: StartupAdapter = context.store.getters[rootTypes.GETTER_STARTUP];

      const config:AxiosRequestConfig = error.config;
      const url:string = config.url as string;
      const found = Utils.findEndpoint(url);
      if (
        !found
        || !found.isLogging
        || !found.isLoggingError(startup.isDebug, error, endpointFuncOptions)
      ) {
        return Promise.resolve(new logReceiveAdapter.LogReceiveAdapter());
      }

      return context.store.dispatch(logReceiveTypes.ACTION_POST_LOG_RECEIVE, {
        type: logReceiveAdapter.LogReceiveType.ERROR,
        path: url,
        module: 'front-api',
        location: 'out/error',
        details: found.toDetailFromError(error, endpointFuncOptions),
        timestamp: Utils.dateFormat(new Date()),
      } as logReceiveAdapter.LogReceiveRequestType);
    }

    /**
     * urlからEndpointの情報を取得します
     *
     * @param {string} url
     * @return {Endpoint | null}
     */
    public static findEndpoint(url: string): EndpointType | null {
      return Object.values(Endpoint).find(v => v.url === url) as EndpointType | null;
    }

    /**
     * Dateをフォーマット文字列に変換します
     *
     * @param {Date} datetime
     * @return {string}
     */
    private static dateFormat(datetime: Date): string {
      return Formatter.date('yyyy-MM-dd hh:mm:ss', datetime);
    }
  }
}
