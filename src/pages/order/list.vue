<script setup>
import { ref } from "vue";
import {
  getOrderList,
  deleteMutiOrder,
  shipOrder,
  handleRefund,
  exportOrder,
  getExpressCompanyList,
  getShipInfo,
} from "~/api/order";
import { getCategoryList } from "~/api/category";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "../../components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import { useInitTable } from "../../composables/useCommon";

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项、批量删除、为按钮添加 loading
const option = {
  searchForm: {
    no: "",
    tab: "all",
    starttime: "",
    endtime: "",
    name: "",
    phone: null,
  },
  getList: getOrderList,
  getListSuccess: (res) => {
    tableList.value = res.list;
    total.value = res.totalCount;
  },
  delete: deleteMutiOrder,
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
  handleDelete,
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete,
} = useInitTable(option);

// tabs 切换
const tabBars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待发货",
  },
  {
    key: "shiped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];
// 商品分类
const categoryList = ref([]);
getCategoryList().then((res) => (categoryList.value = res));

// 订单详情：抽屉
const orderDrawerRef = ref(null);
</script>

<template>
  <div>
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane
        v-for="item in tabBars"
        :key="item.key"
        :label="item.name"
        :name="item.key"
      >
      </el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
        <!-- 通用搜索：调用<Search>组件的默认插槽 -->
        <SearchItem label="订单编号">
          <el-input
            v-model="searchForm.no"
            placeholder="订单编号"
            clearable
            size="small"
          ></el-input>
        </SearchItem>

        <!-- 高级搜索：调用<Search>组件的具名插槽 -->
        <template #showAdvanced>
          <SearchItem label="商品分类">
            <el-select
              v-model="searchForm.category_id"
              value-key=""
              placeholder="请选择商品分类"
              size="small"
              clearable
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>

      <ListHeader layout="delete" @delete="handleMultiDelete"></ListHeader>

      <el-table
        ref="multipleTableRef"
        :data="tableList"
        style="width: 100%"
        stripe
        v-loading="loading"
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
                <div>
                  <span class="text-rose-500">¥{{ row.min_price }}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class="text-gray-500 text-xs"
                    >¥{{ row.min_oprice }}</span
                  >
                </div>
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
        <el-table-column
          label="实际付款"
          prop="sale_count"
          width="100"
          align="center"
        />
        <el-table-column
          label="买家"
          prop="sale_count"
          width="150"
          align="center"
        />
        <el-table-column
          prop="status"
          label="交易状态"
          width="250"
          align="center"
        >
          <template #default="{ row }">
            <el-tag class="ml-2" type="success" v-if="row.status === 1"
              >上架</el-tag
            >
            <el-tag class="ml-2" type="danger" v-else>仓库</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <div>
              <el-button type="primary" text size="small" @click="">
                订单详情
              </el-button>
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

      <FormDrawer ref="orderDrawerRef" title="订单详情" :destroyOnClose="true">
      </FormDrawer>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-table__row .el-button + .el-button) {
  @apply ml-0;
}
</style>
