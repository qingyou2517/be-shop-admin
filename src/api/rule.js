// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getRulesList() {
  return axios.get("/admin/rule/1");
}

export function updateRule(id, data) {
  return axios.post(`/admin/rule/${id}`, data);
}

export function addRule(data) {
  return axios.post("/admin/rule", data);
}
