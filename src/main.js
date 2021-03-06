import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './main.css'
import echarts from 'echarts'

import { showLoading, hideLoading } from './utils/loading.js'

// base64加密
import { encryptString, decodeString } from './utils/encrypt'

// Cookies
import Cookies from 'js-cookie'

// 导入 nprogress 进度条组件的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 第三方表格组件
// import ZkTable from 'vue-table-with-tree-grid'
import ZkTable from 'vue-table-with-tree-grid'

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
  // 携带用户角色 (加密 解密)
  const str = 'userRole'
  const enc = encryptString(str)
  const userRole = Cookies.get(enc)
  if (userRole) {
    config.headers.userRole = decodeString(userRole)
  }
  return config
})
// 结束
axios.interceptors.response.use(config => {
  hideLoading()
  // 隐藏进度条
  NProgress.done()
  if (config.data.status === 1000) {
    return window.vm.$router.push({ path: '/login' })
  }
  return config
})

// 配置表格
Vue.component('TreeTable', ZkTable)

Vue.prototype.$axios = axios
Vue.prototype.encryptString = encryptString
Vue.prototype.decodeString = decodeString
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

// 定义全局日期过滤器
Vue.filter('dateFormat', function (originVal) {
  const val = Number(originVal)
  const dt = new Date(val)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
