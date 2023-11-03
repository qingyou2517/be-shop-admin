import { ref, reactive } from "vue";
import store from "~/store";
import { router } from "~/router";
import { updatePassword } from "~/api/manager";
import { toast, showModal } from "~/composables/util";

export function useRePassword() {
  const formDrawerRef = ref(null);
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });
  const rules = {
    oldpassword: [
      {
        required: true,
        message: "旧密码不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    password: [
      {
        required: true,
        message: "新密码不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    repassword: [
      {
        required: true,
        message: "确认密码不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  };
  const formRef = ref();
  const openRePasswordDrawer = () => formDrawerRef.value.open();
  const onSubmit = () => {
    if (!formRef.value) return; // 若formRef为空，不必校验内容
    formRef.value.validate((vaild) => {
      if (!vaild) return false;
      formDrawerRef.value.showLoading();

      updatePassword(form)
        .then((res) => {
          toast("已修改密码，请重新登录", "success");
          store.dispatch("userLogout");
          router.push("/login");
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };
  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    openRePasswordDrawer,
    onSubmit,
  };
}

export function useLogout() {
  const onLogout = () => {
    showModal("是否退出登录?", "warning")
      .then((res) => {
        store.dispatch("userLogout").then((res) => {
          toast("已退出登录", "success");
          router.push("/login");
        });
      })
      .catch((err) => {});
  };

  return {
    onLogout,
  };
}
