import { createStore } from "vuex";
import { login, getInfo, logout } from "../api/manager";
import { setToken, removeToken } from "~/composables/auth";

const store = createStore({
  state() {
    return {
      user: {}, // 用户信息
    };
  },
  mutations: {
    SET_USERINFO(state, user) {
      // 记录用户信息
      state.user = user;
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
