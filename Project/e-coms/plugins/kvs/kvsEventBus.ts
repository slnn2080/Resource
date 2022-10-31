import { Plugin } from '@nuxt/types';
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $kvsEventBus: Vue;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $kvsEventBus: Vue;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $kvsEventBus: Vue;
  }
}

const kvsEventBusPlugin: Plugin = (context, inject) => {
  inject('kvsEventBus', new Vue());
};
export default kvsEventBusPlugin;
