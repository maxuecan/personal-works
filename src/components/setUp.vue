<template>
  <div>
    <button @click="count++">{{ count }} {{ plusOne }}</button>
  </div>
</template>

<script>
import { h, ref, reactive, toRefs, toRef, computed, watch } from 'vue'
export default {
  props: {
    title: String
  },
  /* 
   * 第一个参数是组件的 props
   * 第二个参数是一个 Setup 上下文对象 context === { attrs, slots, emit, expose }
   */
  setup(props, context) {
    // 第一个参数是组件的 props
    const { title } = toRefs(props)
    const title1 = toRef(props, 'title')
    const count = ref(0)
    // console.log(title.value)
    // console.log(title1.value)
    // console.log(props.title)

    // 第二个参数是一个 Setup 上下文对象
    // Attribute（非响应式的对象，等价于 $attrs）
    // console.log(context.attrs)
    // 插槽（非响应式的对象，等价于 $slots）
    // console.log(context.slots)
    // 触发事件（函数，等价于 $emit）
    // console.log(context.emit)
    // 暴露公共 property（函数）
    // console.log(context.expose)
    // 让组件实例处于 “关闭状态”
    // 即不向父组件暴露任何东西
    // context.expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    context.expose({ count: publicCount })
    
    const plusOne = computed({
      get: () => count.value + 1,
      set: (val) => {
        count.value = value - 1
      }
    })
    // 调试
    // const plusOne = computed(() => {
    //   onTrack(e) {
    //     debugger
    //   },
    //   onTrigger(e) {
    //     debugger
    //   }
    // })

    // reactive
    const obj = reactive({ count })
    // console.log(obj.count === count.value)

    // watch
    const state = reactive({ count: 0 })
    watch(
      () => state.count,
      (count, prevCount) => {
        console.log(count, prevCount)
      }
    )

    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      count,
      plusOne
    }
    // return () => h('div', count.value)
  },
  mounted() {
    // console.log(this.count)
  }
}
</script>

<style></style>
