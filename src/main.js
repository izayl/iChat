// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './state/state'
import FastClick from 'fastclick'
import { ToastPlugin, ConfirmPlugin } from 'vux'
import App from './App'
import router from './router'
import VueTimeago from 'vue-timeago'
import VueScrollTo from 'vue-scrollto'

Vue.use(VueScrollTo)
// time ago
Vue.use(VueTimeago, {
  name: 'timeAgo', // component name, `timeago` by default
  locale: 'zh-CN',
  locales: {
    // you will need json-loader in webpack 1
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
})

// Vue.use(Vuex)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
