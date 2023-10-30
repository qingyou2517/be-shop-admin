import axios from "axios";
import { ElNotification } from "element-plus";
import { useCookies } from "@vueuse/integrations/useCookies";

const service = axios.create({
  baseURL: "/api",
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 往 header 请求头自动添加 token
    const cookie = useCookies();
    const token = cookie.get("admin-token");
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
    return response.data.data;
  },
  function (error) {
    // 处理响应的错误信息
    ElNotification({
      type: "error",
      message: error.response.data.msg || "请求失败",
      duration: 3000,
    });
    return Promise.reject(error);
  }
);

export default service;
