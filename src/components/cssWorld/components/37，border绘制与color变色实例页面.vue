<template>
  <div>
    <a href class="add" title="继续上传">
      添加图片
    </a>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.add {
  display: inline-block;
  width: 76px;
  height: 76px;
  color: #ccc;
  border: 2px dashed;
  text-indent: -12em;
  transition: color .25s;
  position: relative;
  overflow: hidden;
}
.add:hover {
  color: #34538b;
}
.add::before, .add::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
}
.add::before {
  width: 20px;
  border-top: 4px solid;
  margin: -2px 0 0 -10px;
}
.add::after {
  height: 20px;
  border-left: 4px solid;
  margin: -10px 0 0 -2px;
}
</style>