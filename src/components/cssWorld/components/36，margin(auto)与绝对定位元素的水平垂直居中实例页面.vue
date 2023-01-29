<template>
  <div>
    <div class="father">
        <div class="son"></div>
    </div>
    <div class="san"></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.father {
  width: 300px;
  height: 150px;
  background-color: #f0f3f9;
  position: relative;
  margin: auto;
}
.son {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #cd0000;
}
.san {
  width: 120px;
  height: 20px;
  border-top: 60px double;
  border-bottom: 20px solid;
}
</style>