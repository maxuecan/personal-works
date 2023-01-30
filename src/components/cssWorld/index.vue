<template>
  <div class="css-world">
    <div class="container">
      <div class="hamburger_menu">
        <input type="checkbox" id="toggle" ref="toggle" />
        <label for="toggle">
          <div class="hamburger_container">
            <span></span>
            <span></span>
          </div>
        </label>
        <ul @click="catalogueChange">
          <li v-for="(item, index) in catalogue" :key="index" :class="is_active === index ? 'active' : ''">
            {{ index + 1 }}，{{ item }}
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
// import Zero from './components/0，test.vue'
import One from './components/1，block水平元素与清除浮动实例页面.vue'
import Two from './components/2，inline-table内联表格特性展示实例页面.vue'
import Three from './components/3，table-layout(auto)的表格的一柱擎天现象实例页面.vue'
import Four from './components/4，nowrap不换行超出容器限制实例页面.vue'
import Five from './components/5，“外部尺寸”block元素的流动性示意实例页面.vue'
import Sive from './components/6，按钮元素“包裹性”示意实例页面.vue'
import Seven from './components/7，“首选最小宽度”与凹凸效果实例页面.vue'
import Eight from './components/8，“最大宽度”与iScroll水平滚动实例页面.vue'
import Nice from './components/9，width, padding, border同时存在的宽度表现实例页面.vue'
import Ten from './components/10，textarea 宽度百分百自适应效果实例页面.vue'
import Eleven from './components/11，width百分百与不存在死循环佐证实例页面.vue'
import Twelve from './components/12，绝对定位和非绝对定位元素百分比值计算区别实例页面.vue'
import Thirteen from './components/13，任意大小图片的左右半区布局实例页面.vue'
import Fourteen from './components/14，max-width覆盖width实例页面.vue'
import Fifteen from './components/15，max-height与任意高度元素滑动展开收起效果实例页面.vue'
import Sixteen from './components/16，content图片尺寸不受width与height限制实例页面.vue'
import Seventeen from './components/17，src缺省时img元素的alt信息展示技术实例页面.vue'
import Eighteen from './components/18，content属性生成图片实例页面.vue'
import Nineteen from './components/19，利用content属性实现图片变化效果实例页面.vue'
import Twenty from './components/20，普通元素content属性变成替换元素实例页面.vue'
import TwentyOne from './components/21，content生成内容无法影响empty伪类实例页面.vue'
import TwentyTwo from './components/22，content辅助元素与布局实例页面.vue'
// import TwentyThree from './components/23，content换行符与打点loading效果实例页面.vue'
import TwentyFour from './components/24，content图片生成与新标签页地址标记实例页面.vue'
import TwentyFive from './components/25，CSS计数器counter-reset值为2实例页面.vue'
import TwentySix from './components/26，CSS计数器counter()方法style参数示意实例页面.vue'
import TwentySeven from './components/27，CSS计数器多个counter并存实例页面.vue'
import TwentyEight from './components/28，内联元素垂直padding也有作用实例页面.vue'
import TwentyNine from './components/29，内联元素padding与高度可控的分隔线实例页面.vue'
import Thirty from './components/30，百分比padding值与等比例头图效果实例页面.vue'
import ThirtyOne from './components/31，padding与图形生成实例页面.vue'
import ThirtyTwo from './components/32，margin与一栏定宽的两栏自适应布局实例页面.vue'
import ThirtyThree from './components/33，margin负值与等高布局实例页面.vue'
import ThirtyFour from './components/34，margin父子合并与头图掉落实例页面.vue'
import ThirtyFive from './components/35，margin(auto)的计算规则示意实例页面.vue'
import ThirtySix from './components/36，margin(auto)与绝对定位元素的水平垂直居中实例页面.vue'
import ThirtySeven from './components/37，border绘制与color变色实例页面.vue'
import ThirtyEight from './components/38，优雅增加点击区域之搜索框清除按钮实例页面.vue'
import ThirtyNine from './components/39，基于border实现的小圆角效果实例页面.vue'
import FortyOne from './components/40，border实现等高布局实例页面.vue'
import { defineComponent, ref, shallowRef, getCurrentInstance } from 'vue'

