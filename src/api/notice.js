// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getNoticeList(page) {
  return axios.get(`/admin/notice/${page}`);
}
