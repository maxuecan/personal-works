<template>
  <div>
    <canvas id="canvas-shizhong" height="300"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  var canvas = document.getElementById('canvas-shizhong');
	var ctx = canvas.getContext('2d');

  setInterval(() => {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(150, 100);
    ctx.save()

    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    let time = new Date();
    let hour = time.getHours() % 12;
    let min = time.getMinutes();
    let sec = time.getSeconds();
    
    ctx.rotate(2 * Math.PI / 12 * hour + 2 * Math.PI / 12 * (min / 60) - Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(40, 0);
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    ctx.save();

    ctx.rotate(2 * Math.PI / 60 * min + 2 * Math.PI / 60 * (sec / 60) - Math.PI / 2)
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(60, 0);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    ctx.save();

    ctx.rotate(2 * Math.PI / 60 * sec - Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(80, 0);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    ctx.save();

    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      ctx.rotate(2 * Math.PI / 60);
      ctx.beginPath();
      ctx.moveTo(90, 0);
      ctx.lineTo(100, 0);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
    ctx.save();
    ctx.lineWidth = 5;
    for (let i = 0; i < 12; i++) {
      ctx.rotate(2 * Math.PI / 12)
      ctx.beginPath();
      ctx.moveTo(85, 0)
      ctx.lineTo(100, 0)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.restore()
    ctx.restore()
  }, 1000)

})
</script>

<style lang="scss" scoped>

</style>