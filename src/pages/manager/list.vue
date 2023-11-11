<script setup>
import { ref, reactive } from "vue";
import { getManagerList } from "~/api/manager";

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
    let { list, totalCount } = await getManagerList(currentPage.value, {
      limit: 10,
      keyword: "",
    });
    tableList.value = list;
    total.value = totalCount;
  } finally {
    loading.value = false;
  }
}
getData();

// 修改管理员信息
const handleEdit = () => {};

// 删除该管理员
const handleDelete = () => {};
</script>

<template>
  <el-card shadow="never" class="border-0">
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
      <el-table-column label="所属管理员" align="center">
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
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
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
            title="是否删除该管理员?"
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
  </el-card>
</template>

<style scoped></style>
