// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getRolesList(page) {
  return axios.get(`/admin/role/${page}`);
}

export function addRole(data) {
  return axios.post("/admin/role", data);
}

export function updateRole(id, data) {
  return axios.post(`/admin/role/${id}`, data);
}

export function updateRoleStatus(id, status) {
  return axios.post(`/admin/role/${id}/update_status`, { status });
}

export function deleteRole(id) {
  return axios.post(`/admin/role/${id}/delete`);
}

// 配置权限
