<template>
  <div>
    <flv />
    <!-- <hls /> -->
  </div>
</template>

<script lang="ts">
/* 
 * flv
 * FLV: FLASH VIDEO,基于flash来播放，是目前增长最快、最为广泛的视频传播格式。
 * 优点: flv用http服务器即可实现传统的流媒体服务器的功能。flv文件体积小，视频质量良好。众多视频网站均采用此视频格式。
 * 缺点：要基于flash插件，当浏览器未安插或禁用flash插件，就不能播放。
 * 原生的h5 video仅支持播放mp4/webm格式。前端处理flv格式的视频流时，引用了flv.js插件。该插件纯原生js开发，没有用到flash，由  bilibili开源。flv.js在获取到flv格式的视频数据进行转码，最终传递给原生h5 video标签进行播放。
 * 
 * HLS
 * HLS：HTTP Live Streaming，是由苹果公司提出的基于HTT的流媒体网络传输协议。他的工作原理是把整个流分成一个个小的基于HTTP的文件来下载，每次只下载一些。当媒体流正在播放时，客户端可以选择从愈多不同的备用源中以不同的速率下载同样的资源。在开始一个流媒体会话时，客户端会下载一个包含源数据的extended M3U（m3u8）playlist文件，用于寻找可用的媒体流。
 * HLS的出现是为了解决苹果原生环境中的流媒体播放。在苹果的相关系统上Safari浏览器是可以直接打开m3u8地址的。在别的系统上需要借助h5的video标签.
 * 优点：客户端支持简单，只需要支持HTTP请求即可，方便通过防火墙或者代理服务器。因为他会将数据分割成多个片段，所以客户端可以很快的实现码率切换，以适应不同的带宽，主要应用于手机端。
 * 缺点：因其自己的实现方式，需要多次请求，HLS存在的延迟比别的协议会高，不适用于直播，HLS对于网络质量的要求比较高。
 * 前端在处理HLS的视频流时，引入了video.js
 * 
 * RTSP
 * RTSP (Real Time Streaming Protocol)实时传输协议。 大屏项目上大部分的视频都是通过安监摄像头传输过来的，因为这个协议诞生的比较早，国内大部分的安监厂商都是直接提供的RTSP的视频流，再配他厂商自己的插件或者安装vlc插件来进行播放。
 * 优点：延时低，厂商直接提供，不需要再进行转换，实现网络负载均衡，给服务减少压力。
 * 缺点：不支持移动端。浏览器兼容性差，一般只支持低版本浏览器，需要安装插件。
 */
// import flv from './components/flv.vue'
// import hls from './components/hls.vue'
</script>

<style lang="scss" scoped>
</style>