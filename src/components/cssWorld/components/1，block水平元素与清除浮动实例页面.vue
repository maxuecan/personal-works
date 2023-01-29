<template>
  <div>
    <h3 class="center">block水平元素与清除浮动实例页面</h3>
    <div class="box clear">
      <img width="100" height="100" src="@/assets/home/first.png">
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.box {
  padding: 10px;
  background-color: #cd0000;
}
.box > img {
  float: left;
}
</style>