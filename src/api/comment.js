// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getCommentList(page, query = { title: "" }) {
  return axios.get(`/admin/goods_comment/${page}`, { params: query });
}

// 回复商品评价
export function addComment(data) {
  return axios.post(`/goods_comment/review/${id}`, data);
}

// 修改评价状态
export function updateCommentStatus(id, status) {
  return axios.post(`/admin/goods_comment/${id}/update_status`, { status });
}
