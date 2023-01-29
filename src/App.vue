<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent } from 'vue'

export default defineComponent({

  // components: {
    
  // },

  setup() {

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
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
