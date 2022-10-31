import { Middleware, Context } from '@nuxt/types';
import * as types from '@/store/types/loginType';

const loginMiddleware: Middleware = (context) => {
  console.log('[Middleware INFO] login auth : ', context);
  if (!context.store.getters[types.GETTER_HAS_ACCESS_TOKEN]) {
    // do something
    console.log('no token');
  }
};

export default loginMiddleware;
