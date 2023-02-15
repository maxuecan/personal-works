<template>
  <div>
    <video controls width="300" height="300" id="flvVideo"></video>
  </div>
</template>

<script lang="ts" setup>
/* 
 * flv
 * 直播: 涉及到了推流和拉流
 * 拉流的话有 cnd 流和 rtmp 的流，cnd 的流是有延迟的，而 rtmp 的流实时的，但是这个需要收费的, 使用 rtmp 的流在画中画的时候是拿不到里面的画面的
 * 
 * cdn 拉流的几种方式：
 * RTMP: 实时消息传输协议，基于 TCP，在浏览器端依赖 Flash。
 * HTTP-FLV: 基于 HTTP 流式 IO 传输 FLV，依赖浏览器支持播放 FLV。
 * WebSocket-FLV: 基于 WebSocket 传输 FLV，依赖浏览器支持播放 FLV。
 * HLS: Http Live Streaming，苹果提出基于 HTTP 的流媒体传输协议。HTML5 可以直接打开播放。对应视频格式就是 m3u8, 延迟较高。
 * 
 * FLV
 * 是一种在网络上传输的流媒体数据存储容器格式。其格式相对简单轻量，不需要很大的媒体头部信息。
 * 整个FLV由 The FLV Header, The FLV Body 以及其它 Tag 组成。因此加载速度极快。
 * 采用 FLV 格式封装的文件后缀为 .flv。而HTTP-FLV 即将流媒体数据封装成 FLV 格式，然后通过 HTTP 协议传输给客户端。
 */

 import flvjs from 'flv.js'
import { onMounted, nextTick, ref } from 'vue'

let player = ref(null) as any

onMounted(async () => {
  await nextTick()
  createdPlay()
})

function createdPlay() {
  // 检测浏览器是否支持flv.js
  if (flvjs.isSupported()) {
    // 正常网速
    let videoDom = document.getElementById('flvVideo') as any
    // 创建一个播放器实例
    player = flvjs.createPlayer(
      {
        type: 'mp4', // 媒体类型，默认是flv
        isLive: false, // 是否是直播流
        hasAudio: false, // 是否是音频
        hasVideo: true, // 是否有视频
        url: 'src/assets/video/fire-phoenix.mp4', // 流地址
      }
    )
    player.attachMediaElement(videoDom)
    player.load()
    // player.play() // 浏览器兼容，不允许自动播放

    // 异常处理
    player.on(flvjs.Events.ERROR, (errType, errDetail) =>{
      console.log(errType, errDetail)
    })

    // 网络延迟
    let timer = setInterval(() => {
      if (player.buffered && player.buffered.length) {
        let end = player.buffered.end(0); // 获取当前buffered值
        let diff = end - player.currentTime; // 获取buffered与currentTime的差值
        if (diff >= 60) {// 如果差值大于等于60s 手动跳帧 这里可根据自身需求来定
          //单个视频
          player.currentTime = end;//手动跳帧
          player.currentTime = player.buffered.end(0);//手动跳帧

          // 多个视频
          // clearInterval(timer)
          // player.pause();
          // player.unload();
          // player.detachMediaElement();
          // player.destroy();
          // player= null;
          // //重新加载当前停止的视频流，根据个人的方法来配置
          // createdPlay()
        }
      }
    }, 2000); //2000毫秒执行一次

    // 中断重连
    player.on(flvjs.Events.ERROR, (errType, errDetail) =>{
      if(player){
        destroyVideo()
        createdPlay()
      }
    })
  }
}

function destroyVideo() {
  if (!player) return
  player.pause()
  player.unload()
  player.detachMediaElement()
  player.destory()
  player.value = null
}

</script>

<style lang="scss" scoped>
</style>
