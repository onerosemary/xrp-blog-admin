import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  
  {
    path: '/role',
    component: Layout,
    redirect: '/role',
    name: 'role',
    meta: { title: '角色管理', icon: 'example' },
    children: [
      {
        path: 'roleList',
        name: 'RoleList',
        component: () => import('@/views/role/roleList'),
        meta: { title: '角色列表', icon: 'table' }
      },
      {
        path: 'roleHandle',
        name: 'roleHandle',
        hidden: true,
        component: () => import('@/views/role/roleHandle'),
        meta: { title: '角色操作', icon: 'table' }
      }
    ]
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
