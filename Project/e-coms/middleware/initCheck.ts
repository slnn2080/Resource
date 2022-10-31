/* eslint-disable prettier/prettier */
import { Middleware, Context } from '@nuxt/types';
import * as rootTypes from '@/store/types/rootType';
import { PagePathUtils } from '@/store/enum/pageTransition';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { LogoutMethod } from '@/plugins/global/window';
import { startupServiceWorker, isNotificationSupported, askForNPerm, pushMessage } from '@/static/push';


/**
 * スタートアップURLのクエリを取得します
 *
 * @return {string}
 */
function getQuery(): string {
  let query;
  if (true /*! context.isDev */) {
    query = location.search || '?';
    if (query == '?') {
      // context.error({
      //   statusCode: 400,
      //   message: "不正な接続です。「起動パラメータ」がありません。"
      // });
      console.error('[Middleware LOG]: 「起動パラメータ」がありません。', query);
    }
  } else {
    // MC起動：受験生 => LOGIN 必須 - Actor 1 (login_id x , access_token o)
    query =
      '?target=https%3A%2F%2Frp.mc-plus-st.jp&actor=1&is_auth=1&exam_url=http%3A%2F%2Faaaaaaaaaaaaaaaaaaaaa.com&is_mc_startup=1&is_proctor=1&is_record=1&is_summary=1&is_force=1&lang=ja&max_rectime=3600&tester_retry=2&is_mobile=1&matching_timeout=20&intervaltime=100&is_voice_recording=1&video_recording_preference=5&voice_quality_preference=5&is_forget_password=1&target_type=2&memo=%E3%82%81%E3%82%82%E3%82%81%E3%82%82%E3%82%81%E3%82%82%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB&access_token=82dbd59d77fd11a98d416c2fbcda39cd44a754507a3e057bf32157c4a4309262a';

    // JT・MC起動：受験生 => LOGIN なし - Actor 2 (login_id o , access_token o)
    // query = '?login_id=abcd&target=https%3A%2F%2Ftest.remote-testing-st.jp%2Fapi%2Fv1%2Fcheck_fld%2Fauth_jt.php&actor=1&password=abcd12345&is_auth=1&is_mc_startup=1&exam_url=http%3A%2F%2Faaaaaaaaaaaaaaaaaaaaa.com&is_proctor=1&is_record=1&is_summary=1&is_force=1&lang=ja&max_rectime=3600&tester_retry=2&is_mobile=1&matching_timeout=300&webrtc_timeout=300&intervaltime=100&is_voice_recording=1&video_recording_preference=5&voice_quality_preference=5&memo=%E3%82%81%E3%82%82%E3%82%81%E3%82%82%E3%82%81%E3%82%82%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB%E3%83%BB&access_token=85cb43708e4f75a740f9eff2c5c35290efcb2982c8daee5a0fc0f2b0a72588edb&exam_name=JT%E7%94%B0%E4%B8%AD&exam_user_name=JT%E7%94%B0%E4%B8%AD';

    // 試験監視者 : LOGIN必須 - Actor 3 (login_id o , access_token o)
    // query = '?target=https%3A%2F%2Ftest.remote-testing-st.jp%2Fapi%2Fv1%2Fcheck_fld%2Fauth_admin.php&actor=2&lang=ja&max_rectime=3600&checker_retry=2&matching_timeout=300&webrtc_timeout=10000&intervaltime=300';

    // 試験管理者(admin) : LOGIN必須 - Actor 4 (login_id o , access_token o)
    // query = '?target=https%3A%2F%2Ftest.remote-testing-st.jp%2Fapi%2Fv1%2Fcheck_fld%2Fauth_admin.php&actor=3&lang=ja&is_forget_password=1&target_type=1';
  }

  return query
}

/**
 * 画面遷移します
 *
 * @param {Context} context
 * @param {StartupAdapter} inParams
 * @param {string} firstPagePath
 * @param {Promise<any>}
 */
function initTransitionPage(context: Context, inParams: StartupAdapter, firstPagePath: string): Promise<any> {
  return new Promise((resolve) => {
    if (inParams.actor == 1) {
      // 受験者
      if (inParams.isMcStartup == 0) {
        // 外部試験
        const wH = window.screen.availHeight;
        const wW = window.screen.availWidth;
        const wT = 0;  // モニター左下 Top計算
        const wL = 0;  // モニター左下 Left計算
        const wOption = "top=" + wT + ", left=" + wL + ", height=" + wH + ", width=" + wW + ", menubar=no" + ", toolbar=no" + ", location=no" + ", resizable=no" + ", directories=no";
        (context as any).$window.openChildWindow(firstPagePath, {}, '_blank', wOption)
          .finally(() => {
            // 現在のウィンドウを閉じる
            (context as any).$window.close(LogoutMethod.NONE)

            return resolve(true)
          })
      } else {
        // MC+
        return resolve(context.redirect(firstPagePath))
      }
    } else {
      // 管理者 / 監視者
      return resolve(context.redirect(firstPagePath))
    }
  })
}

