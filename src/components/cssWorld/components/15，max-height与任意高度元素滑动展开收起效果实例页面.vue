<template>
  <div>
    <input id="check" type="checkbox">
    <p>个人觉得,...</p>
    <div class="element">
      <p>display:table-cell其他...</p>
    </div>
    <label for="check" class="check-in">更多⬇</label>
    <label for="check" class="check-out">收起⬆</label>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.element {
  max-height: 0;
  overflow: hidden;
  transition: max-height .25s;
}
:check ~ .element {
  max-height: 666px;
}
</style>