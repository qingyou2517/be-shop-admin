import { useCookies } from "@vueuse/integrations/useCookies";

const tokenKey = "admin-token";
const cookie = useCookies();

// 获取token
export function getToken() {
  return cookie.get(tokenKey);
}

// 设置token
export function setToken(tokenKey, tokenValue) {
  return cookie.set(tokenKey, tokenValue);
}

// 删除token
export function removeToken() {
  return cookie.remove(tokenKey);
}
