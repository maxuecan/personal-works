import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import homeRouter from './modules/home'

// interface RouteRecordRawa extends RouteRecordRaw {
//   hidden?: boolean
// }

/* 常用路由 */
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    redirect: '/redirect',
    // hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/basics',
    // name: 'Login',
    // hidden: true,
    component: () => import('@/views/basics/index.vue'),
  },
  {
    path: '/404',
    // hidden: false,
    component: () => import('@/views/error-page/404.vue'),
  }
]

/* 异步路由 */
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'index',
    component: () => import('@/views/index/index.vue'),
    children: [
      {
        path: 'index',
        name: 'CurrentData',
        component: () => import('@/views/index/index.vue'),
        meta: {
          title: 'currentData',
          icon: 'dashboard',
          // roles: ['100'],
          affix: true
        }
      }
    ]
  },
  homeRouter,
]

/* 主路由 */
// const router = createRouter({
//   history: createWebHashHistory(),
//   routes: constantRoutes,
// })

/* 测试路由 */
const testRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'index',
    // keepAlive: true,
    // component: () => import('@/views/index/index.vue'),
    component: () => import('@/views/my-world/index2.vue'),
    children: [
      {
        path: 'index',
        name: 'Index',
        // component: () => import('@/views/index/index.vue'),
        component: () => import('@/views/my-world/index2.vue'),
        // meta: {
        //   title: 'currentData',
        //   icon: 'dashboard',
        //   roles: ['100'],
        //   affix: true
        // }
      }
    ]
  },
  {
    path: '/cssWorld',
    component: () => import('@/components/cssWorld/index.vue')
  },
  {
    path: '/canvas',
    component: () => import('@/components/canvas/index.vue')
  },
  {
    path: '/threeJs',
    component: () => import('@/components/threeJs/base/index.vue')
  },
  /* 
   * vue3基础
   */
  {
    path: '/basics',
    component: () => import('@/views/basics/index.vue'),
  },
  /* 
   * 实践功能 
   */
  {
    path: '/i_frame',
    component: () => import('@/views/practice/i_frame/index.vue')
  },
  /*  
   * 插件/框架
   */
  {
    path: '/element',
    component: () => import('@/views/plugs/element/index.vue')
  },
  {
    path: '/imageLazyLoading',
    component: () => import('@/views/plugs/imageLazyLoading/index.vue')
  },
  {
    path: '/test',
    component: () => import('@/views/test/index.vue')
  },
  {
    path: '/my-world',
    component: () => import('@/views/my-world/index2.vue')
  },
  {
    path: '/file-demo',
    component: () => import('@/components/file/index.vue')
  },
  homeRouter,
]
/* 测试路由 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: testRoutes,
  strict: true,
})

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
  })
  router.resolve = newRouter.resolve
}

export default router
