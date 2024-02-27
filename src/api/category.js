// 拿到自定义的 axios 实例
import axios from "~/axios";

// 获取分类列表
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
  return axios.post(`/admin/category/${id}/delete`);
}

// 获取当前分类下的推荐商品列表
export function getCategoryGoods(id) {
  return axios.get(`/admin/app_category_item/list?category_id=${id}`);
}

// 删除当前分类下的某个关联产品
export function deleteCategoryGood(id) {
  console.log("id is: ", id);
  return axios.post(`/admin/app_category_item/${id}/delete`);
}
