<template>
    <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>
   
<script setup>
  import { onMounted, ref, onUnmounted } from 'vue';
  import * as echarts from 'echarts';
   
  const chartRef = ref(null);
  let myChart = null;
   
  onMounted(() => {
    if (chartRef.value) {
      myChart = echarts.init(chartRef.value);
      const option = {
        title: {
          text: 'ECharts 示例'
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };
      myChart.setOption(option);
    }
  });
   
  onUnmounted(() => {
    if (myChart !== null && myChart !== undefined) {
      myChart.dispose(); // 销毁实例，释放资源
    }
  });
</script>