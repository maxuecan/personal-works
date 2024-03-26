<script lang="ts">
// autofit.js使用
// import autofit from 'autofit.js';
import { onMounted, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    onMounted(() => {
      // // autofit.js使用
      // autofit.init({
      //   dh: 1080,
      //   dw: 1920,
      //   el: '#app',
      //   resize: true
      // }, false)
    })
  }
})

/* 
 * 普通的 <script> 只在组件被首次引入的时候执行一次不同
 * <script setup> 中的代码会在每次组件实例被创建的时候执行
 */
</script>


<template>
  <router-view />
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
