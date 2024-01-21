<template>
  <el-tag
    v-for="tag in item.goodsSkusCardValue"
    :key="tag.id"
    class="mx-1"
    closable
    :disable-transitions="false"
    effect="plain"
    @close="handleClose(tag)"
  >
    {{ tag.text }}
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
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + 新增选项值
  </el-button>
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
  item,
} = initSkusCardItem(props.skusCardId);
</script>

<style scoped></style>
