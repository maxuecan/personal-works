<template>
  <div>
    <a href="">登录</a><a href="">注册</a>
    <!-- <h3><span id="hash">标题</span></h3> -->
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
a + a:before {
  content: "";
  font-size: 0;
  padding: 10px 3px 1px;
  margin-left: 6px;
  border-left: 1px solid gray;
}
// h3 {
//   line-height: 30px;
//   font-size: 14px;
// }
// h3 > span {
//   padding-top: 58px;
// }
</style>