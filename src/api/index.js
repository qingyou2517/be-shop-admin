// 拿到自定义的 axios 实例
import axios from "~/axios";

// 获取首页统计面板信息
export function getStatistics1() {
  return axios.get("/admin/statistics1");
}

// 获取首页店铺提示、交易提示信息
export function getStatistics2() {
  return axios.get("/admin/statistics2");
}

// 获取首页 Echarts 图表信息
export function getStatistics3(type) {
  return axios.get("/admin/statistics3?type=" + type);
}
