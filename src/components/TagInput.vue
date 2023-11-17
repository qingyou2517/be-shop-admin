<script setup>
import { ref, nextTick } from "vue";

// v-model
const props = defineProps({
  modelValue: {
    type: String,
  },
});
const emit = defineEmits(["update:modelValue"]);

const inputValue = ref("");
const dynamicTags = ref(props.modelValue ? props.modelValue.split(",") : []);
const inputVisible = ref(false);
const InputRef = ref(null);

// 删除 tag
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  let str = dynamicTags.value.length === 0 ? "" : dynamicTags.value.join(",");
  emit("update:modelValue", str);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

// 新增 tag
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    emit("update:modelValue", dynamicTags.value.join(","));
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>

<template>
  <div class="flex items-center flex-wrap">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      class="m-1"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="m-1 w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag m-1"
      size="small"
      @click="showInput"
    >
      + 添加值
    </el-button>
  </div>
</template>

<style scoped></style>