/** @type */
enum CheckBrowserResult {
  OK = 0,
  NG_NOT_SUPPORTED_OS = 11,
  NG_NOT_SUPPORTED_OS_VERSION = 12,
  NG_NOT_SUPPORTED_BROWSER = 13,
  NG_NOT_SUPPORTED_BROWSER_VERSION = 14,
}

/** @type */
type AllowedBrowserSetting = {
  os: string;
  osVersion: number;
  name: string;
  version: number;
  customCheck?: (setting: AllowedBrowserSetting, browserInfo: BrowserInfo) => CheckBrowserResult;
};

/** @type */
type BrowserInfo = {
  os: string;
  osVersion: number;
  name: string;
  version: number;
};

/** @const */
const allowedBrowserSettings: AllowedBrowserSetting[] = [
  { os: 'Windows', osVersion: 10.0,   name: 'Chrome', version: 80.0 },
  { os: 'Windows', osVersion: 10.0,   name: 'Edge',   version: 80.0 },
  { os: 'Mac',     osVersion: 10.157, name: 'Safari', version: 14.03,
    customCheck: (setting: AllowedBrowserSetting, browserInfo: BrowserInfo): CheckBrowserResult => {
      // TODO: 暫定対応/社内MACでOSバージョンが正しく取れないためこのOSバージョンは通す
      if (
        (browserInfo.osVersion == 10.156) &&
        (browserInfo.version >= setting.version)
      ) {
        return CheckBrowserResult.OK
      }

      if (
        (browserInfo.osVersion < setting.osVersion) ||
        (11 <= browserInfo.osVersion && browserInfo.osVersion < 11.02)
      ) {
        return CheckBrowserResult.NG_NOT_SUPPORTED_OS_VERSION
      }
      if (browserInfo.version < setting.version) {
        return CheckBrowserResult.NG_NOT_SUPPORTED_BROWSER_VERSION
      }

      return CheckBrowserResult.OK
    },
  },
  { os: 'Mac',     osVersion: 10.136, name: 'Chrome', version: 80.0 },
  { os: 'Android', osVersion:  8.0,   name: 'Chrome', version: 80.0 },
  { os: 'iOS',     osVersion: 14.3,   name: 'Safari', version: 11.0 }, // TODO: iOS/iPhoneの場合、OSバージョン=ブラウザバージョン?っぽいので厳密にはチェックしない.必要であればする
  { os: 'iOS',     osVersion: 13.0,   name: 'Chrome', version: 80.0 },
  { os: 'iPadOS',  osVersion: 14.3,   name: 'Safari', version: 11.0 }, // TODO: iOS/iPhoneの場合、OSバージョン=ブラウザバージョン?っぽいので厳密にはチェックしない.必要であればする
  { os: 'iPadOS',  osVersion: 13.0,   name: 'Chrome', version: 80.0 },
];
// 日経用
//const allowedBrowserSettings: AllowedBrowserSetting[] = [
//  { os: 'Windows', osVersion: 10.0,   name: 'Chrome', version: 80.0 },
//  { os: 'Windows', osVersion: 10.0,   name: 'Edge',   version: 80.0 },
//  { os: 'Mac',     osVersion: 10.157, name: 'Safari', version: 14.03,
//    customCheck: (setting: AllowedBrowserSetting, browserInfo: BrowserInfo): CheckBrowserResult => {
//      // TODO: 暫定対応/社内MACでOSバージョンが正しく取れないためこのOSバージョンは通す
//      if (
//        (browserInfo.osVersion == 10.156) &&
//        (browserInfo.version >= setting.version)
//      ) {
//        return CheckBrowserResult.OK
//      }
//
//      if (
//        (browserInfo.osVersion < setting.osVersion) ||
//        (11 <= browserInfo.osVersion && browserInfo.osVersion < 11.02)
//      ) {
//        return CheckBrowserResult.NG_NOT_SUPPORTED_OS_VERSION
//      }
//      if (browserInfo.version < setting.version) {
//        return CheckBrowserResult.NG_NOT_SUPPORTED_BROWSER_VERSION
//      }
//
//      return CheckBrowserResult.OK
//    },
//  },
//  { os: 'Mac',     osVersion: 10.136, name: 'Chrome', version: 80.0 },
//  //{ os: 'Android', osVersion:  8.0,   name: 'Chrome', version: 80.0 },
//  //{ os: 'iOS',     osVersion: 14.3,   name: 'Safari', version: 11.0 }, // TODO: iOS/iPhoneの場合、OSバージョン=ブラウザバージョン?っぽいので厳密にはチェックしない.必要であればする
//  //{ os: 'iOS',     osVersion: 13.0,   name: 'Chrome', version: 80.0 },
//  //{ os: 'iPadOS',  osVersion: 14.3,   name: 'Safari', version: 11.0 }, // TODO: iOS/iPhoneの場合、OSバージョン=ブラウザバージョン?っぽいので厳密にはチェックしない.必要であればする
//  //{ os: 'iPadOS',  osVersion: 13.0,   name: 'Chrome', version: 80.0 },
//];

