<template>
  <div style="max-width: 600px; overflow: hidden">
    <div id="colLeft" class="column-left">
      <h4>正方观点</h4>
      <p>观点1</p>
    </div>
    <div id="colRight" class="column-right">
      <h4>反方观点</h4>
      <p>观点1</p>
    </div>

    <input type="button" id="leftMore" value="更多正方观点">
    <input type="button" id="rightMore" value="更多反方观点">
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  var $ = function(id) {
    return document.getElementById(id)
  };

  // 分栏元素
  var colLeft = $('colLeft'),
  colRight = $('colRight');
  // 按钮元素
  var leftMore = $('leftMore'),
  rightMore = $('rightMore');
  // 序号
  var indexLeft = 1,
  indexRight = 0;
  if (colLeft && colRight && leftMore && rightMore) {
    leftMore.onclick = function() {
      indexLeft = indexLeft + 1;
      colLeft.insertAdjacentHTML('beforeend', '<p>观点' + indexLeft + '</p>');
    }
    rightMore.onclick = function() {
      indexRight = indexRight + 1;
      colRight.insertAdjacentHTML('beforeend', '<p>观点' + indexRight + '</p>')
    }
  }
})
</script>

<style lang="scss" scoped>
.column-left,
.column-right {
  float: left;
  width: 50%;
  margin-bottom: -9999px;
  padding-bottom: 9999px;
}
.column-left {
  background-color: #34538b;
}
.column-right {
  background-color: #cd0000;
}
</style>