/* eslint-disable prettier/prettier */
import { Actor, ActorUtils } from '@/store/enum/Actor';

type PagePathInfo = {
  path: string;
  match: (self: PagePathInfo, path: string) => boolean;
  bodyId: string | ((self: PagePathInfo, isLoggedIn: boolean, actor: Actor) => string);
}

/**
 * デフォルトメソッド
 *
 * @class
 */
const Defaults: any = {
  /**
   * パスの比較関数
   *
   * @param {PagePathInfo} self
   * @param {string} path
   * @return {boolean}
   */
  equalsPath(self: PagePathInfo, path: string): boolean {
    return self.path == path;
  },
  /**
   * パスの比較関数
   *
   * @param {PagePathInfo} self
   * @param {boolean} isLoggedIn
   * @param {Actor} actor
   * @return {string}
   */
  getBodyId(self: PagePathInfo, isLoggedIn: boolean, actor: Actor): string {
    switch (actor) {
      case Actor.TESTER:
      case Actor.CHECKER:
      case Actor.TEST_MANAGER:
      case Actor.SYSTEM_MANAGER:
      case Actor.SUPERVISOR:
        return ''

      default:
        throw new Error(`定義されていないアクターが指定されました。(actor=${actor})`);
    }
  },
}

/**
 * @const ページパス情報の連想配列
 */
