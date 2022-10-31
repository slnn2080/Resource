/* eslint-disable prettier/prettier */
import { Middleware, Context } from '@nuxt/types';
import * as rootTypes from '@/store/types/rootType';
import * as loginTypes from '@/store/types/loginType';
import StartupAdapter from '@/store/types/adapters/startupAdapter';
import { PagePathUtils } from '@/store/enum/pageTransition';

const guardActorPageMiddleware: Middleware = (context: Context) => {
  const prevPath = context.from.path;
  const currentPath = context.route.path;

  console.log('[Middleware INFO] page guard : ', context);
  if (prevPath === currentPath || !context.isDev) {
    console.error('[Middleware LOG] previous path and current path is same!');
    // window.location.href = '/';
    // context.error({
    //   statusCode: 404,
    //   message: "'F5' リフレッシュは禁止です。"
    // });
  }

  // ログインしているか？
  const isLoggedIn = context.store.getters[loginTypes.GETTER_IS_LOGGED_IN]
  // ログインデータ
  const loginData = context.store.getters[loginTypes.GETTER_LOGIN]
  if (PagePathUtils.isAllowedPage(isLoggedIn, loginData.actor, currentPath)) {
    console.log('[Middleware LOG] correct actor page : ', currentPath);
  } else {
    console.error('[Middleware LOG] incorrect actor page : ', currentPath);
    // window.location.href = '/';
    // context.error({
    //   statusCode: 404,
    //   message: "ページがありません。"
    // });
  }
};

export default guardActorPageMiddleware;
