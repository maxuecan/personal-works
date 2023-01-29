<template>
  <div>
    <h3 class="center">“首选最小宽度”与凹凸效果实例页面</h3>
    <span class="ao"></span>
    <span class="tu"></span>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.ao,
.tu {
  display: inline-block;
  width: 0;
  font-size: 14px;
  line-height: 18px;
  margin: 35px;
  color: #fff;
}
.ao:before,
.tu:before {
  outline: 2px solid #cd0000;
  font-family: Consolas, Monaco, monospace;
}
.ao:before {
  content: "love你love";
}
.tu {
  direction: rtl;
}
.tu:before {
  content: "我love你";
}
</style>