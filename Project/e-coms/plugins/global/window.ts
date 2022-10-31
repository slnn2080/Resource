import { Plugin, Context } from '@nuxt/types';
import Vue from 'vue';
import {LanguageEnum} from '@/store/enum/language';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import * as rootTypes from '@/store/types/rootType';
import * as commonTypes from '@/store/types/commonType';
import * as loginTypes from '@/store/types/loginType';
import {
  KickOutMethod,
  TesterKickOutRequestType,
} from '@/store/types/adapters/testerKickOutAdapter';
import * as testerKickOutTypes from '@/store/types/testerKickOutType';

declare module 'vue/types/vue' {
  interface Vue {
    $window: Window;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $window: Window;
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $window: Window;
  }
}

/** @type */
export enum LogoutMethod {
  NONE = 0,                 // ログアウトをしない
  LOGOUT,                   // 通常のログアウト処理
  KICK_OUT_PUT_MYSELF,      // (受験者専用)キックアウト
  KICK_OUT_PUT_MYSELF_AI,   // (受験者専用)キックアウト(AI)
}

/** @type */
export type WindowHandler = {
  onPreWindowClose?: () => Promise<boolean>;
}

/**
 *
 *
 * @class
 */
class Window
{
  private handlers: WindowHandler[] = [];
  private isBeforeUnload_: boolean = false;

  public constructor(
    public context: Context,
  ) {}

