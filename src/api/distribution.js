// 拿到自定义的 axios 实例
import axios from "~/axios";
import { queryParams } from "~/composables/util";

// 分销数据统计
export function getAgentStatistics() {
  return axios.get("/admin/agent/statistics");
}

// 分销推广员列表
export function getAgentList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/agent/${page}${r}`);
}

// 推广订单列表
export function getAgentOrderList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/user_bill/${page}${r}`);
}

// 修改分销配置
export function setDistributionSetting(data) {
  return axios.post("/admin/distribution_setting/set", data);
}

// 获取分销配置
export function getDistributionSetting() {
  return axios.get(`/admin/distribution_setting/get`);
}
