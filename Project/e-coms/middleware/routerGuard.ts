import { Middleware, Context } from '@nuxt/types';

const routerGuardMiddleware: Middleware = (context: Context) => {
  // do something;
  // TODO : actorによるrouter guard
  // 1 : 受験者用のページのみ遷移許容
  // 2 : 監視者用のページのみ遷移許容
  // 3 : adminのページのみ遷移許容
};

export default routerGuardMiddleware;
