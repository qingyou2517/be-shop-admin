<template>
  <div>
    <Panel></Panel>

    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
        <SearchItem label="时间选择">
          <el-radio-group v-model="searchForm.type" size="small" @change="">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="today">今天</el-radio-button>
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="last7days">最近7天</el-radio-button>
          </el-radio-group>
        </SearchItem>

        <!-- 高级搜索：调用<Search>组件的具名插槽 -->
        <template #showAdvanced>
          <SearchItem label="开始时间">
            <el-date-picker
              v-model="searchForm.starttime"
              type="date"
              placeholder="开始日期"
              size="small"
              value-format="YYYY-MM-DD"
            />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-input
              v-model="searchForm.endtime"
              placeholder="结束日期"
              clearable
              size="small"
              value-format="YYYY-MM-DD"
            ></el-input>
          </SearchItem>
          <SearchItem label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="关键词"
              clearable
              size="small"
            ></el-input>
          </SearchItem>
        </template>
      </Search>

      <el-table
        :data="tableList"
        style="width: 100%"
        stripe
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="40" :src="row.avatar">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息">
          <template #default="{ row }">
            <div class="flex flex-col justify-start">
              <small>用户名：{{ row.username }}</small>
              <small>昵称：{{ row.nickname }}</small>
              <small>姓名：{{ row.user_info.name }}</small>
              <small>电话：{{ row.phone }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="share_num"
          label="推广用户数量"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="share_order_num"
          label="订单数量"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单金额"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="commission"
          label="账号佣金"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="cash_out_price"
          label="已提现金额"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="cash_out_time"
          label="提现次数"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="no_cash_out_price"
          label="未提现金额"
          width="100"
          align="center"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              text
              size="small"
              @click="openDataDrawer(row.id, 'user')"
            >
              推广人
            </el-button>
            <el-button
              type="primary"
              text
              size="small"
              @click="openDataDrawer(row.id, 'order')"
            >
              推广订单
            </el-button>
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

    <dataDrawer ref="dataDrawerRef" />
    <dataDrawer ref="orderDataDrawerRef" type="order" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAgentList } from "~/api/distribution";
import Panel from "./components/Panel.vue";
import Search from "../../components/search.vue";
import SearchItem from "../../components/SearchItem.vue";
import DataDrawer from "./components/DataDrawer.vue";
import { useInitTable } from "../../composables/useCommon";

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项
const option = {
  searchForm: {
    type: "all",
    starttime: "",
    endtime: "",
    keyword: "",
  },
  getList: getAgentList,
  getListSuccess: (res) => {
    tableList.value = res.list;
    total.value = res.totalCount;
  },
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
} = useInitTable(option);

// 打开表单抽屉
const dataDrawerRef = ref(null);
const orderDataDrawerRef = ref(null);
const openDataDrawer = (id, type) => {
  (type == "user" ? dataDrawerRef : orderDataDrawerRef).value.open(id);
};
</script>

<style scoped></style>
