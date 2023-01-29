<template>
  <div>
    <a href class="button">我是按钮</a>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.button {
  display: inline-block;
  line-height: 36px;
  padding: 0 40px;
  color: #fff;
  background-color: #cd0000;
  position: relative;
}
.button:before,
.button:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  border-style: solid;
}
.button:before {
  top: -2px;
  border-width: 0 2px 2px;
  border-color: transparent transparent #cd0000;
}
.button:after {
  bottom: -2px;
  border-width: 2px 2px 0;
  border-color: #cc0000 transparent transparent;
}
</style>