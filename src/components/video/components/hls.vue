<template>
  <div>
    <video controls width="300" height="300" ref="video" id="hlsVideo"></video>
  </div>
</template>

<script lang="ts" setup>
/*
 * HLS流：
 * 1、HLS是苹果公司实现的基于 HTTP 的流媒体传输协议，全称 HTTP Live Streaming，可支持流媒体的直播和点播，
 * 主要应用在 iOS 系统，为 iOS 设备（如 iPhone、iPad）提供音视频直播和点播方案。
 * 
 * 2、HLS 的基本原理就是当采集推流端将视频流推送到流媒体服务器时，服务器将收到的流信息每缓存一段时间就封包成一个新的 ts 文件，
 * 同时服务器会建立一个 m3u8 的索引文件来维护最新几个 ts 片段的索引。当播放端获取直播时，它是从 m3u8 索引文件获取最新的 ts 视频文件片段来播放，
 * 从而保证用户在任何时候连接进来时都会看到较新的内容，实现近似直播的体验。HLS 最大的不同在于直播客户端获取到的并不是一个完整的数据流，
 * 而是连续的、短时长的媒体文件，客户端不断的下载并播放这些小文件。这种方式的理论最小延时为一个 ts 文件的时长，一般情况为 2-3 个 ts 文件的时长。
 * HLS 的分段策略，基本上推荐是 10 秒一个分片，这就看出了 HLS 的缺点：
 * 
 * 通常 HLS 直播延时会达到 20-30s，而高延时对于需要实时互动体验的直播来说是不可接受的。
 * HLS 基于短连接 HTTP，HTTP 是基于 TCP 的，这就意味着 HLS 需要不断地与服务器建立连接，
 * TCP 每次建立连接时的三次握手、慢启动过程、断开连接时的四次挥手都会产生消耗。
 *  
 * HLS 的优点：
 * 数据通过 HTTP 协议传输，所以采用 HLS 时不用考虑防火墙或者代理的问题。
 * 使用短时长的分片文件来播放，客户端可以平滑的切换码率，以适应不同带宽条件下的播放。
 * HLS 是苹果推出的流媒体协议，在 iOS 平台上可以获得天然的支持，采用系统提供的 AVPlayer 就能直接播放，不用自己开发播放器。
 *  
 */
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
    // player.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'); // 设置播放路径
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
  if (player) {
    document.getElementById('hlsVideo').pause();
    player.destroy();
    player = null;
  }
}

</script>

<style lang="scss" scoped>
</style>