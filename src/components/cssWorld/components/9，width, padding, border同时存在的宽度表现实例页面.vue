<template>
  <div>
    <h3 class="center">width, padding, border同时存在的宽度表现实例页面</h3>
    <div class="div">
      此时元素的offsetWidth是：<span id="divWidth"></span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue'
onMounted(() => {
  const { proxy } = getCurrentInstance()
  var eleShowWidth = document.getElementById('divWidth')
  eleShowWidth.innerHTML = eleShowWidth.parentNode.offsetWidth
})
</script>

<style lang="scss" scoped>

.div {
  width: 100px;
  padding: 20px;
  border: 20px solid;

  margin: auto;
}
</style>