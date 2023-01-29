<template>
  <div>
    <img class="img" src="@/assets/home/first.png" alt="">
    <img class="img">
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
img:not([src]) {
  content: url(@/assets/home/first.png)
}
</style>