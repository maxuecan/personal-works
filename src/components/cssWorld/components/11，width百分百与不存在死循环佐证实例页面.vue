<template>
  <div>
    <h3 class="center">width:100%与不存在死循环佐证实例页面</h3>
    <div class="box">
      <img style="widht: 100px; height: 100px" src="@/assets/home/first.png" alt="">
      <span class="text">红色背景是父级</span>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.box {
  display: inline-block;
  white-space: nowrap;
  background-color: #cd0000;
}
.text {
  display: inline-block;
  width: 100%;
  background-color: #34538b;
  color: #fff;
}
</style>