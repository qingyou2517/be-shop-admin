import { ElNotification } from "element-plus";

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
