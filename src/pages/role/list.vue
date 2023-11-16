<script setup>
import { ref, computed } from "vue";
import {
  getRolesList,
  addRole,
  updateRole,
  updateRoleStatus,
  deleteRole,
} from "~/api/role.js";
import { getRulesList } from "~/api/rule.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 列表展示、修改状态、删除列表项
const option = {
  getList: getRolesList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = res.totalCount;
  },
  updateStatus: updateRoleStatus,
  delete: deleteRole,
};

const {
  tableList,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleStatusChange,
  handleDelete,
} = useInitTable(option);

// 新增、修改
const formOption = {
  defaultForm: {
    name: "",
    desc: "",
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: "角色名称不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  currentPage,
  getData,
  update: updateRole,
  add: addRole,
};

const {
  formDrawerRef,
  drawerTitle,
  formRef,
  form,
  rules,
  handleSubmit,
  handleAdd,
  handleEdit,
} = useInitForm(formOption);

// 配置权限：抽屉组件
const setRuleFormDrawerRef = ref(null);

// 抽屉组件内的虚拟化树形可选列表
const defaultExpandedKeys = ref([]); // 默认展开的节点，由 node-key 组成的一维数组
const rulesList = ref([]); // 虚拟树的节点列表数据
const treeHeight = ref(1); // 虚拟树的高度
const elTreeRef = ref(null); // 虚拟树

// 当前用户拥有的权限id
const ruleIds = ref([]);

// 打开抽屉组件
const openSetRuleDrawer = async (row) => {
  treeHeight.value = window.innerHeight - 170;
  try {
    let res = await getRulesList();
    rulesList.value = res.list;
    console.log(res);
    defaultExpandedKeys.value = res.list.map((item) => item.id); // 设置默认展开的节点

    setRuleFormDrawerRef.value.open();
    // console.log(row);
    // 当前角色所拥有的权限
    ruleIds.value = row.rules.map((item) => item.id);

    // 设置虚拟树的默认勾选节点
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value); // 注意要在打开抽屉之后调用，注意要异步
    }, 100);
  } catch (err) {
    console.log("渲染菜单及权限失败: ", err);
  }
};

// 提交
const handleSetRulesSubmit = () => {};
</script>

<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>

    <el-table :data="tableList" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="name" label="角色名称" class="truncate" />
      <el-table-column
        prop="desc"
        label="角色描述"
        width="250"
        class="truncate"
      />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            :loading="row.switchLoading"
            @change="handleStatusChange($event, row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template #default="{ row }">
          <el-button
            type="primary"
            text
            size="small"
            @click="openSetRuleDrawer(row)"
          >
            配置权限
          </el-button>
          <el-button type="primary" text size="small" @click="handleEdit(row)">
            修改
          </el-button>
          <el-popconfirm
            title="是否删除该角色?"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button type="primary" text size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-center items-center mt-5 h-[50px]">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>

    <!-- 页面保持一个根节点，防止切换页面时 vue transition 失效 -->
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!-- 配置权限的弹窗：树形多选框 -->
    <FormDrawer
      ref="setRuleFormDrawerRef"
      title="权限配置"
      @submit="handleSetRulesSubmit"
    >
      <el-tree-v2
        ref="elTreeRef"
        :data="rulesList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :height="treeHeight"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag size="small" :type="data.menu ? '' : 'info'">{{
              data.menu ? "菜单" : "权限"
            }}</el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </el-card>
</template>

<style scoped></style>
