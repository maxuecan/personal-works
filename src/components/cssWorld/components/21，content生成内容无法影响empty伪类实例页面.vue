<template>
  <div>
    <h4>有内容</h4>
    <div class="box">有内容</div>
    
    <h4>无内容</h4>
    <div class="box"></div>
    
    <h4>空格也算内容</h4>
    <div class="box"></div>

    <h4>伪元素不算内容</h4>
    <div class="box pseudo"></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.box {
  width: 216px;
  padding: 10px;
  border: 10px solid #cd0000;
  margin: auto;
}
.box:empty {
  border-style: dashed;
}
.pseudo:after {
  content: '伪元素生成内容'
}
</style>