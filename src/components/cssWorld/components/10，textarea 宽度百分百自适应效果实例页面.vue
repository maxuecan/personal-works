<template>
  <div>
    <h3 class="center">textarea 宽度100%自适应效果实例页面</h3>
    <div class="container">
      <div class="textarea">
        <textarea rows="5" placeholder="色块是容器"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.container {
  width: 280px;
  margin: 0 auto;
  padding: 40px 0;
  background-color: #f0f3f9;
  animation: width 2s infinite alternate;
}

@keyframes width {
  from { width: 200px; }
  to { width: 280px; }
}

.textarea {
  padding: 9px 8px;
  border: 1px solid #d0d0d5;
  border-radius: 4px;
  background-color: #fff;  
}

.textarea > textarea {
  width: 100%;
  line-height: 20px;
  padding: 0;
  border: 0 none;
  outline: 0 none;
  background: none;
  resize: none;
}
</style>