// 拿到自定义的 axios 实例
import axios from "~/axios";

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
