import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  // {
  //   path: '/homepage',
  //   component: Layout,
  //   redirect: '/homepage',
  //   name: 'client',
  //   meta: { title: 'APP首页管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'banner',
  //       name: 'banner',
  //       component: () => import('@/views/homepage/banner'),
  //       meta: { title: 'banner', icon: 'table' }
  //     },
  //     {
  //       path: 'bannerHandle',
  //       name: 'bannerHandle',
  //       hidden: true,
  //       component: () => import('@/views/homepage/bannerHandle'),
  //       meta: { title: 'banner管理', icon: 'table' }
  //     },
  //     {
  //       path: 'popups',
  //       name: 'popups',
  //       component: () => import('@/views/homepage/popups'),
  //       meta: { title: '活动弹窗', icon: 'table' }
  //     }
  //   ]
  // },
  
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/notFound',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter(params) {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  router.addRoutes(params) // (注意坑)
}

export default router
