import router from "~/router";
import { getToken } from "~/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "~/composables/util";
import store from "./store";

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 全局loading
  showFullLoading();

  const token = getToken();
  // 若cookie中没有记录token，且要跳转到的页面不是登录页，那么强制跳转登录
  if (!token && to.path !== "/login") {
    toast("请先登录", "error");
    return next({
      path: "/login",
    });
  }

  // 防止重复登录
  if (token && to.path === "/login") {
    toast("请勿重复登录", "error");
    return next({
      path: from.path ? from.path : "/",
    });
  }

  // 若用户登录了，就自动获取用户信息，并存储在 vuex 中
  if (token) {
    await store.dispatch("getUserInfo");
  }

  // 获取和设置网页 title
  const title = to.meta.title ? to.meta.title : "";
  document.title = title + " - 商城后台";

  // 别忘了next放行，否则页面空白，也不会跳转到页面
  next();
});

// 全局后置守卫
router.afterEach((to, from) => {
  hideFullLoading();
});
