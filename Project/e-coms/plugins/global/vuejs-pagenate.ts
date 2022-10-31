import Vue from 'vue';
import { Plugin } from '@nuxt/types';
import Paginate from 'vuejs-paginate/src/components/Paginate.vue';

// @see https://github.com/lokyoung/vuejs-paginate
Vue.component('Paginate', Paginate)

const vuejsPagenate: Plugin = (context, inject) => {
};

export default vuejsPagenate;
