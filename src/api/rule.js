// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getRulesList() {
  return axios.get("/admin/rule/1");
}
