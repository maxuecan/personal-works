<template>
  <div></div>
</template>

<script lang="ts" setup>
/* 
 * 
 * RTMP流：
 * RTMP实时消息传输协议，Real Time Messaging Protocol，是 Adobe Systems 公司为 Flash 播放器和服务器之间音频、
 * 视频和数据传输开发的开放协议。协议基于 TCP是一个协议族，包括 RTMP 基本协议及 RTMPT/RTMPS/RTMPE 等多种变种。
 * RTMP 是一种设计用来进行实时数据通信的网络协议，主要用来在 Flash/AIR 平台和支持RTMP协议的流媒体/交互服务器之间进行音视频和数据通信。
 * 
 * 相对于 HLS 来说，采用 RTMP 协议时，从采集推流端到流媒体服务器再到播放端是一条数据流，因此在服务器不会有落地文件。
 * 这样 RTMP 相对来说就有这些优点：
 * 
 * 延时较小，通常为 1-3s。
 * 基于 TCP 长连接，不需要多次建连。稳定性高。
 * 支持加密： RTMPE和RTMPS为加密协议。
 * 因此业界大部分直播业务都会选择用 RTMP 作为流媒体协议。通常会将数据流封装成 FLV 通过 HTTP 提供出去。但是这样也有一些问题需要解决：
 * iOS 平台没有提供原生支持 RTMP 或 HTTP-FLV 的播放器，这就需要开发支持相关协议的播放器。
 * 协议复杂：RTMP协议比起HTTP复杂很多，导致性能低下。
 * 有累积延迟：，原因是RTMP基于TCP不会丢包。所以当网络状态差时，服务器会将包缓存起来，导致累积的延迟；待网络状况好了，就一起发给客户端。这个的对策就是，当客户端的缓冲区很大，就断开重连。
 */
</script>

<style lang="scss" scoped>
</style>
