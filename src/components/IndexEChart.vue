<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { useResizeObserver } from "@vueuse/core";
import { getStatistics3 } from "~/api/index";

const currentShow = ref("hour");
const options = [
  {
    text: "近24小时",
    value: "hour",
  },
  {
    text: "近一周",
    value: "week",
  },
  {
    text: "近一个月",
    value: "month",
  },
];

// 抽离方法：渲染柱状图数据
const getEChartData = async () => {
  myChart.showLoading();
  let xData, yData;
  try {
    let res = await getStatistics3(currentShow.value);
    xData = res.x;
    yData = res.y;
  } finally {
    myChart.hideLoading();
  }

  const chartOption = {
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: yData,
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
  chartOption && myChart.setOption(chartOption);
};

// 获取图表容器、调用 init 方法
let myChart = null;
onMounted(() => {
  const chartDom = document.getElementById("chart-wrapper");
  // 在 #chart-wrapper 盒子里初始化 echarts
  myChart = echarts.init(chartDom);
  getEChartData();
});

// 页面销毁前，销毁 myChart
onBeforeUnmount(() => {
  if (myChart) echarts.dispose(myChart);
});

// 点击切换 title
const handleChoose = (type) => {
  currentShow.value = type;

  getEChartData();
};

// 浏览器大小变化时
const el = ref(null);
useResizeObserver(el, (entries) => myChart.resize());
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center">
          <span class="text-sm">订单统计</span>
          <div class="ml-auto">
            <el-check-tag
              class="mr-2"
              v-for="(item, index) in options"
              :key="index"
              :checked="currentShow === item.value"
              @click="handleChoose(item.value)"
            >
              {{ item.text }}
            </el-check-tag>
          </div>
        </div>
      </template>

      <div ref="el" id="chart-wrapper" class="w-full h-[300px]"></div>
    </el-card>
  </div>
</template>

<style scoped></style>
