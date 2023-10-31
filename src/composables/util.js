import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import nProgress from "nprogress";

export function toast(
  message,
  type = "success",
  dangerouslyUseHTMLString = false
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
