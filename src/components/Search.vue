<template>
  <el-form label-width="80px" class="mb-3">
    <el-row :gutter="20">
      <!-- 默认插槽：对应通用搜索 -->
      <slot></slot>

      <!-- 具名插槽：对应高级搜索 -->
      <template v-if="showAdvancedSearch">
        <slot name="showAdvanced"></slot>
      </template>

      <!-- 按钮 -->
      <el-col :span="8" :offset="showAdvancedSearch ? 0 : 8">
        <div class="flex items-center justify-end">
          <el-button type="primary" size="small" @click="$emit('search')"
            >搜索</el-button
          >
          <el-button size="small" @click="$emit('reset')">重置</el-button>
          <el-button
            type="primary"
            text
            @click="showAdvancedSearch = !showAdvancedSearch"
            v-if="hasAdvancedSearch"
            >{{ showAdvancedSearch ? "收起" : "展开" }}
            <el-icon>
              <ArrowUp v-if="showAdvancedSearch" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from "vue";

defineProps({
  model: Object,
});
defineEmits(["search", "reset"]);

// 是否展示高级搜索
const showAdvancedSearch = ref(false);

// 通过插槽判断组件是否含有高级搜索部分
const slots = useSlots(); // 获取插槽信息
const hasAdvancedSearch = ref(!!slots.showAdvanced); // 双感叹号强制转boolean类型
</script>

<style scoped></style>
