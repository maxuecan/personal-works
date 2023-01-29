<template>
  <div>
    <canvas id="canvas" width="400" height="100"></canvas>
    <div class="text">恭喜您获得100w</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'darkgray'
  ctx.fillRect(0, 0, 400, 100)
  ctx.fillStyle = '#fff'

  ctx.fillText('刮刮卡', 180, 50)

  let isDraw = false
  canvas.onmousedown = function() {
    isDraw = true
  }
  canvas.onmousemove = function(e) {
    if (!isDraw) return
    const x = e.pageX - canvas.offsetLeft
    const y = e.pageY - canvas.offsetTop
    ctx.globalCompositeOperation = 'destination-out'
    ctx.arc(x, y, 10, 0, 2 * Math.PI)
    ctx.fill()
  }
  canvas.onmouseup = function() {
    isDraw = false
  }
})
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.text {
  position: absolute;
  left: 130px;
  top: 35px;
  z-index: -1;
}
</style>