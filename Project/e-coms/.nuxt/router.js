import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0602af44 = () => interopDefault(import('..\\pages\\access-limit\\index.vue' /* webpackChunkName: "pages/access-limit/index" */))
const _08f79190 = () => interopDefault(import('..\\pages\\analysis-request\\index.vue' /* webpackChunkName: "pages/analysis-request/index" */))
const _4ebfc5c6 = () => interopDefault(import('..\\pages\\close\\index.vue' /* webpackChunkName: "pages/close/index" */))
const _1d689a1a = () => interopDefault(import('..\\pages\\create-shorturl\\index.vue' /* webpackChunkName: "pages/create-shorturl/index" */))
const _dafbeb22 = () => interopDefault(import('..\\pages\\create-shorturl-List\\index.vue' /* webpackChunkName: "pages/create-shorturl-List/index" */))
const _28b340d3 = () => interopDefault(import('..\\pages\\delete-plan\\index.vue' /* webpackChunkName: "pages/delete-plan/index" */))
const _b0eaaeb0 = () => interopDefault(import('..\\pages\\delete-setting\\index.vue' /* webpackChunkName: "pages/delete-setting/index" */))
const _b9ad4764 = () => interopDefault(import('..\\pages\\env-setting\\index.vue' /* webpackChunkName: "pages/env-setting/index" */))
const _59504249 = () => interopDefault(import('..\\pages\\exam-end\\index.vue' /* webpackChunkName: "pages/exam-end/index" */))
const _12b3a4e2 = () => interopDefault(import('..\\pages\\examinees\\index.vue' /* webpackChunkName: "pages/examinees/index" */))
const _f73663c0 = () => interopDefault(import('..\\pages\\examining\\index.vue' /* webpackChunkName: "pages/examining/index" */))
const _74ce9a68 = () => interopDefault(import('..\\pages\\identification\\index.vue' /* webpackChunkName: "pages/identification/index" */))
const _5b009677 = () => interopDefault(import('..\\pages\\identification-ai\\index.vue' /* webpackChunkName: "pages/identification-ai/index" */))
const _7974a872 = () => interopDefault(import('..\\pages\\iframe\\index.vue' /* webpackChunkName: "pages/iframe/index" */))
const _2fa513b5 = () => interopDefault(import('..\\pages\\login\\index.vue' /* webpackChunkName: "pages/login/index" */))
const _336445a8 = () => interopDefault(import('..\\pages\\logins\\index.vue' /* webpackChunkName: "pages/logins/index" */))
const _3f29f235 = () => interopDefault(import('..\\pages\\logview\\index.vue' /* webpackChunkName: "pages/logview/index" */))
const _6e071373 = () => interopDefault(import('..\\pages\\management\\index.vue' /* webpackChunkName: "pages/management/index" */))
const _0a7da24e = () => interopDefault(import('..\\pages\\monitoring\\index.vue' /* webpackChunkName: "pages/monitoring/index" */))
const _1376453a = () => interopDefault(import('..\\pages\\redirect\\index.vue' /* webpackChunkName: "pages/redirect/index" */))
const _4eaddad7 = () => interopDefault(import('..\\pages\\terms\\index.vue' /* webpackChunkName: "pages/terms/index" */))
const _269fe748 = () => interopDefault(import('..\\pages\\alerting\\system-error.vue' /* webpackChunkName: "pages/alerting/system-error" */))
const _3d484eb0 = () => interopDefault(import('..\\pages\\checkers\\monitoring\\index.vue' /* webpackChunkName: "pages/checkers/monitoring/index" */))
const _70aab438 = () => interopDefault(import('..\\pages\\alerting\\_id.vue' /* webpackChunkName: "pages/alerting/_id" */))
const _22ab49fc = () => interopDefault(import('..\\pages\\create-shorturl\\_id.vue' /* webpackChunkName: "pages/create-shorturl/_id" */))
const _000b40eb = () => interopDefault(import('..\\pages\\examinees\\_id\\index.vue' /* webpackChunkName: "pages/examinees/_id/index" */))
const _6c9a37fc = () => interopDefault(import('..\\pages\\examinees\\_id\\login.vue' /* webpackChunkName: "pages/examinees/_id/login" */))
const _3d3a0116 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/access-limit",
    component: _0602af44,
    name: "access-limit"
  }, {
    path: "/analysis-request",
    component: _08f79190,
    name: "analysis-request"
  }, {
    path: "/close",
    component: _4ebfc5c6,
    name: "close"
  }, {
    path: "/create-shorturl",
    component: _1d689a1a,
    name: "create-shorturl"
  }, {
    path: "/create-shorturl-List",
    component: _dafbeb22,
    name: "create-shorturl-List"
  }, {
    path: "/delete-plan",
    component: _28b340d3,
    name: "delete-plan"
  }, {
    path: "/delete-setting",
    component: _b0eaaeb0,
    name: "delete-setting"
  }, {
    path: "/env-setting",
    component: _b9ad4764,
    name: "env-setting"
  }, {
    path: "/exam-end",
    component: _59504249,
    name: "exam-end"
  }, {
    path: "/examinees",
    component: _12b3a4e2,
    name: "examinees"
  }, {
    path: "/examining",
    component: _f73663c0,
    name: "examining"
  }, {
    path: "/identification",
    component: _74ce9a68,
    name: "identification"
  }, {
    path: "/identification-ai",
    component: _5b009677,
    name: "identification-ai"
  }, {
    path: "/iframe",
    component: _7974a872,
    name: "iframe"
  }, {
    path: "/login",
    component: _2fa513b5,
    name: "login"
  }, {
    path: "/logins",
    component: _336445a8,
    name: "logins"
  }, {
    path: "/logview",
    component: _3f29f235,
    name: "logview"
  }, {
    path: "/management",
    component: _6e071373,
    name: "management"
  }, {
    path: "/monitoring",
    component: _0a7da24e,
    name: "monitoring"
  }, {
    path: "/redirect",
    component: _1376453a,
    name: "redirect"
  }, {
    path: "/terms",
    component: _4eaddad7,
    name: "terms"
  }, {
    path: "/alerting/system-error",
    component: _269fe748,
    name: "alerting-system-error"
  }, {
    path: "/checkers/monitoring",
    component: _3d484eb0,
    name: "checkers-monitoring"
  }, {
    path: "/alerting/:id?",
    component: _70aab438,
    name: "alerting-id"
  }, {
    path: "/create-shorturl/:id?",
    component: _22ab49fc,
    name: "create-shorturl-id"
  }, {
    path: "/examinees/:id",
    component: _000b40eb,
    name: "examinees-id"
  }, {
    path: "/examinees/:id/login",
    component: _6c9a37fc,
    name: "examinees-id-login"
  }, {
    path: "/",
    component: _3d3a0116,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
