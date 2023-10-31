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
