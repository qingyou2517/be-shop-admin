<script setup>
import { ref } from "vue";
import {
  getUserList,
  updateUserStatus,
  addUser,
  updateUser,
  deleteUser,
} from "~/api/user";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "../../components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 所属会员等级
const levelList = ref([]);

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项
const option = {
  searchForm: {
    keyword: "",
    user_level_id: null,
  },
  getList: getUserList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = res.totalCount;
    levelList.value = res.user_level;
  },
  updateStatus: updateUserStatus,
  delete: deleteUser,
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

// 新增、修改管理员
const formOption = {
  defaultForm: {
    username: "",
    password: null,
    nickname: "",
    phone: "",
    email: "",
    avatar: "",
    user_level_id: null,
    status: 1,
  },
  rules: {
    username: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  currentPage,
  getData,
  update: updateUser,
  add: addUser,
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
    <!-- 搜索 -->
    <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <SearchItem label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="手机号/邮箱/会员昵称"
          clearable
          size="small"
        ></el-input>
      </SearchItem>

      <!-- 高级搜索：调用<Search>组件的具名插槽 -->
      <template #showAdvanced>
        <SearchItem label="会员等级">
          <el-select
            v-model="searchForm.user_level_id"
            value-key=""
            placeholder="请选择会员等级"
            size="small"
            clearable
          >
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </SearchItem>
      </template>
    </Search>

    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>

    <el-table :data="tableList" style="width: 100%" stripe v-loading="loading">
      <el-table-column label="会员">
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
      <el-table-column label="会员等级" width="200" align="center">
        <template #default="{ row }">
          {{ row.user_level?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登录注册" align="center">
        <template #default="{ row }">
          <p v-if="row.last_login_time">最后登录：{{ row.last_login_time }}</p>
          <p v-if="row.create_time">注册时间：{{ row.create_time }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
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

      <el-table-column label="操作" width="200" align="center">
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
              title="是否删除?"
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
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <ChooseImage v-model="form.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="form.user_level_id" placeholder="选择会员等级">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
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