export default defineComponent({
  setup(props, ctx) {
    let catalogue = [
      'block水平元素与清除浮动实例页面',
      'inline-table内联表格特性展示实例页面',
      'table-layout(auto)的表格的一柱擎天现象实例页面',
      'nowrap不换行超出容器限制实例页面',
      '“外部尺寸”block元素的流动性示意实例页面',
      '按钮元素“包裹性”示意实例页面',
      '“首选最小宽度”与凹凸效果实例页面',
      '“最大宽度”与iScroll水平滚动实例页面',
      'width, padding, border同时存在的宽度表现实例页面',
      'textarea 宽度百分百自适应效果实例页面',
      'width百分百与不存在死循环佐证实例页面',
      '绝对定位和非绝对定位元素百分比值计算区别实例页面',
      '任意大小图片的左右半区布局实例页面',
      'max-width覆盖width实例页面',
      'max-height与任意高度元素滑动展开收起效果实例页面',
      'content图片尺寸不受width与height限制实例页面',
      'src缺省时img元素的alt信息展示技术实例页面',
      'content属性生成图片实例页面',
      '利用content属性实现图片变化效果实例页面',
      '普通元素content属性变成替换元素实例页面',
      'content生成内容无法影响empty伪类实例页面',
      'content辅助元素与布局实例页面',
      // 'content换行符与打点loading效果实例页面',
      'content图片生成与新标签页地址标记实例页面',
      'CSS计数器counter-reset值为2实例页面',
      'CSS计数器counter()方法style参数示意实例页面',
      'CSS计数器多个counter并存实例页面',
      '内联元素垂直padding也有作用实例页面',
      '内联元素padding与高度可控的分隔线实例页面',
      '百分比padding值与等比例头图效果实例页面',
      'padding与图形生成实例页面',
      'margin与一栏定宽的两栏自适应布局实例页面',
      'margin负值与等高布局实例页面',
      'margin父子合并与头图掉落实例页面',
      'margin(auto)的计算规则示意实例页面',
      'margin(auto)与绝对定位元素的水平垂直居中实例页面',
      'border绘制与color变色实例页面',
      '优雅增加点击区域之搜索框清除按钮实例页面',
      '基于border实现的小圆角效果实例页面',
      'border实现等高布局实例页面'
    ]
    let content= [
      // Zero,
      One,
      Two,
      Three,
      Four,
      Five,
      Sive,
      Seven,
      Eight,
      Nice,
      Ten,
      Eleven,
      Twelve,
      Thirteen,
      Fourteen,
      Fifteen,
      Sixteen,
      Seventeen,
      Eighteen,
      Nineteen,
      Twenty,
      TwentyOne,
      TwentyTwo,
      // TwentyThree,
      TwentyFour,
      TwentyFive,
      TwentySix,
      TwentySeven,
      TwentyEight,
      TwentyNine,
      Thirty,
      ThirtyOne,
      ThirtyTwo,
      ThirtyThree,
      ThirtyFour,
      ThirtyFive,
      ThirtySix,
      ThirtySeven,
      ThirtyEight,
      ThirtyNine,
      FortyOne
    ]

    let is_active = ref(0)

    //这里用ref的话，vue给出警告Vue接收到一个组件，该组件被制成反应对象。这可能会导致不必要的性能开销，应该通过将组件标记为“markRaw”或使用“shallowRef”而不是“ref”来避免。
    // 如果使用 markRaw 那么currentComp将不永远不会再成为响应式对象。 所以得使用 shallowRef
    let currentComp = shallowRef(content[0])

    let { proxy } = getCurrentInstance() as any

    const catalogueChange = (e: any) => {
      if (e.srcElement.nodeName === 'LI') {
        proxy.$refs.toggle.checked = false
        is_active.value = catalogue.indexOf(e.target.innerText.split('，')[1])
        currentComp.value = content[is_active.value]
      }
    }

    return {
      catalogue,
      is_active,
      currentComp,
      catalogueChange,
    }
  },
})
</script>

<style scoped lang="scss">
.css-world {
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
    display: block;
    overflow: hidden;
    .content {
      width: 100%;
    }
  }
}
.active {
  color: red
}

.hamburger_menu {
	width: 100%;
	height: 3rem;
  display: block;
	background-color: #000;
}
.hamburger_menu #toggle {
	display: none;
}
.hamburger_menu label {
	display: block;
	width: 3rem;
	height: 3rem;
	cursor: pointer;
}
.hamburger_menu label .hamburger_container {
	position: relative;
	top: 1.0625rem;
	left: .875rem;
	width: 1.25rem;
	height: 1.25rem;
}
.hamburger_menu label .hamburger_container span {
	position: relative;
	top: 0;
	display: block;
	height: 1px;
	background-color: #fff;
	/* 在设置取消选中的过渡时间 */
	/* 反之 */
	transition: transform 0.2s ease-in-out, top 0.2s ease-in-out 0.2s;
}
/* 设置第二条线 */
.hamburger_menu label .hamburger_container span:nth-child(2) {
	top: .625rem;
}
/* 设置转换 */
/* + 是相邻兄弟选择器 找相邻的label */
.hamburger_menu #toggle:checked + label .hamburger_container span:nth-child(1) {
	top: 5px;
	transform: rotate(45deg);
	transition: top 0.2s ease-in-out, transform 0.2s ease-in-out 0.2s;
}
.hamburger_menu #toggle:checked + label .hamburger_container span:nth-child(2) {
	top: .3125rem;
	transform: rotate(-45deg);
	transition: top 0.2s ease-in-out, transform 0.2s ease-in-out 0.2s;
}
.hamburger_menu ul {
	width: 100vm;
	/* 让高度占浏览器可视区域的100% 减去 顶部高度 */
	height: calc(100vh - 180px);
	padding: 0 50px;
	transform: scaleY(0);
	transition: all 0.4s ease-in-out;
	transform-origin: 50% 0;
	background-color: rgba(0, 0, 0, 0.9);
	opacity: 0;
  overflow-y: scroll;
}
.hamburger_menu ul li {
	list-style: none;
	height: 50px;
	line-height: 50px;
	color: #fff;
	font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow-wrap: break-word;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
.hamburger_menu #toggle:checked ~ ul {
	transform: scaleY(1);
	/* 选中后是不透明 */
	opacity: 1;
}

@media (max-width: 768px) {
  .css-world {
    width: 100%;
    left: 0;
  }
}
</style>
