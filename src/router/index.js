import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/client',
    component: Layout,
    redirect: '/client',
    name: 'client',
    meta: { title: '客户管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/client/list'),
        meta: { title: '客户列表', icon: 'table' }
      },
      { // 客户详情 (new)
        path: 'clientDetail',
        name: 'clientDetail',
        hidden: true,
        component: () => import('@/views/client/clientDetail'),
        meta: { title: '客户详情', icon: 'table' }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/client/chat'),
        meta: { title: '客户咨询', icon: 'table' }
      }
    ]
  },
  {
    path: '/systemLog', // (new)
    component: Layout,
    redirect: '/systemLog',
    children: [{
      path: 'systemLog',
      name: 'systemLog',
      component: () => import('@/views/systemLog/index'),
      meta: { title: '系统日志', icon: 'dashboard' }
    }]
  },
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