/**
 * ブラウザチェック処理
 *
 * @return {CheckBrowserResult}
 */
function checkBrowser(): CheckBrowserResult {
  const browserInfo = getBrowserInfo();
  console.log(browserInfo);

  // OSとブラウザの組み合わせを連想配列に変換する
  const map: {[osName: string]: {[browserName: string]: AllowedBrowserSetting}} = {}
  for (let i = 0; i < allowedBrowserSettings.length; i ++) {
    const setting = allowedBrowserSettings[i];

    if (!map[setting.os]) {
      map[setting.os] = {}
    }
    if (map[setting.os][setting.name]) {
      // 設定が複数ある場合はプログラムのエラー
      console.error('allowedBrowserSettingsに同じ設定が存在します!!(os:' + setting.os + ', browser:' + setting.name + ')')
    }
    map[setting.os][setting.name] = setting
  }

  // OSチェック
  if (!map[browserInfo.os]) {
    return CheckBrowserResult.NG_NOT_SUPPORTED_OS
  }

  // ブラウザチェック
  if (!map[browserInfo.os][browserInfo.name]) {
    return CheckBrowserResult.NG_NOT_SUPPORTED_BROWSER
  }

  // OSバージョン & ブラウザバージョン チェック
  const setting = map[browserInfo.os][browserInfo.name];
  if (setting.customCheck) {
    return setting.customCheck(setting, browserInfo)
  } else {
    if (browserInfo.osVersion < setting.osVersion) {
      return CheckBrowserResult.NG_NOT_SUPPORTED_OS_VERSION
    }
    if (browserInfo.version < setting.version) {
      return CheckBrowserResult.NG_NOT_SUPPORTED_BROWSER_VERSION
    }
    return CheckBrowserResult.OK
  }
}

/**
 * Safari表記がないiOSのバージョン文字列を浮動小数点数に変換する
 *
 * @param {string} versionString
 * @returns {number}
 * @private
 */
function toFloatFromVersionStringForNoSafari (userAgent: string): number {
  const result1 = userAgent.split('iPhone OS ')
  const result2 = result1[1].split(' like')
  const result3 = result2[0].split('_')
  const result4 = Number(`${result3[0]}.${result3[1]}`)
  return result4
}

/**
 * バージョン文字列を浮動小数点数に変換する
 *
 * @param {string} versionString
 * @return {number}
 * @private
 */
function toFloatFromVersionString (versionString: string): number {
  const sep = versionString.indexOf('_') !== -1
    ? '_'
    : '.';
  const numbers = versionString.split(sep);
  const major = (numbers.length > 0)
    ? ((numbers.shift() as any) - 0)
    : 0
  const minor:any = (numbers.length > 0)
    ? ((('0.' + numbers.join('')) as any) - 0)
    : 0.0
  return major + minor;
}

/**
 * ユーザエージェント解析用モジュール
 */
const userAgentAnalyzer: any /*{[key:strig] : {[key: string] : (userAgent: string) => number}}*/ = {
  osVersion: (function () {
    const
      template = function (regex: RegExp) {
        return function (userAgent: string) {
          const matched = userAgent.match(regex);
          if (!matched || matched.length <= 1) {
            return 0
          }

          return toFloatFromVersionString(matched[1])
        }
      };

    return {
      windows: function (userAgent: string) {
        // @see http://www9.plala.or.jp/oyoyon/html/script/platform.html

        if (userAgent.match(/Win(dows )?NT 6\.3/)) {
          return 8.1; // Windows 8.1 の処理 (Windows Server 2012 R2)
        }

        return template(/Windows NT ([0-9.]+)/i)(userAgent)
      },
      android: template(/Android ([0-9.]+)/i),
      mac: template(/Mac OS X ([0-9_]+)/i),
      iOS: template(/OS ([0-9_]+) like Mac OS X/i),
      iPadOS: template(/OS ([0-9_]+) like Mac OS X/i),
    }
  }()),
};

