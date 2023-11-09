<script setup>
import { ref, reactive } from "vue";

defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["edit", "delete"]);
</script>

<template>
  <div
    class="flex items-center p-3 text-sm text-gray-600 cursor-pointer hover:bg-blue-50"
    :class="{ active: active }"
  >
    <span class="truncate">
      <slot></slot>
    </span>
    <el-button
      text
      type="primary"
      size="small"
      class="ml-auto px-1"
      @click="$emit('edit')"
    >
      <el-icon><Edit /></el-icon>
    </el-button>
    <el-popconfirm
      title="是否删除该相册?"
      confirmButtonText="确认"
      cancelButtonText="取消"
      @confirm="$emit('delete')"
    >
      <template #reference>
        <el-button text type="primary" size="small" class="px-1">
          <el-icon><Close /></el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<style scoped>
.active {
  @apply bg-blue-50;
}
</style>
