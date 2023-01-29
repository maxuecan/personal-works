<template>
  <div></div>
</template>

<script>
export default {
  // 数组语法
  // emits: ['check'],
  // 对象语法
  emits: {
    // 没有验证函数
    click: null,
    // 具有验证函数
    submits: (payload) => {
      if (payload.email && payload.password) {
        return true
      } else {
        console.warn(`Invalid submit event payload!`)
        return false
      }
    }
  },
  data() {
    return {

    }
  },
  created() {
    this.$emit('submits', {
      email: 1,
      password: 2
    })
  }
}

</script>
<style lang='scss' scoped>
</style>