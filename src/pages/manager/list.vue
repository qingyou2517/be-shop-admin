<script setup>
import { ref, reactive } from "vue";
import {
  getManagerList,
  updateManagerStatus,
  addManager,
  updateManager,
  deleteManager,
} from "~/api/manager";
import { toast } from "~/composables/util.js";
import FormDrawer from "~/components/FormDrawer.vue";

const tableList = ref([]);
const loading = ref(false);
const rolesList = ref([]);

// 搜索
const searchForm = reactive({
  keyword: "",
});
const resetSearchForm = () => {
  searchForm.keyword = "";
  getData();
};

// 抽屉组件
const formDrawerRef = ref(null);
const drawerTitle = ref("");

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
    let { list, totalCount, roles } = await getManagerList(
      currentPage.value,
      searchForm
    );
    tableList.value = list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = totalCount;
    rolesList.value = roles;
  } finally {
    loading.value = false;
  }
}
getData();

// 修改管理员状态
const handleStatusChange = async (e, row) => {
  row.switchLoading = true;
  try {
    updateManagerStatus(row.id, e);
    toast("修改状态成功");
    row.status = e;
  } finally {
    row.switchLoading = false;
  }
};

// 表单数据
const updateId = ref(0);
const formRef = ref(null);
const form = reactive({
  username: "",
  password: "",
  role_id: null,
  status: 1,
  avatar: "",
});
const rules = {
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
};
// 表单提交
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    formDrawerRef.value.showLoading();
    try {
      if (updateId.value !== 0) {
        await updateManager(updateId.value, form);
        toast("修改成功");
        getData(currentPage.value);
      } else {
        await addManager(form);
        toast("新增成功");
        getData(1);
      }

      formDrawerRef.value.close();
    } finally {
      formDrawerRef.value.hideLoading();
    }
  });
};

// 新增管理员
const handleAdd = () => {
  if (formRef.value) formRef.value.clearValidate(); // 去除表单的校验报错信息
  form.username = "";
  form.password = "";
  form.avatar = "";
  form.role_id = null;
  form.status = 1;
  drawerTitle.value = "新增";
  formDrawerRef.value.open();
};

// 修改管理员信息
const handleEdit = (item) => {
  if (formRef.value) formRef.value.clearValidate(); // 去除表单的校验报错信息
  form.username = item.username;
  form.password = "";
  form.avatar = item.avatar;
  form.role_id = item.role_id;
  form.status = item.status;
  updateId.value = item.id;
  drawerTitle.value = "修改";
  formDrawerRef.value.open();
};

// 删除该管理员
const handleDelete = async (id) => {
  loading.value = true;
  try {
    await deleteManager(id);
    toast("删除成功");
    getData(currentPage.value);
  } finally {
    loading.value = false;
  }
};
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
          <el-input v-model="form.avatar"></el-input>
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
