/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
import { Plugin } from '@nuxt/types';

declare module 'vue/types/vue' {
  interface Context {
    $envSet: string;
  }
}

declare module 'vuex/types/index' {
  interface Context {
    $envSet: string;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $envSet: string;
  }
}

const envSetPlugin: Plugin = (context, inject) => {
  // Setting Envirionment (defule env : development)
  context.$envSet = require(`~/env/env.${process.env.NODE_ENV ||
    'development'}.js`);
};

export default envSetPlugin;
