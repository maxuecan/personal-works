<template>
  <div class="container" ref="container">
    <Loading class="pos-center" v-if="load_bol" />

    <div v-else>
      <div class="book-container" v-if="show_animate">
        <img class="book" src="../../assets/book.png" alt="">
        <div class="wrap">
          <h3>个</h3>
          <h3>人</h3>
          <h3>信</h3>
          <h3>息</h3>
        </div>
      </div>

      <div v-else>
        <Navigate @navChange="navChange" />

        <!-- vue3：keep-alive使用 -->
        <keep-alive>
          <component :is="currentComp"></component>
        </keep-alive>
      </div>

      
      <!-- <ThreeJs /> -->
      <!-- <com-video /> -->
      <!-- Welcom
      <button @click="goBack">返回</button>
      <Emit @submits="checkHandler" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, getCurrentInstance, shallowRef, nextTick } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
/* vuex引入（组合api） */
import { storeKey, useStore } from 'vuex'
/* pinia引入 */
// import useUser from '@/pinia/modules/user'
// import { storeToRefs } from 'pinia'
/* emit用法 */
// import Emit from '@/components/emit/index.vue'

/* 组件 */
import Home from '@/components/info/index.vue'
import CssWorld from '@/components/cssWorld/index.vue'
import ComCanvas from '@/components/canvas/index.vue'

  
export default defineComponent({
  setup() {
    // let route = useRoute()
    // let router = useRouter()

    const store = useStore()
    let show_animate = ref(!store.state.user.home_animate)

    /* 
      pinia使用
      Store获取到后不能解构，否则失去响应式：pinia提供了函数storeToRefs
      作用：把解构的数据使用ref做代理

      pinia修改state数据方式
      第一种：user.account
      第二种：user.$patch({account: 1, home_animate: false})
      第三种：$state方式
      第四种：$reset()函数是重置state数据
    */
    // const user = useUser()
    // const { account } = storeToRefs(user)
    // console.log(user)
    // console.log(account)
    
    //这里用ref的话，vue给出警告Vue接收到一个组件，该组件被制成反应对象。这可能会导致不必要的性能开销，应该通过将组件标记为“markRaw”或使用“shallowRef”而不是“ref”来避免。
    // 如果使用 markRaw 那么currentComp将不永远不会再成为响应式对象。 所以得使用 shallowRef
    let currentComp = shallowRef(Home) as any

    let nav_active = [Home, CssWorld, ComCanvas]

    let { proxy, ctx } = getCurrentInstance() as any

    let load_bol = ref(true)

    onMounted(async () => {
      await nextTick()
      setTimeout(() => {
        loadImage()
      }, 1000)

      if (show_animate) {
        setTimeout(() => {
          show_animate.value = false
          sessionStorage.setItem('homeAnimate', 'true');
        }, 7500)
      }
    })

    const navChange = (e: any) => {
      currentComp.value = nav_active[e - 1]
    }

    const loadImage = () => {
      let img = new Image()
      let img_bg = new URL('../../assets/bg1.jpg', import.meta.url).href
      img.src = img_bg
      img.onload = function() {
        load_bol.value = false
        Object.assign(proxy.$refs.container.style, {
          backgroundImage: `url(${img_bg})`
        })
      }
      img.onerror = function () {
        load_bol.value = false
      }
    }

    // function checkHandler() {
    //   console.log('check')
    // }

    // async function goBack() {
    //   await store.dispatch('user/logout', false)
    //   router.push('/login')
    // }

    return {
      show_animate,
      currentComp,
      load_bol,
      navChange,
      // 在 computed 函数中访问 state
      // account: computed(() => store.state.account),
      // token: computed(() => store.state.token),

      // 使用 mutation
      // SET_TOKEN: () => store.commit('setToken'),

      // 使用 action
      // ASYNC_GET_TOKEN: () => store.dispatch('getToken'),
      // goBack,
      // checkHandler,
    }
  }
})

</script>

<style scoped lang="scss">
#canvas {
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  height: 100%;
  position: relative;
  background: black;
  // background: url('../../assets/bg1.jpg') no-repeat;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .book-container {
    position: absolute;
    left: 45%;
    bottom: 10%;
    transform: scale(0.2) rotate3d(10, 3, -7, 56deg);
    animation: book 4s ease 1s forwards, bookRotate 4s ease 1s infinite, hide 1s 6s forwards;
    /* 主要是text-shadow和transform搭配动画的巧妙运用 */
    .wrap {
      position: absolute;
      left: 28px;
      top: 34px;
      width: 20px;
      box-sizing: border-box;
      color: transparent;
    }
    h3 {
      margin: 0;
      text-shadow: 0 0 0 black;
      animation: smoky 1s 5s forwards;
    }
    h3:nth-child(1) {
      animation-delay: 5s;
    }
    h3:nth-child(2) {
      animation-delay: 5.4s;
    }
    h3:nth-child(3) {
      animation-delay: 5.8s;
    }
    h3:nth-child(4) {
      animation-delay: 6.2s;
    }
  }
}
/* 书本动画 */
@keyframes book {
  0% {
    transform: scale(0.2) rotate3d(10, 3, -7, 56deg);
  }
  20% {
    transform: scale(0.4) rotate3d(10, 3, -7, 46deg);
  }
  40% {
    transform: scale(0.6) rotate3d(10, 3, -7, 36deg);
  }
  80% {
    transform: scale(0.8) rotate3d(10, 3, -7, 26deg);
  }
  100% {
    transform: scale(1) rotate3d(10, 3, -7, 0deg);
  }
}
@keyframes bookRotate {
  0% {
    box-shadow: 0px 0px 20px #d9d919;
  }
  20% {
    box-shadow: 0px 0px 50px #d9d919;
  }
  40% {
    box-shadow: 0px 0px 20px #d9d919;
  }
  80% {
    box-shadow: 0px 0px 50px #d9d919;
  }
  100% {
    box-shadow: 0px 0px 20px #d9d919;
  }
}
/* 书本文字动画 */
@keyframes smoky {
  60% {
    text-shadow: 0 0 40px #fff;
  }
  100% {
    text-shadow: 0 0 20px #fff;
    /* 这里是重点 */
    transform: translate3d(15rem, -8rem, 0) rotate(-40deg) skew(70deg) scale(1.5);
    opacity: 0;
  }
}
@keyframes hide {
  20% {
    opacity: 1;
  }
  40% {
    opacity: 0.6;
  }
  60% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    // background: url('../../assets/bg1.jpg') center/cover no-repeat;
    background-size: cover;
    background-position: center;
  }
}
</style>
