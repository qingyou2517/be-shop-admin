<script setup>
import { ref } from "vue";
import {
  getCouponList,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "~/api/coupon.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 优惠券的状态
const formStatus = (row) => {
  let statusText = "领取中";
  // 转换成时间戳，方便比较
  const start_time = new Date(row.start_time).getTime();
  const now = new Date().getTime();
  const end_time = new Date(row.end_time).getTime();
  if (start_time > now) statusText = "未开始";
  else if (end_time < now) statusText = "已结束";
  else if (row.status === 0) statusText = "已失效";
  return statusText;
};

// 动态class
const getClass = (row) => {
  return {
    notStart: row.statusText === "未开始",
    active: row.statusText === "领取中",
    inactive: row.statusText !== "未开始" && row.statusText !== "领取中",
  };
};

// get数据、删除操作
const option = {
  getList: getCouponList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.statusText = formStatus(item); // 添加statusText字段，即优惠券状态
      return item;
    });
    total.value = res.totalCount;
  },
  delete: deleteCoupon,
};

const { tableList, loading, currentPage, total, limit, getData, handleDelete } =
  useInitTable(option);

// 新增、修改公告
const formOption = {
  defaultForm: {
    name: "",
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: 0,
    end_time: 0,
    order: 50,
  },
  rules: {
    name: [
      {
        required: true,
        message: "优惠券名称不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    type: [
      {
        required: true,
        message: "类型不能为空",
        trigger: "blur",
      },
    ],
    value: [
      {
        required: true,
        message: "面值不能为空",
        trigger: "blur",
      },
    ],
    total: [
      {
        required: true,
        message: "发行量不能为空",
        trigger: "blur",
      },
    ],
    min_price: [
      {
        required: true,
        message: "最低使用价格不能为空",
        trigger: "blur",
      },
    ],
    start_time: [
      {
        required: true,
        message: "开始时间不能为空",
        trigger: "blur",
      },
    ],
    end_time: [
      {
        required: true,
        message: "结束时间不能为空",
        trigger: "blur",
      },
    ],
  },
  currentPage,
  getData,
  update: updateCoupon,
  add: addCoupon,
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
    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>

    <el-table :data="tableList" style="width: 100%" stripe v-loading="loading">
      <el-table-column label="优惠券名称" class="truncate" width="350">
        <template #default="{ row }">
          <div
            class="border border-dashed py-2 px-4 rounded"
            :class="getClass(row)"
          >
            <h5 class="font-bold text-base">{{ row.name }}</h5>
            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" />
      <el-table-column label="优惠">
        <template #default="{ row }">
          {{ row.type === 1 ? "折扣" : "满减" }}
          {{ row.type === 1 ? row.value + "折" : "￥" + row.value }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="发行数量" />
      <el-table-column prop="used" label="已使用" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button
            type="primary"
            text
            size="small"
            @click="handleEdit(row)"
            v-if="row.statusText === '未开始'"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleEdit(row)"
            v-else-if="row.statusText === '领取中'"
          >
            失效
          </el-button>
          <el-popconfirm
            title="是否删除?"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDelete(row.id)"
            v-if="row.statusText !== '领取中'"
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
      ref="formDrawerRef"
      :title="drawerTitle"
      size="50%"
      @submit="handleSubmit"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="120px"
        :inline="false"
      >
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<style scoped>
.notStart {
  @apply border-blue-200 bg-blue-50 text-blue-300;
}
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
