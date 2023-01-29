<template>
  <div>
    <!-- 第一种方式 -->
    <!-- <swiper
      :slides-per-view="3"
      :space-between="50"
      :Autoplay="autoPlay"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
    </swiper> -->

    <!-- 第二种方式 -->
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">slider1</div>
        <div class="swiper-slide">slider2</div>
        <div class="swiper-slide">slider3</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import 'swiper/css';

/* 第一种方式 */
// import { Swiper, SwiperSlide } from 'swiper/vue';
// function onSwiper(swiper) {
//   console.log(swiper)
// }
// function onSlideChange() {
//   console.log('slide change')
// }

/* 第二种方式 */
import Swiper from 'swiper'

onMounted(() => {
  nextTick(() => {
    const swiper = new Swiper('.swiper', {
      width: 800, // 强制Swiper的宽度(px)
      // height: 500, // 强制Swiper的高度(px)
      // autoHeight: true, //高度随内容变化
      initialSlide: 1, // 设定初始化时slide的索引
      direction: 'horizontal', // 水平方向切换 horizontal 或垂直方向切换 vertical
      speed: 300, // 切换速度
      roundLengths : true, // 将slide的宽和高取整(四舍五入)
      grabCursor : true, // 鼠标覆盖Swiper 时指针会变成手掌形状，拖动时指针会变成抓手形状
      setWrapperSize :true, // 在Wrapper上添加等于slides相加的宽或高
      autoplay: true,
      // breakpointsBase: 'container', // window（默认） container
      // breakpoints: { // 断点设定 类似于CSS响应式布局的media only screen and (min-width: 480px)
      // 320: {  //当屏幕宽度大于等于320
      //   slidesPerView: 2,
      //   spaceBetween: 10
      // },
      // 768: {  //当屏幕宽度大于等于768 
      //   slidesPerView: 3,
      //   spaceBetween: 20
      // },
      // 1280: {  //当屏幕宽度大于等于1280
      //   slidesPerView: 4,
      //   spaceBetween: 30
      // }
      // watchSlidesProgress : false, // 计算每个slide的progress，Swiper的progress
      // virtualTranslate : false, // 滑动Swiper，slide没移动，但是swiper切换了
      // uniqueNavElements: false, // 默认为true时，优先使用container内的分页器。设置为false后，container以外的分页器也生效了。
      // nested:true, // 用于嵌套相同方向的swiper时，当切换到子swiper时停止父swiper的切换
      // runCallbacksOnInit : true, // 初始化时会触发一次回调函数
      // on:{ // 注册事件
      //   slideChangeTransitionStart:function(){
      //     alert('触发了回调');
      //   },
      // },
      // init: false, // 当你创建一个Swiper实例时是否立即初始化
    })
  })
})

</script>

<style>
</style>