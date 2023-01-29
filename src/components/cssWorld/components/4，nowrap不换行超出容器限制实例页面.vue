<template>
  <div>
    <h3 class="center">nowrap不换行超出容器限制实例页面</h3>
    <div class="father">
      <span class="child">恰如一江春水向东流，流到断崖也不回头</span>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.father {
  width: 150px;
  padding: 10px;
  background-color: #cd0000;
  white-space: nowrap;
}
.child {
  display: inline-block;
  padding: 5px;
  background-color: #f0f3f9;
}

</style>