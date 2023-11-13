<script setup>
import { ref, defineEmits } from "vue";
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";

const dialogVisible = ref(false);

// 打开对话框，选择图片
const open = () => {
  dialogVisible.value = true;
};
// 关闭对话框
const close = () => {
  dialogVisible.value = false;
};

// 新增图片分类 => 打开抽屉组件：调用ImageAside.vue暴露的方法
const imageAsideRef = ref(null);
const openAdd = () => {
  imageAsideRef.value.handleCreate();
};

// 通过list.vue中转，实现左侧类名列表组件、右侧图片列表组件的通信
const imageMainRef = ref(null);
function handleChangeAside(image_class_id) {
  imageMainRef.value.loadData(image_class_id);
}

// 上传图片 => 打开抽屉组件：调用ImageMain.vue暴露的方法
const openUpload = () => {
  imageMainRef.value.openUploadFile();
};

// 修改 v-model 绑定的数据
defineProps({
  modelValue: [String, Array],
});
const emit = defineEmits(["update:modelValue"]);

// 记录所选图片的url
let urls = [];
const handleChooseImage = (image) => {
  urls = image.map((item) => item.url);
};

// 选好了图片
const submitImage = () => {
  emit("update:modelValue", urls[0]);
  close();
};
</script>

<template>
  <div v-if="modelValue">
    <el-image
      :src="modelValue"
      fit="cover"
      class="w-25 h-25 rounded border mr-2"
    />
  </div>

  <div
    class="w-25 h-25 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-100"
    @click="open"
  >
    <el-icon :size="25"><Plus /></el-icon>
  </div>

  <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
    <el-container class="bg-white rounded h-[70vh]">
      <el-header class="border-bottom flex items-center">
        <el-button
          type="primary"
          size="small"
          class="text-light-50"
          @click="openAdd"
          >新增图片分类</el-button
        >
        <el-button
          type="warning"
          size="small"
          class="bg-yellow-400 text-light-100"
          @click="openUpload"
          >上传图片</el-button
        >
      </el-header>
      <el-container>
        <ImageAside ref="imageAsideRef" @change="handleChangeAside" />
        <ImageMain
          ref="imageMainRef"
          :showChoose="true"
          @choose="handleChooseImage"
        />
      </el-container>
    </el-container>

    <template #footer>
      <span>
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="submitImage">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
