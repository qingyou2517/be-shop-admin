// 拿到自定义的 axios 实例
import axios from "~/axios";

import { queryParams } from "~/composables/util";

export function login(username, password) {
  return axios.post("/admin/login", {
    username,
    password,
  });
}

// 获取管理员信息
export function getInfo() {
  return axios.post("/admin/getinfo");
}

// 退出登录
export function logout() {
  return axios.post("/admin/logout");
}

// 修改密码
export function updatePassword({ oldpassword, password, repassword }) {
  return axios.post("/admin/updatepassword", {
    oldpassword,
    password,
    repassword,
  });
}

// 获取管理员列表
export function getManagerList(page, query = {}) {
  return axios.get(`/admin/manager/${page}` + queryParams(query));
}

// 修改管理员状态
export function updateManagerStatus(id, status) {
  // 注意第二个参数需要是对象
  return axios.post(`/admin/manager/${id}/update_status`, { status });
}

// 新增管理员
export function addManager(data) {
  return axios.post(`/admin/manager`, data);
}

// 修改管理员
export function updateManager(id, data) {
  return axios.post(`/admin/manager/${id}`, data);
}

// 删除管理员
export function deleteManager(id) {
  return axios.post(`/admin/manager/${id}/delete`);
}
