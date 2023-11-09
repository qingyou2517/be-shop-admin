<script setup>
import { ref, reactive } from "vue";
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

// 打开抽屉组件：调用ImageAside.vue暴露的方法
const imageAsideRef = ref(null);
const openAdd = () => {
  imageAsideRef.value.handleCreate();
};

// 通过list.vue中转，实现左侧类名列表组件、右侧图片列表组件的通信
const imageMainRef = ref(null);
function handleChangeAside(image_class_id) {
  imageMainRef.value.loadData(image_class_id);
}
</script>

<template>
  <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="border-bottom flex items-center">
      <el-button
        type="primary"
        size="small"
        class="text-light-50"
        @click="openAdd"
        >新增图片分类</el-button
      >
      <el-button text size="small" class="bg-yellow-400 text-light-100"
        >上传图片</el-button
      >
    </el-header>
    <el-container>
      <ImageAside ref="imageAsideRef" @change="handleChangeAside" />
      <ImageMain ref="imageMainRef" />
    </el-container>
  </el-container>
</template>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #eee;
}
.border-right {
  border-right: 1px solid #eee;
}
</style>
