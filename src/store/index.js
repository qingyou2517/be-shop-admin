import { createStore } from "vuex";
import { login, getInfo, logout } from "../api/manager";
import { setToken, removeToken } from "~/composables/auth";

const store = createStore({
  state() {
    return {
      user: {}, // 用户信息
      asideWidth: "250px", // 默认展开侧边栏，宽度为250px
      menus: [],
      ruleNames: [],
    };
  },
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    // 展开/收起侧边栏
    SET_ASIDE_WIDTH(state) {
      state.asideWidth = state.asideWidth === "250px" ? "64px" : "250px";
    },
    // 设置menus菜单
    SET_MENUS(state, menus) {
      state.menus = menus;
    },
    // 设置用户权限
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
  },
  actions: {
    // 登录
    userLogin({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login(username, password)
          .then((res) => {
            // token 存入 cookie（前端发送的请求要携带token，token从cookie取）
            setToken("admin-token", res.token);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },

    // 获取当前用户信息应该是异步的，所以返回promise，让外界异步调用
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // new Promise内的执行器函数是同步的
        getInfo()
          .then((res) => {
            commit("SET_USERINFO", res); // 异步提交mutations
            commit("SET_MENUS", res.menus);
            commit("SET_RULENAMES", res.ruleNames);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },

    // 退出登录
    userLogout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            removeToken();
            commit("SET_USERINFO", {});
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
  },
});

export default store;
