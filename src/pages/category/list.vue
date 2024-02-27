<script setup>
import { ref, reactive } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import GoodsDrawer from "./components/GoodsDrawer.vue";
import {
  getCategoryList,
  updateCategory,
  addCategory,
  updateCategoryStatus,
  deleteCategory,
} from "~/api/category.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";

// 列表展示、修改状态、删除列表项
const option = {
  getList: getCategoryList,
  getListSuccess: (res) => {
    tableList.value = res.map((o) => {
      o.goodsDrawerLoading = false;
      return o;
    });
  },
  updateStatus: updateCategoryStatus,
  delete: deleteCategory,
};
const { tableList, loading, getData, handleStatusChange, handleDelete } =
  useInitTable(option);

// 表单抽屉
const formOption = {
  // 注意要写成defaultForm，因为新增时传入resetForm的参数是option.defaultForm
  defaultForm: {
    name: "",
  },
  rules: {
    rule_id: [
      {
        required: true,
        message: "分类名不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  getData,
  update: updateCategory,
  add: addCategory,
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

// 点击"推荐商品"打开的表单抽屉
const goodsDrawerRef = ref(null);
const openGoodsDrawer = (data) => {
  goodsDrawerRef.value.open(data);
};
</script>

<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>
    <el-tree
      :data="tableList"
      :props="{ label: 'name', children: 'child' }"
      node-key="id"
      v-loading="loading"
    >
      <template #default="{ node, data }">
        <div class="w-full flex items-center text-[14px] pr-2">
          <span>{{ data.name }}</span>

          <div class="ml-auto items-center">
            <span @click.stop="">
              <el-button
                text
                type="primary"
                size="small"
                :loading="data.goodsDrawerLoading"
                @click.stop="openGoodsDrawer(data)"
                >推荐商品</el-button
              >
              <el-switch
                :modelValue="data.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange($event, data)"
              />
            </span>

            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleEdit(data)"
              >修改</el-button
            >

            <span @click.stop="">
              <el-popconfirm
                title="是否删除?"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm="handleDelete(data.id)"
              >
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </span>
          </div>
        </div>
      </template>
    </el-tree>

    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>

    <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
  </el-card>
</template>

<style>
.el-tree-node__content {
  padding: 20px 0;
}
</style>
