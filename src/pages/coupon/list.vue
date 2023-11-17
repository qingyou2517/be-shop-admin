<script setup>
import { computed } from "vue";
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

// 日期选择器
const timeRange = computed({
  get() {
    if (form.start_time && form.end_time) {
      return [form.start_time, form.end_time];
    } else {
      return [];
    }
  },
  set(val) {
    form.start_time = val[0];
    form.end_time = val[1];
  },
});

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

// 新增、修改
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
  beforeSubmit: (formObj) => {
    // 修改优惠券起止时间的格式为时间戳
    if (typeof formObj.start_time !== "number") {
      formObj.start_time = new Date(formObj.start_time).getTime();
    }
    if (typeof formObj.end_time !== "number") {
      formObj.end_time = new Date(formObj.end_time).getTime();
    }
    return formObj;
  },
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
          <el-popconfirm
            title="是否让它失效?"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm=""
            v-if="row.statusText === '领取中'"
          >
            <template #reference>
              <el-button type="danger" size="small" @click="handleEdit(row)">
                失效
              </el-button>
            </template>
          </el-popconfirm>

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
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" placeholder="优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" class="flex items-center">
          <el-radio-group v-model="form.type">
            <el-radio :label="0" size="large">满减</el-radio>
            <el-radio :label="1" size="large">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值" prop="value">
          <el-input v-model="form.value" class="w-[50%]">
            <template #append>{{ form.type === 0 ? "元" : "折" }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="form.total" label="" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="最低使用价格" prop="min_price">
          <el-input v-model="form.min_price"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" label="" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :editable="false"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.content" type="textarea" :rows="4"></el-input>
        </el-form-item>
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
