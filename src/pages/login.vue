<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { toast } from "~/composables/util";
import store from "~/store";
import { router } from "../router";

const form = reactive({
  username: "",
  password: "",
});
const rules = {
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur", // 触发校验的时机是：失去焦点时
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur", // 触发校验的时机是：失去焦点时
    },
  ],
};
const formRef = ref();
const loading = ref(false);
const onSubmit = () => {
  if (!formRef.value) return; // 若formRef为空，不必校验内容

  formRef.value.validate((vaild) => {
    if (!vaild) return false;
    loading.value = true;
    store
      .dispatch("userLogin", form)
      .then((res) => {
        toast("登录成功", "success");
        router.push("/");
      })
      .finally(() => {
        loading.value = false; // .finally与前面.then的状态无关
      });
  });
};

// 监听回车事件
const onEnter = (e) => {
  if (e.key === "Enter") onSubmit();
};
// 页面加载完毕，监听键盘事件
onMounted(() => {
  document.addEventListener("keyup", onEnter);
});
// 页面销毁之前，移除键盘事件监听
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onEnter);
});
</script>

<template>
  <el-row class="min-h-screen bg-indigo-500">
    <el-col :lg="16" :md="12" class="flex items-center justify-center flex-col">
      <div>
        <div class="font-bold text-4xl text-light-50 mb-4">欢迎光临</div>
        <div class="text-gray-200 text-sm">
          此站点是基于 Element-Plus 的后台管理系统演示地址，项目博客详见：<a
            href="https://www.yuque.com/qingyou-tkchw/zlbgxd/gmixpgw2xc1xwm17"
            target="_blank"
            class="text-light-50 font-bold"
            >语雀</a
          >
        </div>
      </div>
    </el-col>

    <el-col
      :lg="8"
      :md="12"
      class="bg-light-50 flex items-center justify-center flex-col"
    >
      <h2 class="font-bold text-3xl text-gray-800">欢迎回来</h2>
      <div
        class="flex items-center justify-center my-5 text-gray-300 space-x-2"
      >
        <span class="h-[1px] w-16 bg-gray-200"></span>
        <span>账号密码登录</span>
        <span class="h-[1px] w-16 bg-gray-200"></span>
      </div>
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon :prefix-icon="User"><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            show-password
            v-model="form.password"
            placeholder="请输入密码"
          >
            <template #prefix>
              <el-icon :prefix-icon="Lock"><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            round
            color="#626aef"
            class="w-[250px]"
            type="primary"
            @click="onSubmit"
            :loading="loading"
            >登 录</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped></style>
