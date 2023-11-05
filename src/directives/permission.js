import store from "~/store";

function hasPermission(value) {
  // v-permission 值为数组
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，如 v-permission="['getStatistics3,GET']"`);
  }
  // 判断 ruleNames 字段里是否包含 v-permission 指定的权限
  let index = value.findIndex((v) => store.state.ruleNames.includes(v));
  return index < 0 ? false : true;
}

export default {
  install(app) {
    // 自定义 v-permission 指令，记录操作权限
    app.directive("permission", {
      mounted(el, binding) {
        // 若权限不符
        if (el && !hasPermission(binding.value)) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      },
    });
  },
};
