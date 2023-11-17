<script setup>
import { ref } from "vue";
import {
  getGoodsList,
  updateGoodsStatus,
  addGood,
  updateGood,
  deleteGoods,
} from "~/api/goods";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import ListHeader from "~/components/ListHeader.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 所属角色，只在管理员模块使用，所以不抽离到公共模块
const rolesList = ref([]);

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项、批量删除
const option = {
  searchForm: {
    title: "",
    category_id: null,
  },
  getList: getGoodsList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = res.totalCount;
    rolesList.value = res.roles;
  },
  updateStatus: updateGoodsStatus,
  delete: deleteGoods,
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
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete,
  hasSelect,
} = useInitTable(option);

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
  update: updateGood,
  add: addGood,
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

    <ListHeader
      layout="create,delete,refresh"
      @create="handleAdd"
      @refresh="getData"
      @delete="handleMultiDelete"
      :hasSelect="hasSelect"
    ></ListHeader>

    <el-table
      ref="multipleTableRef"
      :data="tableList"
      style="width: 100%"
      stripe
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.cover"
              fit="cover"
              class="w-[50px] h-[50px]"
            ></el-image>
            <div class="ml-3">
              <h6>{{ row.title }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="实际销量" prop="sale_count" align="center" />
      <el-table-column label="商品状态" prop="status">
        <template #default="{ row }">
          <el-tag class="ml-2" type="success" v-if="row.status === 1"
            >上架</el-tag
          >
          <el-tag class="ml-2" type="danger" v-else>仓库</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="120">
        <template #default="{ row }">
          <div class="flex flex-col items-center justify-center">
            <el-button type="success" size="small" plain>审核通过</el-button>
            <el-button type="danger" size="small" plain class="mt-2"
              >审核拒绝</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总库存" prop="stock" align="center" />
      <el-table-column label="操作" align="center" width="500">
        <template #default="scope">
          <div>
            <el-button
              type="primary"
              text
              size="small"
              @click="handleEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button type="primary" text size="small" @click="">
              商品规格
            </el-button>
            <el-button type="primary" text size="small" @click="">
              设置轮播图
            </el-button>
            <el-button type="primary" text size="small" @click="">
              商品详情
            </el-button>
            <el-popconfirm
              title="是否删除该商品?"
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

<style scoped>
:deep(.el-table__row .el-button + .el-button) {
  @apply ml-0;
}
</style>
