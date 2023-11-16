<script setup>
import { ref, reactive } from "vue";

// 拿到 element-plus 的 icon 列表
import * as iconsList from "@element-plus/icons-vue";

// icon 图标
const iconsNameList = ref(Object.keys(iconsList));

// v-model
defineProps({
  modelValue: String,
});

// 选择图标
const emit = defineEmits(["update:modelValue"]);
const handleChangeIcon = (iconName) => {
  emit("update:modelValue", iconName);
};
</script>

<template>
  <div>
    <el-select
      :modelValue="modelValue"
      placeholder="请选择图标"
      @change="handleChangeIcon"
      filterable
    >
      <el-option
        v-for="name in iconsNameList"
        :key="name"
        :label="name"
        :value="name"
      >
        <div class="flex items-center justify-between">
          <el-icon>
            <component :is="name"></component>
          </el-icon>
          <span class="text-gray-500">{{ name }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<style scoped></style>
