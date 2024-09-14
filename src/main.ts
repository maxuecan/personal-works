import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'
import store from '@/store'

import '@/permission'

import '@/style/common.scss'
// import '@/style/home.scss'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import VueLazyload from 'vue-lazyload'
// const loadimage = require('./加载图片')
const errorimage = new URL('./assets/home/错误图片.png', import.meta.url)

// import pinia from './pinia'

// createApp(App).mount('#app')


// vue3
const app = createApp(App)
app.use(ElementPlus, {locale: zhCn})
// app.use(VueLazyload) // vue-lazyload
app.use(VueLazyload, {
  perLoad: 1.3,
  // error: errorimage,
  // loading: loadimage,
  attempt: 1
})
// app.use(pinia)
app.use(router).use(store).mount('#app')

/* 提供一个值，可以在应用中的所有后代组件注入使用 */
app.provide('message', 'hello')

/* 
 * 传递一个组件名字符串及其定义，则注册一个全局组件
 * 只传递一个名字，则会得到一个已经注册的组件
*/
// app.component('MyComponent', {
//   template: `<div>123</div>`
//   // render() {
//   //   return (
//   //     `
//   //       <template>
//   //         <div>123</div>
//   //       </template>
//   //     `
//   //   )
//   // }
// })

/*
 * 传递一个名字和一个指令定义，则注册一个全局指令
 * 只传递一个名字，则会得到一个已经注册的指令
 */
// 注册（对象形式的指令）
// app.directive('my-directive', {
//   mounted: (el) => {el.focus();console.log(123)}
// })
// 注册（函数形式的指令）
// app.directive('my-directive2', () => {
//   console.log(321)
// })

/* 提供当前应用所使用的 Vue 版本号 */
// console.log(app.version)
/* 每个应用实例都会暴露一个 config 对象，其中包含了对这个应用的配置设定 */
// console.log(app.config)
/* 一个用于注册能够被应用内所有组件实例访问到的全局 property 的对象 */
// console.log(app.config.globalProperties)

// app.use(ElementPlus, {locale: zhCn})
// app.use(router)
// app.use(store)
// app.mount('#app')

// 全局prototype
// app.config.globalProperties.$http = () => {}
