<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});

const btnsArr = computed(() => {
  return props.layout.split(",");
});

defineEmits(["create", "refresh", "delete"]);
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button
        v-if="btnsArr.includes('create')"
        type="primary"
        size="small"
        @click="$emit('create')"
        >新增</el-button
      >
      <el-popconfirm
        v-if="btnsArr.includes('delete')"
        title="是否删除所选内容?"
        confirmButtonText="确认"
        cancelButtonText="取消"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button type="danger" size="small">批量删除</el-button>
        </template>
      </el-popconfirm>

      <slot></slot>
    </div>

    <el-tooltip
      v-if="btnsArr.includes('refresh')"
      class="box-item"
      effect="dark"
      content="刷新数据"
      placement="top"
    >
      <el-button text @click="$emit('refresh')">
        <el-icon :size="20"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<style scoped></style>
