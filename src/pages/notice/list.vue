<script setup>
import { ref, reactive } from "vue";
import { getNoticeList } from "~/api/notice.js";

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

// 新增公告
const handleAdd = () => {};

// 编辑公告
const handleEdit = () => {};

// 删除公告
const handleDelete = (id) => {};
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
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" text size="small" @click="handleEdit">
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
  </el-card>
</template>

<style scoped></style>
