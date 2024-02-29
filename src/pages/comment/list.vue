<script setup>
import { ref } from "vue";
import {
  getCommentList,
  updateCommentStatus,
  reviewComment,
} from "~/api/comment";

import Search from "../../components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import { useInitTable } from "../../composables/useCommon";
import { toast } from "~/composables/util";

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项
const option = {
  searchForm: {
    title: "",
  },
  getList: getCommentList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.switchLoading = false;
      item.textareaEdit = false;
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

// 客服回复的内容
const textarea = ref("");
// 打开客服回复框
const openTextarea = (row, data = "") => {
  textarea.value = data;
  row.textareaEdit = true;
};
// 回复用户评价
const review = async (row) => {
  if (textarea.value === "") {
    toast("回复内容不能为空", "error");
    return;
  }
  try {
    await reviewComment(row.id, textarea.value);
    toast("回复成功");
    row.textareaEdit = false;
    getData();
  } catch (err) {
    console.error("回复用户评价失败：", err);
  }
};
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

    <el-table
      :data="tableList"
      style="width: 100%"
      stripe
      v-loading="loading"
      default-expand-all
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-14">
            <el-avatar
              :size="50"
              shape="circle"
              :src="row.user.avatar"
              fit="fill"
            ></el-avatar>
            <div class="flex-1 ml-2">
              <!-- 渲染用户评价 -->
              <h6 class="flex items-center">
                <span>{{ row.user.nickname || row.user.username }}</span>
                <small class="text-warm-gray-400 ml-2">{{
                  row.review_time
                }}</small>
                <!-- 若客服还未回复，那么在这里渲染一个 "回复" 按钮 -->
                <el-button
                  size="small"
                  class="ml-auto"
                  @click="openTextarea(row)"
                  v-if="!row.textareaEdit && !row.extra"
                  >回复</el-button
                >
              </h6>
              <p>{{ row.review.data }}</p>
              <div class="py-2">
                <el-image
                  v-for="(src, index) in row.review.image"
                  :key="index"
                  :src="src"
                  fit="cover"
                  :lazy="true"
                  class="w-[100px] h-[100px] rounded"
                ></el-image>
              </div>
              <!-- 客服的回复框 -->
              <div v-if="row.textareaEdit">
                <el-input
                  v-model="textarea"
                  placeholder="请输入回复内容"
                  clearable
                  type="textarea"
                  @change=""
                ></el-input>
                <div class="py-2">
                  <el-button type="primary" size="small" @click="review(row)"
                    >回复</el-button
                  ><el-button size="small" @click="row.textareaEdit = false"
                    >取消</el-button
                  >
                </div>
              </div>
              <!-- 若客服已回复，则通过这里修改 -->
              <div
                class="mt-2 bg-gray-100 p-3 rounded"
                v-for="(item, index) in row.extra"
                :key="index"
                v-else
              >
                <div class="flex items-center">
                  <h6 class="font-bold">客服</h6>
                  <el-button
                    type="info"
                    size="small"
                    class="ml-auto"
                    @click="openTextarea(row, item.data)"
                    >修改</el-button
                  >
                </div>
                <p>{{ item.data }}</p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
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
