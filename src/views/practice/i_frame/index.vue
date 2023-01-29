<script setup>
/* 
 * iframe跨域
 * 模拟跨域
 * 例如：app游戏里面，有些活动功能，会使用iframe嵌套页面，作为打开一个功能（领取奖励，绑定手机号等）型页面，
 * 这样子app与页面之间就会存在跨域问题
 * 好处：app资源的释放（包大小，分离）
 */
import { onMounted } from 'vue'
onMounted(() => {
  // 1、通过获取 iframe 元素进而通过 contentWindow 属性获取 iframe 中的 window 对象
  var iframe = document.getElementById("iframeId"); //获取iframe标签
  var iframeContent = iframe.contentWindow; //获取iframe的window对象
  var idoc = iframeContent.document; //获取iframe的document对象

  // 2、结合iframe中的 name 属性，通过window提供的 frames 获取
  // 打印iframe中页面的window对象
  // console.log(window.frames['iframeName'].window);

  // 获取上一级的 window 对象，如果还是iframe则是该iframe的window对象
  // console.log(window.parent)
  // 获取最顶级容器的 window 对象，即，就是你打开页面的文档
  // console.log(window.top)
  // 返回自身 window 的引用。
  // console.log(window.self)
  // console.log(window.parent === window.top, window.parent === window.self)
  // console.log(window.top === window.self)

  // 父子通信
  window.addEventListener('message', (e) => {
    console.log(e, '父级监听')
  }, false)
})
function postData() {
  // 获取iframe元素
  var id = document.getElementById('iframeId');
  // 发送数据，触发子页面的postMessage监听事件
  id.contentWindow.postMessage('我是父元素的数据', '*')
  // message：将要发送到其他 window 的数据。
  // targetOrigin：通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）
}
</script>

<template>
  <div>
    <iframe
      name="iframeName"
      width="500px"
      height="500px"
      src="src/views/practice/i_frame/test.html" 
      frameborder="0"
      scrolling="no"
      id="iframeId"
    >
    </iframe>
    <button @click="postData">父按钮</button>
  </div>
</template>

<style scoped>
</style>