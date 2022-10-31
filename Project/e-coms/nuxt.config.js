import Vue from 'vue';
// Setting Envirionment (defule env : development)
const envSet = require(`./env/env.${process.env.NODE_ENV || 'development'}.js`);
export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    // title: process.env.npm_package_name || '',
    titleTemplate: '%s | Remote Testing',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'noindex,nofollow' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.6.1/css/all.css'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/styles/common/style.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/global/vue-notifications.ts',
    '~/plugins/global/vee-validate.ts',
    '~/plugins/global/vuejs-pagenate.ts',
    '~/plugins/global/envSet.ts',
    '~/plugins/global/axios.ts',
    '~/plugins/global/modals.ts',
    '~/plugins/global/window.ts',
    '~/plugins/global/mediaDevices.ts',
    '~/plugins/global/htmlElementUtils.ts',
    '~/plugins/kvs/viewer.ts',
    '~/plugins/kvs/master.ts',
    '~/plugins/kvs/kvsEventBus.ts',
    '~/plugins/kvs/checkerMatchingPollinger.ts',
    '~/plugins/kvs/testerMatchingPollinger.ts',
    '~/plugins/s3/upload.ts'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    ['@nuxtjs/moment', ['ja']],
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    'nuxt-user-agent',
  ],
  /**
   ** your settings here
   */
  styleResources: {
    scss: ['./assets/vars/*.scss']
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'bootstrap-vue/nuxt'
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: envSet.API_BASE_URL,
    credentials: false,
    proxy: false
  },
  proxy: {
    '/api/v1/': 'https://sample.mc-plus.jp'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    terser: {
      terserOptions: {
        // production mode autocatically deletes all console.log
        compress: {
          drop_console: envSet.MODE === 'production'
        }
      }
    },
    babel: {
      presets(env, [preset, options]) {
        return [
          [
            '@nuxt/babel-preset-app',
            {
              useBuiltIns: 'usage'
            }
          ]
        ];
      }
    },
    transpile: ['vee-validate/dist/rules'],
    // babel: {
    //   presets({ isServer }) {
    //     const targets = isServer ? { node: 'current' } : { ie: 11 };
    //     return [[require.resolve('@nuxt/babel-preset-app'), { targets }]];
    //   }
    // },

    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      } else if (envSet.MODE === 'staging') {
        config.devtool = 'source-map';
        Vue.config.devtools = true;
      } else if (envSet.MODE === 'production') {
        // do something
      }
    }
  }
};
