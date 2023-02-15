<template>
  <div>
    <video controls width="300" height="300" ref="video" id="hlsVideo"></video>
  </div>
</template>

<script lang="ts" setup>
import Hls from 'hls.js'
import { onMounted, nextTick, ref } from 'vue'

let player = ref(null) as any

onMounted(async () => {
  await nextTick()
  playVideo()
})

function playVideo() {
  let videoDom = document.getElementById('hlsVideo') as any
  if (Hls.isSupported()) {
    player = new Hls();
    player.loadSource('src/assets/video/fire-phoenix.mp4'); // 设置播放路径
    player.attachMedia(videoDom); // 解析到video标签上
    player.on(Hls.Events.MANIFEST_PARSED, () => {
      player.play();
      console.log("加载成功");
    });
    player.on(Hls.Events.ERROR, (event, data) => {
      //   console.log(event, data);
      // 监听出错事件
      console.log("加载失败");
    });
  } else {
    console.log('不支持')
    return
  }
}
// 停止流
function videoPause() {
  // if (this.hls) {
  //     this.$refs.video.pause();
  //     this.hls.destroy();
  //     this.hls = null;
  // }
}

</script>

<style lang="scss" scoped>
</style>