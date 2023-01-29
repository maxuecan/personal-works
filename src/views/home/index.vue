<template>
  <div id="container">
    <!-- <div id="flexible-fullscreen-body"></div> -->
    <!-- <Swiper /> -->
    <!-- <Inject /> -->
    <!-- <MyComponent /> -->
    <!-- <div v-my-directive v-my-directive2></div> -->
    <set-up ref="set-up" title="mxc"/>
  </div>
</template>

<script setup>
import { onMounted, watch, nextTick, ref, getCurrentInstance } from 'vue'
import Swiper from '@/components/swiper.vue'
import Inject from '@/components/provide/inject.vue'
import SetUp from '@/components/setUp.vue'
// let body

// onMounted(() => {
//   nextTick(() => {
//     resizeViewport()
//   })
// })

// window.onresize = () => {
//   return resizeViewport()
// }

// function resizeViewport() {
//   if (!body) {
//     body = document.getElementsByTagName('body')[0].style
//   } 
//   body.width = document.documentElement.clientWidth + 'px'
//   body.height = document.documentElement.clientHeight + 'px'
// }
onMounted(() => {
  const { proxy } = getCurrentInstance()
  console.log(proxy.$refs['set-up'])
})
</script>

<style lang="scss">
#container {
  
}

#flexible-fullscreen-body {
  width: 100%;
  min-width: 1296.3px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  background: url(@/assets/home/first.png) center/cover no-repeat;
}
</style>
