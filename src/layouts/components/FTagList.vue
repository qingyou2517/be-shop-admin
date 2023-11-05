<script setup>
import { useTabList } from "~/composables/useTabList";

const { activeTab, tabList, changeTab, removeTab, handleClose } = useTabList();
</script>

<template>
  <div
    :style="{ left: $store.state.asideWidth }"
    class="fixed top-16 right-0 h-11 bg-gray-100 px-2 flex items-center z-1000"
  >
    <el-tabs
      v-model="activeTab"
      type="card"
      style="min-width: 100px"
      @tab-remove="removeTab"
      @tab-change="changeTab"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/'"
      >
      </el-tab-pane>
    </el-tabs>

    <span
      class="bg-white h-8 px-2 rounded ml-auto flex items-center justify-center"
    >
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="closeAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>

  <!-- 占位 -->
  <div class="h-11"></div>
</template>

<style scoped>
/* 取消下边距、底部边框，并设置内部tags垂直居中 */
:deep(.el-tabs__header) {
  @apply flex items-center;
  margin-bottom: 0;
  border: 0;
}
/* 取消外边框 */
:deep(.el-tabs__nav) {
  border: 0 !important;
}
/* 取消左侧边框 */
:deep(.el-tabs__item) {
  border-left: 0 !important;
  /* line-height: 32px; */
  @apply bg-white mx-1 h-8;
}
/* 滚动按钮居中 */
:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  line-height: 32px;
  height: 32px;
}
/* 滚动到末尾时，禁止点击右侧滚动按钮 */
:deep(.is-disabled) {
  cursor: not-allowed;
  @apply text-gray-300;
}
</style>
