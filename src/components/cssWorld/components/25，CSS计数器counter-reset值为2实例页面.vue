<template>
  <div>
    <p>我叫王小二，字如其名，下面要出现的数字是：</p>
    <p class="counter"></p>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.counter {
  // counter-increment父子连续普照与递增实例页面
  // counter-reset两个命名并存实例页面
  counter-reset: wangxiaoer 2 wangxiaosan 3;
  // counter-reset/counter-increment递增实例页面
  counter-increment: wangxiaoer;
  font-size: 32px;
  font-family: Arial Black;
  color: #cd0000;
}
// .counter:before {
//   content: counter(wangxiaoer);
//   counter-increment: wangxiaoer;
// }
// .counter:after {
//   content: counter(wangxiaosan);
// }
.counter:before,
.counter:after {
  content: counter(wangxiaoer);
  counter-increment: wangxiaoer;
}
</style>