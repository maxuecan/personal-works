<template>
  <div>
    <p>我叫王小二，万万没想到，我变成了罗马人！</p>
    <p class="counter"></p>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.counter {
  counter-reset: wangxiaoer 2;
  font-size: 32px;
  font-family: Arial black;
  color: #cd0000;
}
.counter:before,
.counter:after {
  display: block;
  content: counter(wangxiaoer, lower-roman);
  counter-increment: wangxiaoer;
}
</style>