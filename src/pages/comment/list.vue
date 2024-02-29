<script setup>
import { ref } from "vue";
import { getCommentList, updateCommentStatus, addComment } from "~/api/comment";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "../../components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项
const option = {
  searchForm: {
    title: "",
  },
  getList: getCommentList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      return item;
    });
    total.value = res.totalCount;
  },
  updateStatus: updateCommentStatus,
};

const {
  tableList,
  loading,
  searchForm,
  resetSearchForm,
  currentPage,
  total,
  limit,
  getData,
  handleStatusChange,
} = useInitTable(option);
</script>

<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <SearchItem label="关键词">
        <el-input
          v-model="searchForm.title"
          placeholder="商品标题"
          clearable
          size="small"
        ></el-input>
      </SearchItem>
    </Search>

    <el-table :data="tableList" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar
              shape="square"
              :size="60"
              :src="row.goods_item ? row.goods_item.cover : ''"
              class="w-[42px] h-[50px] rounded"
            >
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>
                {{ row.goods_item ? row.goods_item.title : "商品已被删除" }}
              </h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="300">
        <template #default="{ row }">
          <div>用户：{{ row.user.nickname || row.user.username }}</div>
          <el-rate
            v-model="row.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="review_time"
        label="评价时间"
        width="250"
        align="center"
      ></el-table-column>
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
