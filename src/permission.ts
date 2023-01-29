import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
import { RouteRecordRaw } from 'vue-router'

const whiteList = ['/login']

// 登录只是设 token，路由 beforeEach时才设 roles
// router.beforeEach(async(to, from, next) => {
//   const hasToken = getToken()
//   if (hasToken) {
//     // 每20s checkToken
//     store.dispatch('user/checkToken', true)
//     if (to.path === '/login') {
//       // 如果已登录，重定向到主页
//       next({ path: '/' })
//     } else {
//       // 确定用户是否已通过 getInfo获得其权限角色
//       const hasRoles = store.getters.roles && store.getters.roles.length > 0
//       console.log(hasRoles)
//       if (hasRoles) {
//         next()
//       } else {
//         try {
//           // 用户权限
//           const { roles } = await store.dispatch('user/getInfo')

//           const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
//           accessRoutes.forEach((item: RouteRecordRaw) => {
//             router.addRoute(item)
//           })
//           next({ ...to, replace: true })
//         } catch (error) {
//           await store.dispatch('user/resetToken')
//           next(`/login?redirect=${to.path}`)
//         }
//       } 
//     }
//   } else {
//     // 清除每20s checkToken的定时器
//     store.dispatch('user/checkToken', false)

//     if (whiteList.indexOf(to.path) !== -1) {
//       // 路由白名单直接进
//       next()
//     } else {
//       next(`/login?redirect=${to.path}`)
//     }
//   }
// })

// router.afterEach(() => {

// })
