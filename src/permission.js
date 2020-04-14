import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import { resetRouter, constantRoutes } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          
          if(store.getters.dynRouters.length > 0){
            //这里将动态组装的路由添加到路由里面

            const lasterRouters = store.getters.dynRouters.concat(constantRoutes) // 最终生成的路由
            
            // 防止动态添加的路由刷新页面跳转notFound页面
            lasterRouters.push({
              path: '*',
              redirect: '/notFound'
            })

            resetRouter(lasterRouters) // 动态添加可访问路由表
            router.options.routes = lasterRouters // 更新侧边栏
            // console.log('router.options.routes---', router.options.routes)
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 并刷新页面防止返回指定首页(注意坑, 不然页面会空白)
          }
          // next()
          
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
