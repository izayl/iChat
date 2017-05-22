/*
 * Created by izayl on 2017/5/7.
 * @Project: iChat
 * @Author: izayl
 * @Contact: izayl@163.com
 */
require('./adapter')
// require('webrtc-adapter')
require('./common.scss')
require('vux/src/styles/reset.less')
require('vux/src/styles/1px.less')
require('./iconfont')

const qs = require('query-string')
// global axios instance
export const api = require('axios').create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

// global axios interceptor
api.interceptors.request.use(cfg => {
  // before send ajax
  cfg.data = qs.stringify(cfg.data)
  return cfg
}, err => Promise.reject(err))

api.interceptors.response.use(res => {
  console.log(res)
  if (Number(res.status) !== 200) {
    throw new Error(res.status)
  }
  return res.data
}, err => Promise.reject(err))
