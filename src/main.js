import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './main.css'

import { showLoading, hideLoading } from './loading'

// Cookies
import Cookies from 'js-cookie'

// 导入 nprogress 进度条组件的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入axios
import axios from 'axios'
// 请求跟路径
axios.defaults.baseURL = 'http://127.0.0.1:3008/api/'
// 请求拦截
axios.interceptors.request.use(config => {
  // 开启进度条
  NProgress.start()
  showLoading()
  // 请求头携带token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 携带用户角色
  config.headers.userRole = Cookies.get('userRole')
  return config
})
// 结束
axios.interceptors.response.use(config => {
  hideLoading()
  // 隐藏进度条
  NProgress.done()
  return config
})

Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
