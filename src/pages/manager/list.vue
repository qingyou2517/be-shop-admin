<script setup>
import { ref } from "vue";
import {
  getManagerList,
  updateManagerStatus,
  addManager,
  updateManager,
  deleteManager,
} from "~/api/manager";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import ListHeader from "~/components/ListHeader.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 所属角色，只在管理员模块使用，所以不抽离到公共模块
const rolesList = ref([]);

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项
const option = {
  searchForm: {
    keyword: "",
  },
  getList: getManagerList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = res.totalCount;
    rolesList.value = res.roles;
  },
  updateStatus: updateManagerStatus,
  delete: deleteManager,
};

const {
  tableList,
  loading,
  searchForm,
  resetSearchForm,
  currentPage,
  total,
  limit,
  getData,
  handleStatusChange,
  handleDelete,
} = useInitTable(option);

// 获取数据
getData();

// 新增、修改管理员
const formOption = {
  defaultForm: {
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  },
  rules: {
    username: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    password: [
      {
        required: true,
        message: "密码不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    role_id: [
      {
        required: true,
        message: "请选择所属角色",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  currentPage,
  getData,
  update: updateManager,
  add: addManager,
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
</script>

<template>
  <el-card shadow="never" class="border-0">
    <el-form
      :model="searchForm"
      label-width="80px"
      class="mb-3 flex items-center"
    >
      <el-form-item label="关键词" class="w-1/2">
        <el-input
          v-model="searchForm.keyword"
          placeholder="管理员昵称"
          clearable
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item class="ml-auto flex items-center">
        <el-button type="primary" size="small" @click="getData()"
          >搜索</el-button
        >
        <el-button size="small" @click="resetSearchForm">重置</el-button>
      </el-form-item>
    </el-form>

    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>

    <el-table :data="tableList" style="width: 100%" stripe v-loading="loading">
      <el-table-column label="管理员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="60" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属角色" align="center">
        <template #default="{ row }">
          <div>{{ row.role?.name || "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            :loading="row.switchLoading"
            :disabled="row.super === 1"
            @change="handleStatusChange($event, row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div v-if="scope.row.super === 1" class="text-sm text-gray-500">
            暂无操作
          </div>
          <div v-else>
            <el-button
              type="primary"
              text
              size="small"
              @click="handleEdit(scope.row)"
            >
              修改
            </el-button>
            <el-popconfirm
              title="是否删除该管理员?"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" text size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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

    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <ChooseImage v-model="form.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
  </el-card>
</template>

<style scoped></style>
