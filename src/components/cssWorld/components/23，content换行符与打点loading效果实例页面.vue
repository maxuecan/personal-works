<template>
  <div>
    正在加载中<dot>...</dot>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
dot {
  display: inline-block;
  height: 1em;
  line-height: 1;
  text-align: -.25em;
  overflow: hidden;
}
dot::before {
  display: block;
  content: '...\A..\A.';
  white-space: pre-wrap;
  animation: dot 3s infinite step-start both;
}
@keyframes dot {
  33% {
    transform: translateY(-2em);
  }
  66% {
    transform: translateY(-1em);
  }
}
</style>