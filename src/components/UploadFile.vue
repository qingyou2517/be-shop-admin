<script setup>
import { ref, reactive } from "vue";
import { uploadImageAction } from "~/api/image.js";
import { getToken } from "~/composables/auth.js";
import { toast } from "~/composables/util.js";
const token = getToken();

defineProps({
  data: {
    type: Object,
    // default: {
    //   image_class_id: 0,
    // },
  },
});

const emit = defineEmits(["success"]);
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  emit("success", { response, uploadFile, uploadFiles });
};
const uploadError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || "上传失败";
  toast(msg, "error");
};
</script>

<template>
  <el-upload
    drag
    :action="uploadImageAction"
    multiple
    :headers="{ token }"
    name="img"
    list-type="picture"
    :data="data"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">把文件拖入这里，或者 <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">jpg/png 文件大小尽量不超过 500kb</div>
    </template>
  </el-upload>
</template>

<style scoped></style>
