import Vue from 'vue'
import Router from 'vue-router'
import Store from '../state/state'

Vue.use(Router)
const Login = () => import('./login/index.vue')
const App = () => import('../components/container.vue')

const view = (comp) => () => import('./' + comp + '/index.vue')

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/404'
    }, {
      path: '/',
      component: App,
      children: [{
        path: '/',
        component: view('chatList')
      }, {
        path: '/chatList',
        component: view('chatList')
      }, {
        path: '/friends',
        component: view('friends')
      }, {
        path: '/settings',
        component: view('settings')
      }],
      beforeEnter: (to, from, next) => {
        if (!Store.state.userId) {
          next({path: '/login'})
        } else {
          next()
        }
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/register',
      name: 'Register',
      component: view('register')
    }, {
      path: '/user/:userId',
      name: 'User',
      component: view('user'),
      beforeEnter: (to, from, next) => {
        if (!Store.state.userId) {
          next({path: '/login'})
        } else {
          next()
        }
      }
    }, {
      path: '/rtc/:token',
      name: 'RTC',
      component: view('rtc'),
      beforeEnter: (to, from, next) => {
        if (!Store.state.userId) {
          next({path: '/login'})
        } else {
          next()
        }
      }
    }, {
      path: '/404',
      name: '404',
      component: view('404')
    }, {
      path: '/test',
      name: 'Test',
      component: () => import('../components/list.vue')
    }]
})

export default router
