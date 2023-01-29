<template>
  <div>
    <input id="search" type="search" value="我是初始值" required>
    <label for="search" class="icon-clear"></label>

    <div class="san"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  var eleLabel = document.querySelector('label[for="search"]'),
      eleSearch = document.getElementById('search');
  if (eleLabel && eleSearch) {
    eleLabel.onclick = function() {
      eleSearch.value = '';
    }
  }
})
</script>

<style lang="scss" scoped>
input[type="search"] {
  width: 200px;
  height: 40px;
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.icon-clear {
  width: 16px;
  height: 16px;
  margin: 1px 0 0 -38px;
  border: 11px solid transparent;
  border-radius: 50%;
  background: #999;
  color: white;
  position: absolute;
  visibility: hidden;
}
.icon-clear:before {
  content: 'x';
}
input:valid + .icon-clear {
  visibility: visible;
}

// .san {
//   // width: 0;
//   width: 10px;
//   height: 10px;
//   border: 10px solid;
//   // border-color: #f30 transparent transparent;
//   border-color: #f30 #00f #396 #0f0;
// }
.san {
  width: 0;
  border-width: 10px 20px;
  border-style: solid;
  border-color: #f30 transparent transparent;
}
</style>