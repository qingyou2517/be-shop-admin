<template>
  <div v-loading="loading">
    <el-tag
      v-for="tag in item.goodsSkusCardValue"
      :key="tag.id"
      class="mx-1"
      closable
      :disable-transitions="false"
      effect="plain"
      @close="handleClose(tag)"
    >
      <el-input
        class="w-20 ml-[-10px]"
        v-model="tag.text"
        placeholder="选项值"
        size="small"
        @change="handleChange($event, tag)"
      ></el-input>
    </el-tag>

    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag ml-1"
      size="small"
      @click="showInput"
    >
      + 新增选项值
    </el-button>
  </div>
</template>

<script setup>
import { initSkusCardItem } from "~/composables/useSkus.js";

const props = defineProps({
  skusCardId: {
    type: [Number, String],
  },
});
const {
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
  loading,
  item,
  handleChange,
} = initSkusCardItem(props.skusCardId);
</script>

<style scoped></style>
