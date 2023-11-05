// 拿到自定义的 axios 实例
import axios from "~/axios";

// 获取首页统计面板信息
export function getStatistics1() {
  return axios.get("/admin/statistics1");
}
