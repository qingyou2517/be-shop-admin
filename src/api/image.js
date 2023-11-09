// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getImageList(id, page = 1) {
  return axios.get(`/admin/image_class/${id}/image/${page}`);
}

export function updateImageName(id, name) {
  return axios.post(`/admin/image/${id}`, { name });
}

export function deleteImage(ids) {
  return axios.post(`/admin/image/delete_all`, { ids });
}
