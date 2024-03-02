<script setup>
import { ref, defineEmits } from "vue";
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";
import { toast } from "../composables/util";

const dialogVisible = ref(false);

// 打开对话框，选择图片
let callbackFunction = null;
const open = (callback = null) => {
  callbackFunction = callback;
  dialogVisible.value = true;
};
// 关闭对话框
const close = () => {
  dialogVisible.value = false;
};

defineExpose({
  open,
});

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
const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1,
  },
  // 是否显示按钮、是否回显图片：如Editor.vue点击选择图片时，不需要在富文本编辑器内显示添加按钮，而且自己有回显图片的手段
  preview: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

// 记录所选图片的url
let urls = [];
const handleChooseImage = (image) => {
  urls = image.map((item) => item.url);
};

// 选好了图片
const submitImage = () => {
  let urlArr = [];
  // 只展示单张图片
  if (props.limit === 1) {
    urlArr = urls[0];
  } else {
    // modelValue为打开即展示的url数组，urls为新选图片组成的url数组
    // 多张图片且需要回显到ChooseImage内：如轮播图
    if (props.preview) {
      urlArr = [...props.modelValue, ...urls];
      if (urlArr.length > props.limit) {
        const rear = props.limit - props.modelValue.length;
        return toast(`总共限定${props.limit}张，最多还能选择${rear}张`);
      }
    } else {
      // 多张图片但是不需要回显到ChooseImage内：如富文本编辑器，搜集url回显到编辑器内
      urlArr = urls;
      if (urlArr.length > props.limit) {
        return toast(`最多还能选择${props.limit}张`);
      }
    }
  }

  if (urlArr && props.preview) {
    emit("update:modelValue", urlArr);
  }

  if (!props.preview && typeof callbackFunction === "function") {
    callbackFunction(urlArr);
  }
  close();
};

// 删除轮播图的某张图片
const removeImage = (index) => {
  if (Array.isArray(props.modelValue)) {
    props.modelValue.splice(index, 1);
    emit("update:modelValue", props.modelValue);
  }
};
</script>

<template>
  <!-- 展示图片 -->
  <div v-if="modelValue && preview">
    <!-- 只需展示单张图 -->
    <el-image
      :src="modelValue"
      fit="cover"
      class="w-25 h-25 rounded border mr-2"
      v-if="typeof modelValue === 'string'"
    />
    <!-- 需要展示轮播图 -->
    <div class="flex items-center justify-center" v-else>
      <div
        class="relative mx-1 my-2 w-25 h-25"
        v-for="(url, index) in modelValue"
        :key="index"
      >
        <el-icon
          class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded-full"
          style="z-index: 10"
          @click="removeImage(index)"
        >
          <CircleClose></CircleClose
        ></el-icon>
        <el-image
          :src="url"
          fit="cover"
          class="w-25 h-25 rounded border mr-2"
        />
      </div>
    </div>
  </div>

  <!-- 选择上传图片：按钮 -->
  <div
    class="w-25 h-25 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-100"
    @click="open"
    v-if="preview"
  >
    <el-icon :size="25"><Plus /></el-icon>
  </div>
  <!-- 选择上传图片：对话框 -->
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
          :limit="limit"
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
