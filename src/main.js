import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang english i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang chinese i18n

import '@/styles/index.scss' // global css
import '@/utils/global.js' // 挂载到Vue原型上的对象

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import '@/config/index' // 全局url等配置

// import * as socketApi from '@/utils/socket'
// Vue.prototype.socketApi = socketApi

// 价格过滤器
Vue.filter('price', (value) => {
  const val = (((value*1000) / 100) / 1000).toFixed(2)
  return val
})

// 通过指令判断按钮是否有权限
Vue.directive('has', {
  inserted: function(el, binding) {
    if(!permissionJudge(binding.value)){
      el.parentNode.removeChild(el)
    }
    function permissionJudge(value) {
      // 此处store.getters.dynPermissionBtns代表vuex中储存的按钮菜单数据
      let list = store.getters.dynPermissionBtns
      for (let item of list) {
        if (item.value === value) {
          return true
        }
      }
      return false
    }
  }
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
