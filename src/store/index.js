import { createStore } from "vuex";

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
});

export default store;
