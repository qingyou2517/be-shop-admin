// 拿到自定义的 axios 实例
import axios from "~/axios";

import { queryParams } from "~/composables/util";

// 获取商品列表
export function getGoodsList(page, query = {}) {
  return axios.get(`/admin/goods/${page}` + queryParams(query));
}

// 修改商品状态：批量上架、下架
export function updateGoodsStatus(ids, status) {
  if (!Array.isArray(ids)) ids = [ids];
  return axios.post("/admin/goods/changestatus", { ids, status });
}

// 新增商品
export function addGood(data) {
  return axios.post(`/admin/goods`, data);
}

// 修改商品
export function updateGood(id, data) {
  return axios.post(`/admin/goods/${id}`, data);
}

// 删除商品：批量删除
export function deleteGoods(ids) {
  if (!Array.isArray(ids)) ids = [ids];
  return axios.post("/admin/goods/delete_all", { ids });
}
