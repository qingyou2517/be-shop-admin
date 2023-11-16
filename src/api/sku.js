// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getSkusList(page) {
  return axios.get(`/admin/skus/${page}`);
}

export function addSku(data) {
  return axios.post("/admin/skus", data);
}

export function updateSku(id, data) {
  return axios.post(`/admin/skus/${id}`, data);
}

export function updateSkuStatus(id, status) {
  return axios.post(`/admin/skus/${id}/update_status`, { status });
}

export function deleteSkus(ids) {
  // 若ids不是数组(即只删除一个)
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return axios.post("/admin/skus/delete_all", { ids });
}