export const pagePathInfoMap: { [pageName: string] : PagePathInfo } = {
  //========================================
  // 共通ページ
  //========================================
  LOGIN_PAGE: {
    path: '/login',
    match: Defaults.equalsPath,
    bodyId: 'PRE00001',
  },
  REDIRECT_PAGE: {
    path: '/redirect',
    match: Defaults.equalsPath,
    bodyId: '',
  },
  IFRAME_PAGE: {
    path: '/iframe',
    match: Defaults.equalsPath,
    bodyId: '',
  },
  // /alerting/system-errorもこのページとして扱う
  ALERTING_PAGE: {
    path: '/alerting/[^/]+',
    match: (self: PagePathInfo, path: string): boolean => {
      return /^\/alerting\/[^/]+\/?$/.test(path)
    },
    bodyId: '',
  },
  //========================================
  // 受験者
  //========================================
  ENV_SETTING_PAGE: {
    path: '/env-setting',
    match: Defaults.equalsPath,
    bodyId: 'PRE00002',
  },
  IDENTIFICATION_PAGE: {
    path: '/identification',
    match: Defaults.equalsPath,
    bodyId: 'PRE00003',
  },
  AI_IDENTIFICATION_PAGE: {
    path: '/identification-ai',
    match: Defaults.equalsPath,
    bodyId: 'PRE00003',
  },
  EXAMINING_PAGE: {
    path: '/examining',
    match: Defaults.equalsPath,
    bodyId: 'PRE00004',
  },
  EXAM_END_PAGE: {
    path: '/exam-end',
    match: Defaults.equalsPath,
    bodyId: 'PRE00005',
  },
  TERMS_PAGE: {
    path: '/terms',
    match: Defaults.equalsPath,
    bodyId: '',
  },
  // J-testing専用
  CLOSE_PAGE: {
    path: '/close',
    match: Defaults.equalsPath,
    bodyId: '',
  },
  //========================================
  // 監視者/管理者
  //========================================
  MONITORING_PAGE: {
    path: '/monitoring',
    match: Defaults.equalsPath,
    bodyId: 'PRE00006',
  },
  MANAGEMENT_PAGE: {
    path: '/management',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  EXAMINEES_PAGE: {
    path: '/examinees',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  EXAMINEES_DETAIL_PAGE: {
    path: '/examinees/\\d', // パスに受験者IDとか入る場合は正規表現でいい？
    match: (self: PagePathInfo, path: string): boolean => {
      return /^\/examinees\/\d+\/?$/.test(path)
    },
    bodyId: 'PRE00007',
  },
  CHECKERS_MONITORING_PAGE: {
    path: '/checkers/monitoring',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  ANALYSISI_REQUEST_PAGE: {
    path: '/analysis-request',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  ACCESS_LIMIT_PAGE: {
    path: '/access-limit',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  LOGVIEW_PAGE: {
    path: '/logview',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  DELETE_SETTING_PAGE: {
    path: '/delete-setting',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  DELETE_PLAN_PAGE: {
    path: '/delete-plan',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
  LOGINS_PAGE: {
    path: '/logins',
    match: Defaults.equalsPath,
    bodyId: 'PRE00007',
  },
}

type AllowedPage = {
  firstPage: PagePathInfo;
  pageList: PagePathInfo[];
};

/**
 * @const 
 */
const commonAllowdPageList: PagePathInfo[] = [
  pagePathInfoMap.LOGIN_PAGE,
  pagePathInfoMap.REDIRECT_PAGE,
  pagePathInfoMap.IFRAME_PAGE,

  pagePathInfoMap.ALERTING_PAGE,  // TODO: 受験者専用ページだがログインしていない(actor情報を持っていない)状態でも画面遷移できるページなので、共通ページとして扱う
  pagePathInfoMap.TERMS_PAGE,     // TODO: 受験者専用ページだがログインしていない(actor情報を持っていない)状態でも画面遷移できるページなので、共通ページとして扱う
  pagePathInfoMap.CLOSE_PAGE,     // TODO: 受験者専用ページだがログインしていない(actor情報を持っていない)状態でも画面遷移できるページなので、共通ページとして扱う
]
/**
 * @const 許可されたページパス情報の連想配列
 */
const allowedPageMap: { [actor: number/*Actor*/]: AllowedPage } = (function () {
  const make = (actor: Actor): AllowedPage => {
    // 未ログインの場合に許可されている共通ページ

    // TODO : 引き続きactor専用ページ追加
    if (actor === Actor.TESTER) {
      return {
        firstPage: pagePathInfoMap.ENV_SETTING_PAGE, 
        pageList: [
          pagePathInfoMap.ENV_SETTING_PAGE,
          pagePathInfoMap.IDENTIFICATION_PAGE,
          pagePathInfoMap.AI_IDENTIFICATION_PAGE,
          pagePathInfoMap.EXAMINING_PAGE,
          pagePathInfoMap.EXAM_END_PAGE,
          // pagePathInfoMap.TERMS_PAGE, // TODO: 受験者専用ページだがログインしていない(actor情報を持っていない)状態でも画面遷移できるページなので、共通ページとして扱う
          // pagePathInfoMap.CLOSE_PAGE, // TODO: 受験者専用ページだがログインしていない(actor情報を持っていない)状態でも画面遷移できるページなので、共通ページとして扱う
        ].concat(commonAllowdPageList),
      }
    } else if (actor === Actor.CHECKER) {
      return {
        firstPage: pagePathInfoMap.MONITORING_PAGE,
        pageList: [
          pagePathInfoMap.MONITORING_PAGE,
          pagePathInfoMap.EXAMINEES_DETAIL_PAGE,
        ].concat(commonAllowdPageList),
      }
    } else if (actor === Actor.TEST_MANAGER) {
      return {
        firstPage: pagePathInfoMap.EXAMINEES_PAGE,
        pageList: [
          pagePathInfoMap.EXAMINEES_PAGE,
          pagePathInfoMap.EXAMINEES_DETAIL_PAGE,
        ].concat(commonAllowdPageList),
      }
    } else if (actor === Actor.SYSTEM_MANAGER) {
      return {
        firstPage: pagePathInfoMap.MANAGEMENT_PAGE,
        pageList: [
          pagePathInfoMap.MANAGEMENT_PAGE,
          pagePathInfoMap.EXAMINEES_PAGE,
          pagePathInfoMap.EXAMINEES_DETAIL_PAGE,
          pagePathInfoMap.CHECKERS_MONITORING_PAGE,
          pagePathInfoMap.ACCESS_LIMIT_PAGE,
          pagePathInfoMap.LOGVIEW_PAGE,
          pagePathInfoMap.DELETE_SETTING_PAGE,
          pagePathInfoMap.DELETE_PLAN_PAGE,
          pagePathInfoMap.LOGINS_PAGE,
        ].concat(commonAllowdPageList),
      }
    } else if (actor === Actor.SUPERVISOR) {
      return {
        firstPage: pagePathInfoMap.MANAGEMENT_PAGE,
        pageList: [
          pagePathInfoMap.MANAGEMENT_PAGE,
          pagePathInfoMap.EXAMINEES_PAGE,
          pagePathInfoMap.EXAMINEES_DETAIL_PAGE,
          pagePathInfoMap.CHECKERS_MONITORING_PAGE,
          pagePathInfoMap.ACCESS_LIMIT_PAGE,
          pagePathInfoMap.LOGVIEW_PAGE,
          pagePathInfoMap.DELETE_SETTING_PAGE,
          pagePathInfoMap.DELETE_PLAN_PAGE,
          pagePathInfoMap.LOGINS_PAGE,
        ].concat(commonAllowdPageList),
      }
    }
    throw new Error(`定義されていないアクターが指定されました。(actor=${actor})`);
  }

  const result: {[actor: number/*Actor*/]: AllowedPage} = {};
  ActorUtils.getList()
    .forEach(actor => {
      result[actor as number] = make(actor);
    })
  return result;
}())

export const PagePath: {[pageName: string]: string} = (function () {
  const result: {[pageName: string]: string} = {};
  Object.entries(pagePathInfoMap)
    .forEach(([key, value]) => {
      result[key] = value.path;
    })
  return result;
}())

export class PagePathUtils {
  /**
   * ログイン後のページパスを取得します
   *
   * @param {Actor} actor
   * @return {string}
   */
  public static getFirstPagePath(actor: Actor): string {
    const allowedPage = allowedPageMap[actor];
    return allowedPage.firstPage.path;
  }

  /**
   * 指定のパスが許可されたパスか調べます
   *
   * @param {boolean} isLoggedIn
   * @param {Actor | null} actor
   * @param {string} currentPath
   * @return {boolean}
   */
  public static isAllowedPage(isLoggedIn: boolean, actor: Actor | null, currentPath: string): boolean {
    if (! isLoggedIn) {
      // 未ログインの場合
      return commonAllowdPageList.some((pagePathInfo: PagePathInfo) => pagePathInfo.match(pagePathInfo, currentPath))
    } else {
      // ログイン済みの場合
      const allowedPage = allowedPageMap[actor as Actor];
      if (! allowedPage) {
        throw new Error(`定義されていないアクターが指定されました。(actor=${actor})`);
      }

      return allowedPage.pageList.some((pagePathInfo: PagePathInfo) => pagePathInfo.match(pagePathInfo, currentPath))
    }
  }

  /**
   * 指定のパスの<body>タグのIDを取得します
   *
   * @param {boolean} isLoggedIn
   * @param {Actor | null} actor
   * @param {string} currentPath
   * @return {boolean}
   */
  public static getBodyId(isLoggedIn: boolean, actor: Actor | null, currentPath: string): string {
    const pagePathInfo = Object.values(pagePathInfoMap).find((pagePathInfo) => pagePathInfo.match(pagePathInfo, currentPath)) as PagePathInfo
    if(pagePathInfo) {
      if (pagePathInfo.bodyId instanceof Function) {
        return (pagePathInfo.bodyId as Function)(pagePathInfo, isLoggedIn, actor)
      } else {
        return pagePathInfo.bodyId
      }
    }
    return ''
  }
}
