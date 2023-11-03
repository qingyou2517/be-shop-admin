import { createRouter, createWebHashHistory } from "vue-router";

import Admin from "../layouts/admin.vue";
import Index from "~/pages/index.vue";
import NotFound from "~/pages/404.vue";
import Login from "~/pages/login.vue";
import GoodList from "~/pages/goods/list.vue";
import CategoryList from "~/pages/category/list.vue";

// 默认路由，所有用户共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
    // 子路由
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

// 动态路由表，用于匹配 menus 菜单 => 把这张动态路由表里面的哪些路由添加到 Admin 组件下
const dynamicRoutes = [
  {
    path: "/",
    name: "/", // name 要唯一，所以可以定义的和 path 一样
    component: Index,
    meta: {
      title: "首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodList,
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
      title: "分类列表",
    },
  },
];

// 导出 router
export const router = createRouter({
  // 内部提供了 history 模式的实现；为了简单起见，我们在这里使用 hash 模式
  history: createWebHashHistory(),
  routes,
});

// 导出动态添加路由的方法
// 后端传递的 menus 是二级菜单，既然有二级嵌套，那可以递归遍历 menus 来匹配动态路由的字段
export function addDynamicRoutes(menus) {
  let hasNewRoutes = false;

  // 形参 arr 代表一级菜单
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((item) => {
      let routeObj = dynamicRoutes.find((obj) => obj.path === item.frontpath);
      // 若在动态路由表内查找成功，且之前没有注册这个路由
      if (routeObj && !router.hasRoute(routeObj.path)) {
        router.addRoute("admin", routeObj); // 让它成为name为"admin"的路由的子路由
        hasNewRoutes = true;
      }
      // 递归遍历子菜单
      if (item.child && item.child.length > 0) {
        findAndAddRoutesByMenus(item.child);
      }
    });
  };

  findAndAddRoutesByMenus(menus);
  return hasNewRoutes;
}
