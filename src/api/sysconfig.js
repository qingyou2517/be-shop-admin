// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getSysconfigList() {
  return axios.get("/admin/sysconfig");
}

export function setSysconfig(data) {
  return axios.post("/admin/sysconfig", data);
}

// 上传文件
export const uploadAction = "/admin/sysconfig/upload";
