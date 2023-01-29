<script setup>
/* 
 * 图片懒加载使用
 * 使用vue-lazyload
 */
let img = {
  src: new URL('../../../assets/home/1.jpg', import.meta.url).href,
  // src1: 'src/assets/home/abc.jpg'
}
</script>

<template>
  <div>
    <img v-lazy="img.src" alt="">
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 50px;
  height: 50px;
  background: 100% 100%;
}
</style>