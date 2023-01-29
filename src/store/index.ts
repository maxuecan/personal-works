import { createStore } from 'vuex'
import getters from './getters'

// vue3写法
const modulesFiles = import.meta.globEager('./modules/*.ts')
const modules = Object.keys(modulesFiles).reduce(
  (modules: { [key: string]: any }, path: string) => {
    const moduleName = path.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
    modules[moduleName] = modulesFiles[path]?.default
    return modules
  },
  {}
)
export default createStore({
  modules,
  getters
})

// vue2写法
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

// import Vue from 'vue'
// import Vuex from 'vuex'
// Vue.use(Vuex)
// const store = new Vuex.Store({
//   modules,
//   getters
// })
// export default store
