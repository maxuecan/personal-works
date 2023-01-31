<template>
  <div>
    <canvas id="theCanvas"></canvas>
    <br>
    <button @click="ranDomColor">随机颜色画笔</button>
    <button @click="clearCanvas">清除画布</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
let theCanvas;
let ctx;
onMounted(() => {
  theCanvas = document.getElementById('theCanvas')
  
  if (!theCanvas || !theCanvas.getContext) {
    return
  } else {
    ctx = theCanvas.getContext('2d')

    let isAllowDrawLine = false
    /* 
      判断是否属于移动端，触摸
    */
    if (document.body.ontouchstart !== undefined) {
      // 使用touch事件
      theCanvas.ontouchstart = function (e) {
        // 开始触摸
        isAllowDrawLine = true
        let ele = windowToCanvas(theCanvas, e.targetTouches[0].clientX, e.targetTouches[0].clientY)
        let { x, y } = ele
        ctx.beginPath()
        ctx.moveTo(x, y)
        theCanvas.ontouchmove = (e) => {
          if (isAllowDrawLine) {
            let ele = windowToCanvas(theCanvas, e.targetTouches[0].clientX, e.targetTouches[0].clientY)
            let { x, y } = ele
            ctx.lineTo(x, y)
            ctx.stroke()
          }
        }
      }
      theCanvas.ontouchend = function () {
        // 滑动结束
        isAllowDrawLine = false
        ctx.closePath()
      }
    } else {
      theCanvas.onmousedown = function(e) {
        isAllowDrawLine = true
        let ele = windowToCanvas(theCanvas, e.clientX, e.clientY)
        let { x, y } = ele
        ctx.beginPath()
        ctx.moveTo(x, y)
        theCanvas.onmousemove = (e) => {
          if (isAllowDrawLine) {
            let ele = windowToCanvas(theCanvas, e.clientX, e.clientY)
            let { x, y } = ele
            ctx.lineTo(x, y)
            ctx.stroke()
          }
        }
      }

      theCanvas.onmouseup = function() {
        isAllowDrawLine = false
        ctx.closePath()
      }
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

function ranDomColor() {
  ctx.strokeStyle = 'rgba(' + Math.ceil((Math.random() * 255)) + ',' + Math.ceil((Math.random() * 255)) + ',' + Math.ceil((Math.random() * 255)) + ', .5)'
}

function clearCanvas() {
  ctx.clearRect(0, 0, theCanvas.clientWidth, theCanvas.clientHeight)
}
</script>

<style lang="scss" scoped>

</style>