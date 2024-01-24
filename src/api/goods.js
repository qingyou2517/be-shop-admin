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

// 查看商品资料
export function readGoods(id) {
  return axios.get(`/admin/goods/read/${id}`);
}

// 设置商品轮播图
export function setGoodsBanner(id, data) {
  return axios.post(`/admin/goods/banners/${id}`, data);
}

// 设置商品规格
export function updateGoodsSkus(id, data) {
  return axios.post(`/admin/goods/updateskus/${id}`, data);
}

// （多规格下）新增商品规格选项
export function createGoodsSkusCard(data) {
  return axios.post(`/admin/goods_skus_card`, data);
}

// （多规格下）修改商品规格选项
export function updateGoodsSkusCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}`, data);
}

// （多规格下）删除商品规格选项
export function deleteGoodsSkusCard(id) {
  return axios.post(`/admin/goods_skus_card/${id}/delete`);
}

// （多规格下）商品规格选项上下排序
export function sortGoodsSkusCard(data) {
  return axios.post(`/admin/goods_skus_card/sort`, data);
}

// （多规格下）添加规格选项值
export function createGoodsSkusCardValue(data) {
  return axios.post(`/admin/goods_skus_card_value`, data);
}

// （多规格下）修改规格选项值
export function updateGoodsSkusCardValue(id, data) {
  return axios.post(`/admin/goods_skus_card_value/${id}`, data);
}

// （多规格下）删除规格选项值
export function deleteGoodsSkusCardValue(id) {
  return axios.post(`/admin/goods_skus_card_value/${id}/delete`);
}
