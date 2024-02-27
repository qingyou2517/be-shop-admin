<script setup>
import { ref } from "vue";
import {
  getLevelList,
  addLevel,
  updateLevel,
  updateLevelStatus,
  deleteLevel,
} from "~/api/level.js";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 列表展示、修改状态、删除列表项
const option = {
  getList: getLevelList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = res.totalCount;
  },
  updateStatus: updateLevelStatus,
  delete: deleteLevel,
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
} = useInitTable(option);

// 新增、修改
const formOption = {
  defaultForm: {
    name: "",
    level: "",
    status: 1,
    discount: 100,
    max_price: 1000,
    max_times: 500,
  },
  rules: {
    name: [
      {
        required: true,
        message: "会员名称不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  currentPage,
  getData,
  update: updateLevel,
  add: addLevel,
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
      <el-table-column prop="name" label="会员等级" class="truncate" />
      <el-table-column prop="discount" label="折扣率" align="center" />
      <el-table-column prop="discount" label="等级序号" align="center" />
      <el-table-column label="状态" width="150" align="center">
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
            title="是否删除?"
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
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="等级权重" prop="level">
          <el-input v-model="form.level"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="升级条件">
          <div class="flex flex-col">
            <div>
              <small class="text-xs mr-2">累计消费满</small>
              <el-input
                type="number"
                v-model="form.max_price"
                style="width: 50%"
              >
                <template #append>元</template>
              </el-input>
              <small class="text-gray-400 flex"
                >设置会员等级所需要的累计消费必须大于等于0,单位：元</small
              >
            </div>
            <div>
              <small class="text-xs mr-2">累计次数满 </small>
              <el-input
                type="number"
                v-model="form.max_times"
                style="width: 50%"
              >
                <template #append>%</template>
              </el-input>
              <small class="text-gray-400 flex"
                >设置会员等级所需要的购买量必须大于等于0,单位：笔</small
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="折扣率" prop="discount">
          <el-input type="number" v-model="form.discount" style="width: 50%">
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex"
            >折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small
          >
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<style scoped></style>
