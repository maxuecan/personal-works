<template>
  <div class="canvas-container">
    <div class="container">
      <div class="catalogue">
        <ul @click="catalogueChange">
          <li v-for="(item, index) in catalogue" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="content">
        <keep-alive>
          <component :is="currentComp"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ShiZhong from './components/时钟.vue'
import GuaGuaKa from './components/刮刮卡.vue'
import DongTaiLiZi from './components/动态粒子.vue'
import Describe from './components/按住鼠标移动绘制出轨迹.vue'
import { defineComponent, shallowRef, ref } from 'vue';

export default defineComponent({
  setup(props, ctx) {
    let catalogue = [
      '如乃神掌',
      '葵花点穴手',
      '铁砂掌',
      '乾坤大挪移',
    ]

    let content = [
      Describe,
      DongTaiLiZi,
      GuaGuaKa,
      ShiZhong,
    ]

    //这里用ref的话，vue给出警告Vue接收到一个组件，该组件被制成反应对象。这可能会导致不必要的性能开销，应该通过将组件标记为“markRaw”或使用“shallowRef”而不是“ref”来避免。
    // 如果使用 markRaw 那么currentComp将不永远不会再成为响应式对象。 所以得使用 shallowRef
    let currentComp = shallowRef(content[0])

    let is_active = ref(0)

    const catalogueChange = (e: any) => {
      if (e.srcElement.nodeName === 'LI') {
        is_active.value = catalogue.indexOf(e.target.innerText)
        currentComp.value = content[is_active.value]
      }
    }

    return {
      catalogue,
      currentComp,
      catalogueChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.canvas-container {
  width: 80%;
  height: 80%;
  position: absolute;
  left: 10%;
  top: 10%;
  background: white;
  background-size: 100% 100%;
  color: gray;
  opacity: 1;
  cursor: pointer;
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    .catalogue {
      width: 20%;
      padding: 14px;
      background: #cd9a5b;
      color: white;
      & > ul > li {
        margin: 15px 0 0 0;
      }
    }
    .content {
      width: 80%;
    }
  }
}
</style>
