<script setup>
import {
  getSkusList,
  addSku,
  updateSku,
  updateSkuStatus,
  deleteSkus,
} from "~/api/sku.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import TagInput from "~/components/TagInput.vue";
import { toast } from "~/composables/util.js";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 列表展示、修改状态、删除列表项
const option = {
  getList: getSkusList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = res.totalCount;
  },
  updateStatus: updateSkuStatus,
  delete: deleteSkus,
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
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete,
  hasSelect,
} = useInitTable(option);

// 新增、修改
const formOption = {
  defaultForm: {
    name: "",
    default: "",
    order: 50,
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: "规格名称不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    default: [
      {
        required: true,
        message: "规格值不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  currentPage,
  getData,
  update: updateSku,
  add: addSku,
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
    <ListHeader
      @create="handleAdd"
      @refresh="getData"
      @delete="handleMultiDelete"
      layout="create,delete,refresh"
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
      <el-table-column prop="name" label="规格名称" class="truncate" />
      <el-table-column
        prop="default"
        label="规格值"
        width="250"
        class="truncate"
      />
      <el-table-column prop="order" label="排序" />
      <el-table-column label="状态" width="100">
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
    <FormDrawer
      destroyOnClose
      ref="formDrawerRef"
      :title="drawerTitle"
      @submit="handleSubmit"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" :min="0" :max="2000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="form.default"></TagInput>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<style scoped></style>
