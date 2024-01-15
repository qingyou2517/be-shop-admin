// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getCategoryList() {
  return axios.get(`/admin/category`);
}
