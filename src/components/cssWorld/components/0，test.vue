<template>
  <div>
    <div class="size borderRdius"></div>
    <div class="size boxShadow"></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.size {
  width: 200px;
  height: 200px;
}
.borderRdius {
  border: 1px solid black;
  border-radius: 0% 100% 0% 100% / 0% 100% 0% 100%;
}
.boxShadow {
  // border: 1px solid black;
  // box-shadow:
  //   2.8px 2.8px 2.2px rgba(0, 0, 0, 0.07),
  //   6.7px 6.7px 5.3px rgba(0, 0, 0, 0.05),
  //   12.5px 12.5px 10px rgba(0, 0, 0, 0.041),
  //   22.3px 22.3px 17.9px rgba(0, 0, 0, 0.035),
  //   41.8px 41.8px 33.4px rgba(0, 0, 0, 0.028),
  //   100px 100px 80px rgba(0, 0, 0, 0.02);

  border-radius: 50px;
  background: #614242;
  box-shadow: 
    inset -11px -11px 0px #2b1d1d,
    inset 11px 11px 0px #976767;

}
</style>