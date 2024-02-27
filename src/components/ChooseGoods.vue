<template>
  <el-dialog title="选择商品" v-model="dialogVisible" width="80%" top="5vh">
    <el-table
      ref="multipleTableRef"
      :data="tableList"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex">
            <el-image
              :src="row.cover"
              fit="cover"
              class="w-[50px] h-[50px] mr-3 rounded"
            ></el-image>
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <p class="text-gray-400 text-xs mb-1">
                分类：{{ row.category ? row.category.name : "未分类" }}
              </p>
              <p class="text-gray-400 text-xs mb-1">
                创建时间：{{ row.create_time }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总库存" prop="stock" width="100" align="center" />
      <el-table-column label="价格（元）" width="250" align="center">
        <template #default="{ row }">
          <span class="text-rose-500">¥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500 text-xs">¥{{ row.min_oprice }}</span>
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

    <template #footer>
      <span>
        <el-button type="default" @click="close">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { getGoodsList } from "~/api/goods";
import { useInitTable } from "~/composables/useCommon.js";
import { toast } from "../composables/util";

// 对话框
const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};
defineExpose({
  open,
  close,
});

// 商品列表
const option = {
  getList: getGoodsList,
  getListSuccess: (res) => {
    tableList.value = res.list;
    total.value = res.totalCount;
  },
};

const {
  tableList,
  currentPage,
  total,
  limit,
  getData,
  handleSelectionChange,
  multipleTableRef,
  hasSelect,
} = useInitTable(option);

// 点击确认
const handleSubmit = () => {
  if (!hasSelect.value) {
    return toast("请选择商品", "error");
  }
};
</script>

<style scoped></style>
