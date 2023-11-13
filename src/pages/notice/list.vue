<script setup>
import { ref, reactive } from "vue";
import {
  getNoticeList,
  addNotice,
  updateNotice,
  deleteNotice,
} from "~/api/notice.js";
import { toast } from "~/composables/util";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 组件特有的 get 方法，但 get 成功采用默认的数据操作
const option = {
  getList: getNoticeList,
  delete: deleteNotice,
};

const { tableList, loading, currentPage, total, limit, getData } =
  useInitTable(option);

// 获取数据
getData();

// 新增、修改公告
const formOption = {
  defaultForm: {
    title: "",
    content: "",
  },
  rules: {
    title: [
      {
        required: true,
        message: "公告标题不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    content: [
      {
        required: true,
        message: "公告内容不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  currentPage,
  getData,
  update: updateNotice,
  add: addNotice,
};

const {
  formDrawerRef,
  drawerTitle,
  handleStatusChange,
  formRef,
  form,
  rules,
  handleSubmit,
  handleAdd,
  handleEdit,
} = useInitForm(formOption);

// 表单数据
const updateId = ref(0);

// 删除公告
const handleDelete = async (id) => {
  loading.value = true;
  try {
    await deleteNotice(id);
    toast("删除成功");
    getData(currentPage.value);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>

    <el-table :data="tableList" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="title" label="公告标题" class="truncate" />
      <el-table-column prop="create_time" label="发布时间" width="250" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            text
            size="small"
            @click="handleEdit(scope.row)"
          >
            修改
          </el-button>
          <el-popconfirm
            title="是否删除该公告?"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDelete(scope.row.id)"
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
        <el-form-item label="公告标题:" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="公告内容:" prop="content">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<style scoped></style>
