<template>
  <div style="position: relative; z-index: 1;">
    <canvas id="canvas-guaguaka"></canvas>
    <div class="text">恭喜您获得100w</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const canvas = document.getElementById('canvas-guaguaka')
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'darkgray'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'

  ctx.fillText('刮刮卡', canvas.width / 2, canvas.height / 2)

  let isDraw = false
  if (document.body.ontouchstart !== undefined) {
    // 使用touch事件
    canvas.ontouchstart = function (e) {
      isDraw = true
    }
    canvas.ontouchmove = (e) => {
      if (!isDraw) return
      let ele = windowToCanvas(canvas, e.targetTouches[0].clientX, e.targetTouches[0].clientY)
      let { x, y } = ele
      ctx.globalCompositeOperation = 'destination-out'
      ctx.arc(x, y, 10, 0, 2 * Math.PI)
      ctx.fill()
    }
    canvas.ontouchend = function () {
      isDraw = false
    }
  } else {
    canvas.onmousedown = function() {
      isDraw = true
    }
    canvas.onmousemove = function(e) {
      if (!isDraw) return
      let ele = windowToCanvas(canvas, e.clientX, e.clientY)
      let { x, y } = ele
      ctx.globalCompositeOperation = 'destination-out'
      ctx.arc(x, y, 10, 0, 2 * Math.PI)
      ctx.fill()
    }
    canvas.onmouseup = function() {
      isDraw = false
    }
  }
})

const windowToCanvas = (canvas, x, y) => {
  let rect = canvas.getBoundingClientRect()
  return {
    x: x - rect.left * (canvas.width / rect.width),
    y: y - rect.top * (canvas.height / rect.height)
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(calc(-50% - 150px), -50%);
  z-index: -1;
}

@media (max-width: 768px) {
  .text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}
}
</style>