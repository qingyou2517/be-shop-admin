import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import nProgress from "nprogress";

export function toast(
  message,
  type = "success",
  dangerouslyUseHTMLString = true
) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 3000,
  });
}

export function showModal(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type,
  });
}

// 显示全屏loading
export function showFullLoading() {
  nProgress.start(); // 开启loading功能
}
// 关闭全屏loading
export function hideFullLoading() {
  nProgress.done(); // 开启loading功能
}

// 弹出输入框
export function showPrompt(title, value = "") {
  return ElMessageBox.prompt(title, "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
  });
}

// 将 query 对象转为 url
export function queryParams(query) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }
  let str = q.join("&"); // 如：limit=10&keyword=ceshi
  str = str ? "?" + str : "";
  return str; // 如：?limit=10&keyword=ceshi
}
