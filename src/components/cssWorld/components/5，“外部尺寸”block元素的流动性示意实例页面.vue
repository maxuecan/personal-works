<template>
  <div>
    <h3 class="center">“外部尺寸”block元素的流动性示意实例页面</h3>
    <h4>无宽度，借助流动性</h4>
    <div class="nav">
      <a href="" class="nav-a">导航1</a>
      <a href="" class="nav-a">导航2</a>
      <a href="" class="nav-a">导航3</a>
    </div>
    <h4>width:100%</h4>
    <div class="nav">
      <a href="" class="nav-a width">导航1</a>
      <a href="" class="nav-a width">导航2</a>
      <a href="" class="nav-a width">导航3</a>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.width {
  width: 100%;
}
.nav {
  background-color: #cd0000;
}
.nav-a {
  display: block;
  margin: 0 10px;
  padding: 9px 10px;
  border-bottom: 1px solid #b70000;
  border-top: 1px solid #de3636;
  color: #fff;
}
.nav-a:first-child { border-top: 0; }
.nav-a + .nav-a + .nav-a { border-bottom: 0;}
</style>