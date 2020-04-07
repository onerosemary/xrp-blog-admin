import Layout from '@/layout'

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
let myPermissionBtns = []
export function generaMenu (routers, data) {
  return new Promise((resolve, reject) => {
    const myrouters = generaFn(routers, data)
    console.log('myrouters----', myrouters)
    resolve({
      myrouters,
      myPermissionBtns
    })
  })
}
// 递归组装路由
function generaFn(routers, data) {
  data.forEach((item) => {
      const comp = item.value === '/' ? '/dashboard' : ('/' + item.value)
      let childrenOne = [{
        path: item.value === '/' ? 'dashboard' : item.value,
        name: item.value === '/' ? 'dashboard' : item.value,
        component: () => import(`@/views${comp}/index.vue`), // (注意坑)(当前解决方案, 指定版本 "babel-eslint": "^7.2.3",)报错 https://blog.csdn.net/weixin_42406046/article/details/103718293
        meta: { title: item.name, icon: 'example' }
      }]
      let redirectOne = item.value === '/' ? '/dashboard' : ('/' + item.value)
      let menu = {}
      if(item.type === 0 &&  item.level === 1) { // 一级菜单
        menu = {
          path: item.value === '/' ? item.value : ('/' + item.value),
          component: Layout,
          redirect: redirectOne,
          name: item.value === '/' ? 'dashboard' : item.value,
          meta: { title: item.name, icon: 'example' },
          children: !item.isNext ? childrenOne : [] // 判断一级单独的一级菜单(主要避免有二级的菜单，没有选列表，只选择 二级菜单 比如添加按钮)
        }
      }else if(item.type === 0 &&  item.level === 2) { // 二级菜单
        menu = {
          path: ('/' + item.value),
          component: () => import(`@/views/${item.value}.vue`),
          name: item.value,
          meta: { title: item.name, icon: 'example' },
          children: []
        }
      }else if(item.type === 1) { // 按钮
        if(item.path) { // 只针对 添加与编辑， 删除，排序等排除
          menu = {
            path: ('/' + item.path),
            component: () => import(`@/views/${item.path}.vue`),
            name: item.path,
            hidden: true,
            meta: { title: item.name, icon: 'example' },
            children: null
          }
        }
        
        // 收集所有权限按钮
        myPermissionBtns.push(item)
      }
      
      if (item.childMenus) {
        let arr = generaFn(menu.children, item.childMenus)
        menu.children = arr
      }

      // (坑)排除 按钮 可能是 空对象， 会添加到children
      if(menu.path) {
        routers.push(menu)
      }
      
    // else { // 收集所有权限按钮
    //   myPermissionBtns.push(item)
    // }
    
  })
  return routers
}