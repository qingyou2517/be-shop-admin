// 拿到自定义的 axios 实例
import axios from "~/axios";

import { queryParams } from "~/composables/util";

// 获取订单列表
export function getOrderList(
  page,
  query = {
    tab: "all",
    no: null,
    starttime: "",
    endtime: "",
    name: "",
    phone: null,
  }
) {
  return axios.get(`/admin/order/${page}` + queryParams(query));
}

// 删除订单：批量删除
export function deleteMutiOrder(ids) {
  if (!Array.isArray(ids)) ids = [ids];
  return axios.post("/admin/order/delete_all", { ids });
}

// 订单发货
export function shipOrder(id, data) {
  return axios.post(`/admin/order/${id}/ship`, data);
}

// 拒绝or同意退款
export function handleRefund(id, data) {
  return axios.post(`/admin/order/${id}/handle_refund`, data);
}

// 导出订单
export function exportOrder(
  id,
  query = { tab: "all", starttime: "", endtime: "" }
) {
  return axios.post(`/admin/order/${id}/excelexport`, { params: query });
}

// 获取快递公司列表
export function getExpressCompanyList() {
  return axios.get(`/admin/express_company/1`);
}

// 查看订单的物流信息
export function getShipInfo(id) {
  return axios.get(`/admin/order/${id}/get_ship_info`);
}
