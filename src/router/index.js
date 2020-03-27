import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '数据预览', icon: 'dashboard' }
    }]
  },

  {
    path: '/store',
    component: Layout,
    redirect: '/store',
    children: [{
      path: 'store',
      name: 'store',
      component: () => import('@/views/store/index'),
      meta: { title: '门店管理', icon: 'dashboard' }
    }, {
      path: 'handle',
      name: 'handle',
      hidden: true,
      component: () => import('@/views/store/handle'),
      meta: { title: '门店管理', icon: 'dashboard' }
    }]
  },

  {
    path: '/shopping',
    component: Layout,
    redirect: '/shopping',
    name: 'shopping',
    meta: { title: '商品管理', icon: 'example' },
    children: [
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/shopping/category'),
        meta: { title: '商品分类', icon: 'table' }
      },{
        path: 'categoryHandle',
        name: 'categoryHandle',
        hidden: true,
        component: () => import('@/views/shopping/categoryHandle'),
        meta: { title: '商品分类管理', icon: 'dashboard' }
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/shopping/product'),
        meta: { title: '商品列表', icon: 'table' }
      },{
        path: 'productHandle',
        name: 'productHandle',
        hidden: true,
        component: () => import('@/views/shopping/productHandle'),
        meta: { title: '商品管理', icon: 'dashboard' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/shopping/orders'),
        meta: { title: '订单列表', icon: 'table' }
      },{
        path: 'ordersHandleSend',
        name: 'ordersHandleSend',
        hidden: true,
        component: () => import('@/views/shopping/ordersHandleSend'),
        meta: { title: '订单发货', icon: 'dashboard' }
      },{
        path: 'ordersHandleDistribution',
        name: 'ordersHandleDistribution',
        hidden: true,
        component: () => import('@/views/shopping/ordersHandleDistribution'),
        meta: { title: '订单关联返佣', icon: 'dashboard' }
      }

    ]
  },
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
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/client/chat'),
        meta: { title: '客户咨询', icon: 'table' }
      }
    ]
  },
  {
    path: '/actives',
    component: Layout,
    redirect: '/actives',
    name: 'Actives',
    meta: { title: '活动管理', icon: 'example' },
    children: [
      {
        path: 'discount',
        name: 'Discount',
        component: () => import('@/views/actives/discount'),
        meta: { title: '优惠卷', icon: 'table' }
      },
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/actives/group'),
        meta: { title: '拼团', icon: 'table' }
      },
      {
        path: 'groupHandle',
        name: 'groupHandle',
        hidden: true,
        component: () => import('@/views/actives/groupHandle'),
        meta: { title: '拼团管理', icon: 'dashboard' }
      },
      {
        path: 'seckill',
        name: 'Seckill',
        component: () => import('@/views/actives/seckill'),
        meta: { title: '秒杀', icon: 'table' }
      },
      {
        path: 'seckillHandle',
        name: 'seckillHandle',
        hidden: true,
        component: () => import('@/views/actives/seckillHandle'),
        meta: { title: '秒杀管理', icon: 'dashboard' }
      },
      {
        path: 'distribution',
        name: 'Distribution',
        component: () => import('@/views/actives/distribution'),
        meta: { title: '分销', icon: 'table' }
      },
      {
        path: 'rebate',
        name: 'Rebate',
        component: () => import('@/views/actives/rebate'),
        meta: { title: '返佣', icon: 'table' }
      },
      {
        path: 'weal',
        name: 'Weal',
        component: () => import('@/views/actives/weal'),
        meta: { title: '福利', icon: 'table' }
      }
    ]
  },
  {
    path: '/integral',
    component: Layout,
    redirect: '/integral',
    name: 'integral',
    meta: { title: '积分管理', icon: 'example' },
    children: [
      {
        path: 'mall',
        name: 'mall',
        component: () => import('@/views/integral/mall'),
        meta: { title: '积分商城', icon: 'table' }
      },
      {
        path: 'mallHandle',
        name: 'mallHandle',
        hidden: true,
        component: () => import('@/views/integral/mallHandle'),
        meta: { title: '积分商城管理', icon: 'table' }
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/integral/log'),
        meta: { title: '积分日志', icon: 'table' }
      },
      {
        path: 'logHandle',
        name: 'logHandle',
        hidden: true,
        component: () => import('@/views/integral/logHandle'),
        meta: { title: '积分日志管理', icon: 'table' }
      }
    ]
  },
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
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system',
    name: 'system',
    meta: { title: '系统用户', icon: 'example' },
    children: [
      {
        path: 'systemList',
        name: 'SystemList',
        component: () => import('@/views/system/systemList'),
        meta: { title: '系统用户列表', icon: 'table' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
