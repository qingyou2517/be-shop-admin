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

const tableList = ref([]);
const loading = ref(false);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

// 获取数据
async function getData(p = null) {
  // 假如切换分页，getData 会拿到 current-change 事件传递过来的页码(即 p )
  if (typeof p === "number") {
    currentPage.value = p;
  }

  loading.value = true;
  try {
    let { list, totalCount } = await getNoticeList(currentPage.value);
    tableList.value = list;
    total.value = totalCount;
  } finally {
    loading.value = false;
  }
}
getData();

// 抽屉组件的数据
const drawerTitle = ref("");
const formDrawerRef = ref(null);

// 表单数据
const updateId = ref(0);
const formRef = ref(null);
const form = reactive({
  title: "",
  content: "",
});
const rules = {
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
};

// 表单校验
function handleSubmit() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    formDrawerRef.value.showLoading();
    try {
      if (updateId.value !== 0) {
        await updateNotice(updateId.value, form);
        toast("修改成功");
        getData(currentPage.value);
      } else {
        await addNotice(form);
        toast("新增成功");
        getData(1);
      }

      formDrawerRef.value.close();
    } finally {
      formDrawerRef.value.hideLoading();
    }
  });
}

// 新增公告
const handleAdd = () => {
  if (formRef.value) formRef.value.clearValidate(); // 去除表单的校验报错信息
  form.title = "";
  form.content = "";
  drawerTitle.value = "新增";
  formDrawerRef.value.open();
};

// 编辑公告
const handleEdit = (item) => {
  if (formRef.value) formRef.value.clearValidate(); // 去除表单的校验报错信息
  form.title = item.title;
  form.content = item.content;
  updateId.value = item.id;
  drawerTitle.value = "修改";
  formDrawerRef.value.open();
};

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
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="刷新数据"
        placement="top"
      >
        <el-button text @click="getData">
          <el-icon :size="20"><Refresh /> </el-icon>
        </el-button>
      </el-tooltip>
    </div>

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
