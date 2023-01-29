<template>
  <div>
    <h3 class="center">按钮元素“包裹性”示意实例页面</h3>
    <div class="box1">
      <button>按钮</button>
    </div>

    <h3 class="center">按钮元素“包裹性”示意实例页面</h3>
    <div class="box2">
      <p ref="content" id="conMore" class="content">文字内容</p>
    </div>
    <!-- 按钮 -->
    <p><button id="btnMore" @click="btnMore">更多文字</button></p>
    <!-- <div ref="getDivDom" v-for="item in list" :data-id="item.id"></div> -->
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref } from 'vue'
// const divDom = ref(null)
// const list = [1,2,3,4]
// const divDomList = ref(new Map())
// const getDivDom = el => {
//   if (el) {
//     divDomList.set(el.dataset['id'], el)
//   }
// }

/* 获取DOM */
function btnMore() {
  // 第一种
  document.getElementById('conMore').innerHTML += '-新增文字'
  // console.log('获取dom元素', document.getElementById('conMore'))
  // 第二种 （暂不确定）
  // console.log('获取dom元素', divDom)
  // console.log('获取dom元素', divDomList)
}
</script>

<style lang="scss" scoped>
.box1 {
    width: 240px;
    margin: 20px auto;
}
.box2 {
  padding: 10px;
  background-color: #cd0000;
  text-align: center;
}
.content {
  display: inline-block;
  text-align: left;
}
</style>