<template>
  <div class="box">
    <!-- <h3 class="center">任意大小图片的左右半区布局实例页面</h3> -->
    <a href="javascript:" class="prev" title="上一张">上一张</a>
    <a href="javascript:" class="next" title="下一张">下一张</a>
    <img style="height: 100px; width: 100%" src="@/assets/home/first.png" alt="">
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.box {
  display: inline-block;
  position: relative
}
.prev,
.next {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  opacity: .5;
}
.prev {
  left: 0;
  background-color: #cd0000;
}
.next {
  right: 0;
  background-color: #34538b;
}
</style>