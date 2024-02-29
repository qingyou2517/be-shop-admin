import axios from "axios";
import { ElNotification } from "element-plus";
import { getToken } from "~/composables/auth";
import { toast } from "~/composables/util";
import store from "./store";

const service = axios.create({
  baseURL: "/api",
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 往 header 请求头自动添加 token
    const token = getToken();
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 处理响应数据的结构
    return response.request.responseType === "blob"
      ? response.data
      : response.data.data;
  },
  function (error) {
    // 处理响应的错误信息
    const msg = error.response.data.msg;
    // 比如清空了token，然后点击修改密码
    if (msg === "非法token，请先登录！") {
      store.dispatch("userLogin").finally(() => {
        location.reload();
      });
    }
    toast(msg, "error");
    return Promise.reject(error);
  }
);

export default service;
