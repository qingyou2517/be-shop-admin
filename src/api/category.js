// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getCategoryList() {
  return axios.get(`/admin/category`);
}

export function updateCategory(id, data) {
  return axios.post(`/admin//category/${id}`, data);
}

export function addCategory(data) {
  return axios.post("/admin/category", data);
}

export function updateCategoryStatus(id, status) {
  return axios.post(`/admin//category/${id}/update_status`, { status });
}

export function deleteCategory(id) {
  return axios.post(`/admin//category/${id}/delete`);
}
