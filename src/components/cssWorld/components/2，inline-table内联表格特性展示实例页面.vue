<template>
  <div>
    <h3 class="center">inline-table内联表格特性展示实例页面</h3>
    和文字平起平坐的表格：<div class="inline-table">
      <p>第1列</p>
      <p>第2列</p>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.inline-table {
  display: inline-table;
  width: 128px;
  margin-left: 10px;
  border: 1px solid #cad5eb;
}
.inline-table > p {
  display: table-cell;
}
</style>