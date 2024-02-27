// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getLevelList(
  page,
  query = { limit: 10, keyword: "", user_level_id: 0 }
) {
  return axios.get(`/admin/user_level/${page}`, { params: query });
}

export function addLevel(data) {
  return axios.post("/admin/user_level", data);
}

export function updateLevel(id, data) {
  return axios.post(`/admin/user_level/${id}`, data);
}

export function updateLevelStatus(id, status) {
  return axios.post(`/admin/user_level/${id}/update_status`, { status });
}

export function deleteLevel(id) {
  return axios.post(`/admin/user_level/${id}/delete`);
}
