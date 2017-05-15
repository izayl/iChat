import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)
const Login = () => import('./login/index.vue')
const App = () => import('../components/container.vue')

const view = (comp) => () => import('./' + comp + '/index.vue')

export default new Router({
  routes: [
    {
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
      }]
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
      component: view('user')
    }, {
      path: '/rtc/:userId',
      name: 'RTC',
      component: view('rtc')
    }, {
      path: '/test',
      name: 'Test',
      component: () => import('../components/list.vue')
    }]
})