/**
 * UAからブラウザの各情報を取得します
 *
 * @return {BrowserInfo}
 */
function getBrowserInfo(): BrowserInfo {
  console.log(navigator.userAgent);

  const userAgent = navigator.userAgent;
  const result: BrowserInfo = {
    os: '',
    osVersion: 0,
    name: '',
    version: 0,
  };

  const match = userAgent.match(/(opera|chrome|crios|safari|ucbrowser|firefox|msie|trident|edge|edg(?=\/))\/?\s*([\d\.]+)/i) || [];

  // iPhoneでsafariが確認されないパターンの対策
  const isiPhone = /iPhone/.test(userAgent)

  // ブラウザ名
  let tem = null;
  if (/trident/i.test(match[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    result.name = 'Internet Explorer';
  } else if (match[1] === 'Chrome') {
    tem = userAgent.match(/\b(OPR|Edge|Edg)\/(\d+)/);
    if (tem && tem[1]) {
      result.name = (tem[0].indexOf('Edge') === 0 || tem[0].indexOf('Edg') === 0) ? 'Edge' : 'Opera';
    }
  } else if (match[1] === 'Safari') {
    result.name = 'Safari';
  } else if (match.length === 0 && isiPhone) {
    result.name = 'Safari';
  }
  if (!result.name) {
    tem = userAgent.match(/version\/(\d+)/i); // iOS support
    result.name = match[0].replace(/\/.*/, '');

    if (result.name.indexOf('MSIE') === 0) {
      result.name = 'Internet Explorer';
    }
    if (userAgent.match('CriOS')) {
      result.name = 'Chrome';
    }
  }

  // ブラウザバージョン
  if (match.length !== 0) {
    if (result.name == 'Safari') {
      var versionMatch = userAgent.match(/version\/([\d\.]+)/i);
      result.version = (versionMatch && versionMatch.length > 1)
        ? toFloatFromVersionString(versionMatch[1])
        : toFloatFromVersionString(match[match.length - 1])
    } else {
      result.version = toFloatFromVersionString(match[match.length - 1]);
    }
  } else {
    if (isiPhone) {
      result.version = toFloatFromVersionStringForNoSafari(userAgent)
    }
  }

  // OS名 / OSバージョン
  if (userAgent.match(/Android/i)) {
    result.os = 'Android';
    result.osVersion = userAgentAnalyzer.osVersion.android(userAgent)
  } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
    result.os = 'iOS';
    result.osVersion = userAgentAnalyzer.osVersion.iOS(userAgent)
  } else if (userAgent.match(/Windows/i)) {
    result.os = 'Windows';
    result.osVersion = userAgentAnalyzer.osVersion.windows(userAgent)
  } else if (userAgent.match(/Macintosh/i)) {
    if (result.name === 'Safari' && typeof document.ontouchstart !== 'undefined') {
      result.os = 'iPadOS';
      result.osVersion = userAgentAnalyzer.osVersion.iPadOS(userAgent)
    } else {
      result.os = 'Mac';
      result.osVersion = userAgentAnalyzer.osVersion.mac(userAgent)
    }
  }

  return result;
}

/**
 * POPUPブロックチェック処理
 *
 * @return {boolean}
 */
function checkPopupBlocker(): boolean {
  const href = '#';
  const popUp = window.open(href, '_blank', 'top=-100,left=-100,width=100,height=100,menubar=no,toolbar=no,location=no,resizable=no,directories=no');
  if (popUp === null || typeof popUp === 'undefined') {
    return false;
  } else {
    popUp.close();
    return true;
  }
}

/**
 * ストレージブロックチェック処理
 *
 * @return {boolean}
 */
function checkStorage(): boolean {
  // localStorage/sessionStorage へダミーデータを書き込み、使用可能かどうかを事前チェックする
  const check = function (storageName: string, dataSize: number): boolean {
    try {
      const storage = (window as any)[storageName] as any

      let data = '';
      if (!data.padStart) {
        while (data.length < dataSize) {
          data = data + 'xxxxxxxxxx';
        }
      } else {
        data = data.padStart(dataSize, 'x');
      }

      let result = true
      try {
        storage.setItem('prepare', data);
      } catch (e) {
        result = false
      }
      try {
        const v = storage.getItem('prepare');
        if (v !== data) {
          throw new Error()
        }
      } catch (e) {
        result = false
      }
      try {
        storage.removeItem('prepare');
      } catch (e) {
        result = false
      }

      return result
    } catch (e) {
      return false
    }
  };
  const dataSize = 2 * 1024 * 1024; // サイズは適当 アプリの要件に合わせて適切に変えること
  const results = [
    check('localStorage', dataSize),
    check('sessionStorage', dataSize),
  ]
  if (results.some((v) => !v)) {
    return false;
  } else {
    return true;
  }
}

/**
 * ブラウザチェック & 初期化
 *
 * @param {Context} context
 */
const initCheckMiddleware: Middleware = (context: Context) => {
  console.log('[Middleware INFO] initialization implementation: ', context);
  let query = getQuery()

  context.store.dispatch(rootTypes.ACTION_STARTUP, query)
  const inParams = context.store.getters[rootTypes.GETTER_STARTUP] as StartupAdapter;

  return startupServiceWorker()
    .then((value: boolean) => {
      if (value) {
        console.log('[LOG INFO] ServiceWorker activity!');
      } else {
        console.error('[LOG INFO] ServiceWorker denied!');
      }
      return Promise.resolve(true)
    })
    .then(() => {
      // 受験者 & 監視者 共通 ブラウザチェック
      const cbResult = checkBrowser()
      if (cbResult !== CheckBrowserResult.OK) {
        const map: {[cbResult: string/*CheckBrowserResult*/]: string} = {}
        map[CheckBrowserResult.NG_NOT_SUPPORTED_OS]              = '/alerting/excluded-os';
        map[CheckBrowserResult.NG_NOT_SUPPORTED_OS_VERSION]      = '/alerting/excluded-os-version';
        map[CheckBrowserResult.NG_NOT_SUPPORTED_BROWSER]         = '/alerting/excluded-browser';
        map[CheckBrowserResult.NG_NOT_SUPPORTED_BROWSER_VERSION] = '/alerting/excluded-browser-version';

        context.redirect(map[cbResult])
        return Promise.reject(new Error('NG! ブラウザチェック'))
      }
      return Promise.resolve(true)
    })
    .then(() => {
      // 受験者 ポップアップチェック
      if (inParams.actor === 1) {
        if (!checkPopupBlocker()) {
          context.redirect('/alerting/popup-block')
          return Promise.reject(new Error('NG! ポップアップチェック'))
        }
      }
      return Promise.resolve(true)
    })
    .then(() => {
      // 受験者 & 監視者 共通 ストレージチェック
      // TODO: $uaがtypescript通らないので暫定処置
      // @ts-ignore
      if (context.$ua.isFromPc()) {
        if (!checkStorage()) {
          context.redirect('/alerting/storage-block')
          return Promise.reject(new Error('NG! ストレージチェック'))
        }
      }
      return Promise.resolve(true)
    })
    .then(() => new Promise((resolve, reject) => {
      // 受験者 通知チェック
      if (inParams.actor === 1) {
        if (! isNotificationSupported()) {
          // TODO: iPhone/iPadについては、通常のNotification()を実装していない、現在動作しない。仕様pending
          // なので通知ブロック確認自体行わない
          return resolve(true)
        } else {
          return askForNPerm()
            .then((result: boolean) => {
              console.log('[LOG INFO]: push permission', result);
                if (!result) {
                  context.redirect('/alerting/notification-block')
                  return reject(new Error('NG! 通知チェック'))
                } else {
                  return resolve(true)
                }
            });
        }
      }
      return resolve(true)
    }))
    .then(() => {
      // 画面遷移
      let firstPagePath: string;
      if (inParams.actor == 1) {
        // 受験者
        if (StartupAdapter.isJtStartUp(inParams)) {
          // J-Testing の場合
          firstPagePath = PagePathUtils.getFirstPagePath(inParams.actor)
        } else {
          // J-Testing 以外の場合
          firstPagePath = '/login'
        }
      } else {
        // 管理者 / 監視者
        firstPagePath = '/login';
      }
      return Promise.resolve(initTransitionPage(context, inParams, firstPagePath))
    })
    .catch((e) => {
      // チェックのreject(new Error())をここで取得しないと、nuxtエラーが出るので握りつぶす

      // 流れとしては、「画面遷移」以外のthen()ブロックでは、NGの場合reject()を返して、ここまで一気に飛ばす
      // すべてresolve()ならば「画面遷移」のthenブロックで終わる。
      // TODO: もっときれいに書く方法はないでしょうか？
    })
};

export default initCheckMiddleware;
