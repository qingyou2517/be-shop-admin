<script setup>
import { ref, reactive } from "vue";

const showDrawer = ref(false);
const loading = ref(false);

// 提交按钮的loading与否
const showLoading = () => (loading.value = true);
const hideLoading = () => (loading.value = false);

// 打开抽屉
const open = () => (showDrawer.value = true);
// 关闭抽屉
const close = () => (showDrawer.value = false);
// 向父组件暴露以下方法：使用defineExpose，因为<script setup>的组件默认是关闭的，父组件无法通过ref引用拿到子组件在setup中声明的数据
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});

defineProps({
  title: {
    type: String,
  },
  size: {
    type: String,
    default: "45%",
  },
  // 是否在关闭抽屉后销毁所有子元素
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "提交",
  },
});

const emit = defineEmits(["submit"]);
const onsubmit = () => emit("submit");
</script>

<template>
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :size="size"
    :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose"
  >
    <div class="w-full h-full flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <slot></slot>
      </div>
      <div class="h-[50px] mt-auto flex items-center">
        <el-button type="primary" @click="onsubmit" :loading="loading">{{
          confirmText
        }}</el-button>
        <el-button type="default" @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped></style>
