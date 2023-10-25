import { createRouter, createWebHashHistory } from "vue-router";

const routes = [];

const router = VueRouter.createRouter({
  // 内部提供了 history 模式的实现；为了简单起见，我们在这里使用 hash 模式
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
