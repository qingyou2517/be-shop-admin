import { createRouter, createWebHashHistory } from "vue-router";

import Admin from "../layouts/admin.vue";
import Index from "~/pages/index.vue";
import NotFound from "~/pages/404.vue";
import Login from "~/pages/login.vue";
import GoodList from "~/pages/goods/list.vue";
import CategoryList from "~/pages/category/list.vue";

const routes = [
  {
    path: "/",
    component: Admin,
    children: [
      {
        path: "/",
        component: Index,
        meta: {
          title: "首页",
        },
      },
      {
        path: "/goods/list",
        component: GoodList,
        meta: {
          title: "商品管理",
        },
      },
      {
        path: "/category/list",
        component: CategoryList,
        meta: {
          title: "分类列表",
        },
      },
    ],
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登录",
    },
  },
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "404",
    },
  },
];

const router = createRouter({
  // 内部提供了 history 模式的实现；为了简单起见，我们在这里使用 hash 模式
  history: createWebHashHistory(),
  routes,
});

export default router;
