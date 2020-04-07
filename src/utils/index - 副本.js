/**
 * Created by PanJiaChen on 16/11/18.
 */
/* Layout */
import Layout from '@/layout'
const importRouter = require('@/router/import_router')

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

// 防抖函数
export function debounce(fn, delay) {
  let timer = null
  return function() {
    const self = this
    const args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(self, args)
    }, delay)
  }
}

// 组装动态路由
export function generaMenu (routers, data) {
  return new Promise((resolve, reject) => {
    const arr = generaFn(routers, data)
    resolve(arr)
  })
}
// 递归
function generaFn(routers, data) {
  data.forEach((item) => {
    if(item.type !== 1) { // 排除按钮
      const comp = item.value === '/' ? 'dashboard' : item.value.replace('/', '')
      let childrenOne = [{
        path: item.value === '/' ? 'dashboard' : item.value,
        component: () => import(`@/views/${comp}/index.vue`), // 报错 https://blog.csdn.net/weixin_42406046/article/details/103718293
        // component: importRouter(`${item.value === '/' ? 'dashboard' : item.value.replace('/', '')}/index`),
        // component: resolve => require([resolve => require(['@/views/'+ comp +'/index'], resolve)], resolve),
        meta: { title: item.name, icon: 'example' }
      }]
      let redirectOne = item.value === '/' ? '/dashboard' : item.value
      let menu = {
        path: item.value,
        component: item.type === 0 &&  item.level === 1 ? Layout : () => import(`@/views${item.value}.vue`),
        // component: item.type === 0 &&  item.level === 1 ? Layout : resolve => require([resolve => require([`@/views${item.value}`], resolve)], resolve),
        // component: item.type === 0 &&  item.level === 1 ? Layout : importRouter(item.value),
        redirect: item.level === 1 ? redirectOne : '',
        name: item.name,
        meta: { title: item.name, icon: 'example' },
        children: item.type === 0 &&  item.level === 1 ? childrenOne : []
      }
      if (item.childMenus) {
        let arr = generaFn(menu.children, item.childMenus)
        menu.children = arr
      }
      routers.push(menu)
    }
    
  })
  return routers
}
