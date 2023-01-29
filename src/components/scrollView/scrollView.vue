<template>
  <!-- <div id="wrapper" ref="wrapper">
    <slot></slot>
  </div> -->
  <div id="wrapper" ref="wrapper">
    <ul>
      <li><img style="width:100px; height:100px" src="@/assets/home/first.png"></li>
      <li><img style="width:100px; height:100px" src="@/assets/home/first.png"></li>
      <li><img style="width:100px; height:100px" src="@/assets/home/first.png"></li>
      <li><img style="width:100px; height:100px" src="@/assets/home/first.png"></li>
      <li><img style="width:100px; height:100px" src="@/assets/home/first.png"></li>
    </ul>
  </div>
</template>

<script setup>
import '@/assets/js/iscroll-probe.js'
import { onMounted, getCurrentInstance } from 'vue'
let iscroll
onMounted(() => {
  const { proxy } =  getCurrentInstance()
  iscroll = new IScroll(proxy.$refs.wrapper, {
    mouseWheel: true,
    scrollbars: true,
    // 解决拖拽卡顿问题
    scrollX: true,
    scrollY: false,
    disbalePointer: true,
    disbaleTouch: false,
    disbaleMouse: true
  })
})
</script>

<style>
#wrapper {
  width: 300px; height: 200px;
  position: relative;
  overflow: hidden;
}
#wrapper > ul {
  position: absolute;
  white-space: nowrap;
}
#wrapper li {
  display: inline-block;
}
</style>
