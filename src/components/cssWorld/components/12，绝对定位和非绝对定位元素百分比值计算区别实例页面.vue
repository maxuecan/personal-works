<template>
  <div>
    <h3 class="center">绝对定位和非绝对定位元素百分比值计算区别实例页面</h3>
    <div class="box">
      <div class="child">高度100px</div>
    </div>

    <div class="box rel">
      <div class="child">高度160px</div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.box {
  height: 160px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #beceeb;
}
.child {
  height: 100%;
  background: #cd0000;
}
.rel {
  position: relative;
}
.rel > .child {
  width: 100%;
  position: absolute;
}
</style>