  /**
   * 新しいウィンドウでアプリを開きます
   *
   * @param {string} url 遷移先のパスとクエリを結合した文字列(遷移先とのデータ私はこの文字列のみで行うのがいい。画面遷移前のセットアップが必要ならparamsに入れておくこと)
   * @param {{[key:string]: any}} params url引数以外で必要な情報(本来は不要だが/redirect画面で使用する目的に使ってもいい)
   * @param {string} windowName
   * @param {string} windowFeatures
   * @param {Promise<boolean>}
   */
  public openChildWindow(url: string, params: {[key:string]: any}, windowName: string = '', windowFeatures: string = ''): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const inParams = this.context.store.getters[rootTypes.GETTER_STARTUP]
      const loginData = this.context.store.getters[loginTypes.GETTER_LOGIN]
      const json = {
        rawStartupParameter: StartupAdapter.toRawStartupParameter(inParams),
        loginData: {...loginData},
        url: url,
        params: params,
      }
      const encodedQueries = `?opener=1&json=` + encodeURIComponent(JSON.stringify(json))
      const now = Date.now()
      const newWindowName = windowName ? windowName : '_blank';
      window.open(`${location.protocol}//${location.host}/redirect${encodedQueries}`, newWindowName, windowFeatures)
      resolve(true)
    })
  }

  /**
   * 新しいウィンドウで開いたアプリのスタートアップを行います
   *
   * @return {Promise<{url: string; params: {[key:string]: any}}>}
   */
  public startupChildWindow(): Promise<{url: string; params: {[key:string]: any}}> {
    return new Promise((resolve, reject) => {
      try {
        let decodedQueries = {} as any
        location.search
          .slice(1)
          .split('&')
          .forEach(s => {
            const a = s.split('=')
            decodedQueries[a[0]] = JSON.parse(decodeURIComponent(a[1]))
          })
        if (! decodedQueries.opener) {
          throw new Error('')
        }

        const json = decodedQueries.json
        this.context.store.dispatch(rootTypes.ACTION_STARTUP_FOR_CHILD_WINDOW, {rawStartupParameter: json.rawStartupParameter, loginData: json.loginData})

        resolve({url: json.url, params: json.params})
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * ログアウトして、「ログイン」画面に遷移 or 「/close」画面に遷移 します
   *
   * FIXME: この処理名は妥当ではないので、より適切な名前を付ける必要がある。
   *
   * @param {LogoutMethod} logoutMethod
   * @return {Promise<any>}
   */
  public cleanup(logoutMethod: LogoutMethod): Promise<any> {
    const inParams = this.context.store.getters[rootTypes.GETTER_STARTUP];
    if (inParams.actor == 1) {
      // 受験者

      if (StartupAdapter.isJtStartUp(inParams)) {
        // J-Testing の場合

        return this.moveInternalUrl('/close', logoutMethod)
      } else {
        // J-Testing 以外の場合

        return this.reload(logoutMethod)
      }
    } else {
      // 受験者以外

      return this.reload(logoutMethod)
    }
  }

  /**
   * 指定パスに画面遷移します
   *
   * @param {string} path
   * @param {LogoutMethod} logoutMethod
   * @return {Promise<any>}
   */
  private moveInternalUrl(path: string, logoutMethod: LogoutMethod): Promise<any> {
    return new Promise((resolve) => {
      this.context.store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          this.logout(logoutMethod)
            .finally(() => this.context.app.router?.replace(path)) // TODO: ログアウト処理が成功しても失敗しても処理は継続するためにthenではなくfinally
            .then(() => resolve(true))
        }))
        .finally(() => {
          this.context.store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false)
          resolve(true)
        })
    })
  }

  /**
   * 外部URLへ画面遷移します
   *
   * @param {string} url
   * @param {LogoutMethod} logoutMethod
   * @return {Promise<any>}
   */
  public moveExternalUrl(url: string, logoutMethod: LogoutMethod): Promise<any> {
    return new Promise((resolve) => {
      this.context.store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          this.logout(logoutMethod)
            .finally(() => this.setBeforeUnload(false)) // TODO: ログアウト処理が成功しても失敗しても処理は継続するためにthenではなくfinally
            .then(() => this.doPreWindowClose())
            .then(() => (location.href = url))
            .finally(() => resolve())
        }))
        .finally(() => {
          // TODO: 画面遷移前にローディングフィルタが解除され画面が操作可能になってしまう
          // なのでコメントアウトしておき、画面遷移するまでフィルターをかけ続けた状態にしておく
          // this.context.store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false);
          resolve(true)
        })
    })
  }

  /**
   * ウィンドウを閉じます
   *
   * @param {LogoutMethod} logoutMethod
   * @return {Promise<any>}
   */
  public close(logoutMethod: LogoutMethod): Promise<any> {
    return new Promise((resolve) => {
      this.context.store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
        .then(() => new Promise((resolve, reject) => {
          this.logout(logoutMethod)
            .finally(() => this.setBeforeUnload(false)) // TODO: ログアウト処理が成功しても失敗しても処理は継続するためにthenではなくfinally
            .then(() => this.doPreWindowClose())
            .then(() => window.close())
            .finally(() => resolve())
        }))
        .finally(() => {
          // TODO: 画面遷移前にローディングフィルタが解除され画面が操作可能になってしまう
          // なのでコメントアウトしておき、画面遷移するまでフィルターをかけ続けた状態にしておく
          // this.context.store.dispatch(commonTypes.ACTION_COMMON_SET_LOADING, false);
          resolve(true)
        })
    })
  }

  /**
   * リロードします
   *
   * これは、「ポップアップ」ブロックや「通知」ブロックの画面からのリロード用です。
   *
   * @param {LogoutMethod} logoutMethod
   * @return {Promise<any>}
   */
  public reload(logoutMethod: LogoutMethod): Promise<any> {
    const url = this.context.store.getters[rootTypes.GETTER_STARTUP_URL]

    return this.moveExternalUrl(url, logoutMethod)
  }

  /**
   * 指定ログアウト方法をもとに、ログアウトします
   *
   * @param {LogoutMethod} logoutMethod
   * @return {Promise<any>} 常に成功を返す
   */
  private logout(logoutMethod: LogoutMethod): Promise<any> {
    switch (logoutMethod) {
      case LogoutMethod.NONE:
        return Promise.resolve(true)

      case LogoutMethod.KICK_OUT_PUT_MYSELF:
        return new Promise((resolve) => {
          this.context.store.dispatch(testerKickOutTypes.ACTION_TESTER_KICK_OUT, {method: KickOutMethod.PUT_MYSELF} as TesterKickOutRequestType)
          .finally(() => resolve(true))
        })

      case LogoutMethod.KICK_OUT_PUT_MYSELF_AI:
        return new Promise((resolve) => {
          this.context.store.dispatch(testerKickOutTypes.ACTION_TESTER_KICK_OUT, {method: KickOutMethod.PUT_MYSELF_AI} as TesterKickOutRequestType)
          .finally(() => resolve(true))
        })

      // 指定なしの場合はLogoutMethod.LOGOUTとして扱う
      case LogoutMethod.LOGOUT:
      default:
        return new Promise((resolve) => {
          this.context.store.dispatch(loginTypes.ACTION_LOGOUT)
          .finally(() => resolve(true))
        })
    }
  }

  /**
   * beforeunloadを設定/解除します
   *
   * @param {boolean} payload
   * @return {Promise<boolean>}
   */
  public setBeforeUnload(payload: boolean): Promise<boolean> {
    this.isBeforeUnload_ = payload
    return Promise.resolve(true)
  }

  /**
   * beforeunloadを設定を取得します
   *
   * @return {boolean}
   */
  public isBeforeUnload(): boolean {
    return this.isBeforeUnload_
  }

  /**
   * 「閉じる」処理の前処理を登録します
   *
   * @param {WindowHandler} payload
   */
  public addHandler(payload: WindowHandler) {
    // 多重登録できないようにする
    this.handlers = this.handlers.filter(v => v != payload)

    this.handlers.push(payload)
  }

  /**
   * ハンドラを登録します
   *
   * @param {WindowHandler} payload
   */
  public removeHandler(payload: WindowHandler) {
    this.handlers = this.handlers.filter(v => v != payload)
  }

  /**
   * 「閉じる」処理の前処理を実行します
   *
   */
  private doPreWindowClose() {
    const promises = this.handlers
      .filter((v:WindowHandler) => !!v.onPreWindowClose)
      .map((v:WindowHandler) => v.onPreWindowClose!())
    return Promise.all(promises)
  }

  /**
   * アプリ起動時から終了時まで、画面をスリープさせないようにする処理
   */
  public async startWakeLock() {
    let wakeLock: any = null;

    // スリープ無効にするAPIにリクエストして、有効にしたり無効にしたり、監視する
    const requestWakeLock = async () => {
      try {
        // @ts-ignore
        wakeLock = await navigator.wakeLock.request('screen');

        wakeLock.addEventListener('release', () => {
          console.log('Screen Wake Lock が無効になっています');
        });
        console.log('Screen Wake Lock が有効になっています');
      } catch (err) {
        console.error({err});
      }
    };
    // スリープ無効にするAPIにリクエスト
    await requestWakeLock();

    // 無制限にスリープ無効にする
    let second = 100000
    setInterval(() => {
      second += 100000
    }, 100000)
    // にスリープ無効を無効にする
    window.setTimeout(() => {
      wakeLock.release();
      wakeLock = null;
    }, second * 60)

    // ウィンドウの最小化や、タブの切り替え時の対策。これをしないと上記条件時に、スリープ無効の設定が無効になってしまう。
    const handleVisibilityChange = async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
}

const plugin: Plugin = (context: Context, inject) => {
  const $window = new Window(context)

  window.addEventListener('beforeunload', (event: any) => {
    if ($window.isBeforeUnload()) {
      event.preventDefault();
      event.returnValue = '';
    }
  });

  inject('window', new Window(context))
};
export default plugin
