<template>
  <div>
    <el-radio-group v-model="radio" @change="changeHandler">
      <el-radio :label="3">备选项3</el-radio>
      <el-radio :label="6">备选项6</el-radio>
      <el-radio :label="9">备选项9</el-radio>
      <el-radio :label="12">备选项12</el-radio>
    </el-radio-group>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
      <el-table-column
        v-if="radio === 3 || radio === 9"
        prop="province"
        label="城市">
      </el-table-column>
      <el-table-column
        v-if="radio === 6"
        prop="city"
        label="地区">
      </el-table-column>
      <el-table-column
        v-if="radio === 9"
        prop="zip"
        label="编码">
      </el-table-column>
      <el-table-column
        v-if="radio === 12"
        prop="tag"
        label="标签">
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

let radio = ref(3)

let tableData = [{
  date: '2016-05-02',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
  province: '上海',
  city: '普陀区',
  zip: 200333,
  tag: '家'
}, {
  date: '2016-05-04',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1517 弄',
  province: '上海',
  city: '普陀区',
  zip: 200333,
  tag: '家'
}, {
  date: '2016-05-01',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1519 弄',
  province: '上海',
  city: '普陀区',
  zip: 200333,
  tag: '家'
}, {
  date: '2016-05-03',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1516 弄',
  province: '上海',
  city: '普陀区',
  zip: 200333,
  tag: '家'
}]

function changeHandler(e) {
  // console.log(e)
}

</script>

<style lang="scss" scoped>

</style>