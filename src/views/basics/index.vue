<script lang="ts">
/* 
 * vue3基础使用
 */
// 组件引入
// import layout from '@/layout'
import { ref, isRef, reactive, computed, watch, defineComponent } from 'vue'
// 接口引入
import { userLogin } from '@/api/user'
// 路由引入（组合api）
import { useRouter } from 'vue-router'
// vuex引入（组合api）
import { storeKey, useStore } from 'vuex'
// 公共方法引入
import { setToken } from '@/utils/auth'

/*
 * reactive 返回对象的响应式副本
 * reactive 将解包所有深层的 refs，同时维持 ref 的响应性。
 */
// 初始化full_name为一个空的字符串
// interface Ref<T> {value: T}
// function ref<T>(value: T): Ref<T>
const full_name = ref('admin')
// isRef
// console.log(isRef(full_name))
// 当将 ref 分配给 reactive property 时，ref 将被自动解包
const obj_name = reactive(full_name)

const handleClick = () => {
  full_name.value = 'super admin' // 需要注意的是修改时，不使用this
}

/* 初始化数据begin */
// 首先可以定义一个方法 返回初始化数据
// const formData = () => {
//   return {
//     userName: '',
//     password: ''
//   }
// }
// 初始化页面展示数据
// const form = reactive(formData())
// 重置数据为初始化状态
// Object.assign(form, formData())
/* 初始化数据end */

export default defineComponent({
  // props: {
  //   modelValue: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  // emits: ['update: modelValue'],

  // 组件注册
  // components: {
  //   layout
  // },
  setup(props, { emit }) {
    let router = useRouter() // 用于路由跳转 (useRouter() 一定要放在setup方法里面最上方位置 不然数值为undefined)
    // console.log(router)

    let store = useStore()

    function pushHome() {
      userLogin({
        password: 'adm123',
        username: 'admin'
      })
        .then((response: any) => {
          store.commit('user/SET_TOKEN', response['token'])
          store.commit('user/SET_ACCOUNT', response['name'])
          setToken(response['token'])

          // router.push('/')
          router.push({
            path: '/',
            // query: {
            //   ...response['data']
            // }
            query: {
              name: response['name'],
              token: response['token']
            }
          })
        })
        .catch(() => {})
    }

    /* computed */
    // const name = computed(() => {
    //   return 'ADMIN'
    // })
    let first_name = computed({
      get: () => full_name.value.substring(1),
      set: val => {
        console.log(val)
        first_name.value = 'Welcome' + val
      }
    })

    /* computed跟props，emit一起使用 */
    // const dialogVisble = computed({
    //   get: () => props.modelValue, // setup函数第一个参数是props
    //   set: (newVal) => {
    //     emit('update: modelValue', newVal)
    //   }
    // })

    /* watch */
    // watch(name, () => {})

    return {
      full_name,
      obj_name,
      first_name,
      // dialogVisble,
      handleClick,
      pushHome,
    }
  },
})
</script>

<template>
  <div>
    <p>hello, {{ full_name }} {{ obj_name }} {{ first_name }}</p>
    <button @click="handleClick">按钮</button>
    <button @click="pushHome">登录</button>
  </div>
</template>
