<template>
  <el-form-item label="规格选项">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="item in skus_card_list"
      :key="item.id"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            placeholder="规格名称"
            clearable
            style="width: 200px"
            v-model="item.text"
            @change="handleUpdateSkusCard(item)"
          >
            <template #append>
              <el-button
                type="primary"
                size="default"
                @click=""
                @mouseenter="tooltipVisible = true"
                @mouseleave="tooltipVisible = false"
              >
                <el-icon><More /></el-icon>
              </el-button>
            </template>
          </el-input>
          <el-button class="ml-auto" size="small" @click="">
            <el-icon><Top /></el-icon>
          </el-button>
          <el-button size="small" @click="">
            <el-icon><Bottom /></el-icon>
          </el-button>
          <el-popconfirm
            title="是否删除该规格选项?"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDeleteSkusCard(item)"
          >
            <template #reference>
              <el-button size="small">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <!-- card body -->
      <SkusCardItem :skusCardId="item.id"></SkusCardItem>
    </el-card>
    <el-button
      type="success"
      size="small"
      :loading="btnLoading"
      @click="handleAddSkusCard"
      >添加规格选项</el-button
    >
  </el-form-item>
</template>

<script setup>
import { ref, reactive } from "vue";
import SkusCardItem from "./SkusCardItem.vue";
import {
  skus_card_list,
  btnLoading,
  addSkusCard,
  updateSkusCard,
  deleteSkusCard,
} from "~/composables/useSkus.js";

const tooltipVisible = ref(false);

// 添加规格选项
const handleAddSkusCard = () => {
  addSkusCard();
};

// 修改规格选项
const handleUpdateSkusCard = (item) => {
  updateSkusCard(item);
};

// 删除规格选项
const handleDeleteSkusCard = (item) => {
  deleteSkusCard(item);
};
</script>

<style scoped>
:deep(.el-card__header) {
  @apply !p-2 bg-gray-50;
}
</style>
