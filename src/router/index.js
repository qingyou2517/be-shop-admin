import { createRouter, createWebHashHistory } from "vue-router";

import Admin from "../layouts/admin.vue";
import Index from "~/pages/index.vue";
import NotFound from "~/pages/404.vue";
import Login from "~/pages/login.vue";
import GoodList from "~/pages/goods/list.vue";
import CategoryList from "~/pages/category/list.vue";
import UserList from "~/pages/user/list.vue";
import OrderList from "~/pages/order/list.vue";
import CommentList from "~/pages/comment/list.vue";
import ImageList from "~/pages/image/list.vue";
import NoticeList from "~/pages/notice/list.vue";
import SettingBase from "~/pages/setting/base.vue";
import CouponList from "~/pages/coupon/list.vue";
import ManagerList from "~/pages/manager/list.vue";
import AccessList from "~/pages/access/list.vue";
import RolesList from "~/pages/role/list.vue";
import SkusList from "~/pages/skus/list.vue";

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
    path: "/skus/list",
    name: "/skus/list",
    component: SkusList,
    meta: {
      title: "通用规格管理",
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
  {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
      title: "用户管理",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    meta: {
      title: "订单管理",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    meta: {
      title: "评论管理",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    meta: {
      title: "管理员管理",
    },
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: AccessList,
    meta: {
      title: "权限管理",
    },
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: RolesList,
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    meta: {
      title: "图库管理",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    meta: {
      title: "公告管理",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: SettingBase,
    meta: {
      title: "基础设置",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    meta: {
      title: "优惠券管理",
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
