// 拿到自定义的 axios 实例
import axios from "~/axios";

export function getCouponList(page) {
  return axios.get(`/admin/coupon/${page}`);
}

export function addCoupon(data) {
  return axios.post("/admin/coupon", data);
}

export function updateCoupon(id, data) {
  return axios.post(`/admin/coupon/${id}`, data);
}

export function deleteCoupon(id) {
  return axios.post(`/admin/coupon/${id}/delete`);
}
