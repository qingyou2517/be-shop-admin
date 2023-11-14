<script setup>
import { ref, reactive } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import { getRulesList } from "~/api/rule.js";
import { useInitTable } from "~/composables/useCommon.js";

// 树形列表
const defaultExpandedKeys = ref([]); // 默认展开的节点，由 node-key 组成的一维数组

const option = {
  getList: getRulesList,
  getListSuccess: (res) => {
    tableList.value = res.list;
    defaultExpandedKeys.value = res.list.map((item) => item.id);
  },
};
const { tableList, loading, getData } = useInitTable(option);

// 新增上级菜单
function handleAdd() {}
</script>

<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>
    <el-tree
      :data="tableList"
      :props="{ label: 'name', children: 'child' }"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      v-loading="loading"
    >
      <template #default="{ node, data }">
        <div class="w-full flex items-center text-[14px] pr-2">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{
            data.menu ? "菜单" : "权限"
          }}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>

          <div class="ml-auto items-center">
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
            />
            <el-button text type="primary" size="small">修改</el-button>
            <el-button text type="primary" size="small">增加</el-button>
            <el-button text type="primary" size="small">删除</el-button>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>
</template>

<style>
.el-tree-node__content {
  padding: 20px 0;
}
</style>
