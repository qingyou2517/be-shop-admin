// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getImageClassList(page) {
  return axios.get("/admin/image_class/" + page);
}
