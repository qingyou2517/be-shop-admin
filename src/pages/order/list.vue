<script setup>
import { ref } from "vue";
import {
  getOrderList,
  deleteMutiOrder,
  shipOrder,
  handleRefund,
  exportOrder,
  getExpressCompanyList,
} from "~/api/order";
import { getCategoryList } from "~/api/category";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "../../components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import ExportExcel from "./components/ExportExcel.vue";
import InfoModal from "./components/InfoModal.vue";
import { useInitTable } from "../../composables/useCommon";
import { showModal, showPrompt, toast } from "~/composables/util";

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

// 导出excel数据
const exportExcelRef = ref(null);
const handleDownload = () => {
  exportExcelRef.value.open();
};

// 查看订单详情
const info = ref(null);
const infoModalRef = ref(null);
const openInfoModal = (row) => {
  infoModalRef.value.open();
  info.value = row;
};

// 同意/拒绝退款
const handleShipRefund = async (id, agree) => {
  // agree 为 1 表同意，为 0 表拒绝
  try {
    if (agree) {
      await handleRefund(id, { agree });
      showModal("是否要同意该订单退款?")
        .then((res) => {
          return toast("已同意退款申请");
        })
        .catch((err) => {});
    } else {
      let reason = await showPrompt("请输入拒绝的理由");
      await handleRefund(id, { agree, disagree_reason: reason });
    }
    getData();
  } catch (err) {
    console.error(err);
  }
};
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
          <SearchItem label="收货人">
            <el-input
              v-model="searchForm.name"
              placeholder="收货人"
              clearable
              size="small"
            ></el-input>
          </SearchItem>
          <SearchItem label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="手机号"
              clearable
              size="small"
            ></el-input>
          </SearchItem>
          <SearchItem label="开始时间">
            <el-date-picker
              v-model="searchForm.starttime"
              type="date"
              placeholder="选择开始日期"
              value-format="YYYY-MM-DD"
              size="small"
            />
          </SearchItem>
          <SearchItem label="结束日期">
            <el-date-picker
              v-model="searchForm.endtime"
              type="date"
              placeholder="选择结束日期"
              value-format="YYYY-MM-DD"
              size="small"
            />
          </SearchItem>
        </template>
      </Search>

      <ListHeader
        layout="delete,refresh,download"
        @delete="handleMultiDelete"
        @refresh="getData"
        @download="handleDownload"
      >
      </ListHeader>

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
              <div class="flex-1">
                <p>订单编号：</p>
                <small>{{ row.no }}</small>
              </div>
              <div>
                <p>下单时间：</p>
                <small>{{ row.update_time }}</small>
              </div>
            </div>
            <div
              v-for="item in row.order_items"
              :key="item.id"
              class="flex items-center mt-2"
            >
              <el-image
                :src="item.goods_item ? item.goods_item.cover : ''"
                fit="cover"
                :lazy="true"
                class="w-[30px] h-[30px] rounded"
              ></el-image>
              <div class="flex-1 text-blue-500 ml-2">
                {{ item.goods_item ? item.goods_item.title : "该商品已被删除" }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际付款"
          prop="total_price"
          width="100"
          align="center"
        />
        <el-table-column label="买家" width="200" align="center">
          <template #default="{ row }">
            <div>{{ row.user.nickname || row.user.username }}</div>
            <small>(用户ID：{{ row.user.id }})</small>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" width="250" align="center">
          <template #default="{ row }">
            <div class="flex flex-col items-center">
              <div>付款状态：</div>
              <div class="mt-1">
                <el-tag v-if="row.payment_method === 'wechat'" type="success"
                  >微信支付</el-tag
                >
                <el-tag v-if="row.payment_method === 'alipay'"
                  >支付宝支付</el-tag
                >
                <el-tag v-else type="info" v-if="row.status === 1"
                  >未支付</el-tag
                >
              </div>
              <div class="flex items-center">
                <div>发货状态：</div>
                <div class="mt-1">
                  <el-tag v-if="row.ship_data" type="success">已发货</el-tag>
                  <el-tag v-else type="info">未发货</el-tag>
                </div>
              </div>
              <div class="flex items-center">
                <div>收货状态：</div>
                <div class="mt-1">
                  <el-tag v-if="row.ship_status === 'received'" type="success"
                    >已收货</el-tag
                  >
                  <el-tag v-else type="info">未收货</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template #default="{ row }">
            <div>
              <el-button
                type="primary"
                text
                size="small"
                @click="openInfoModal(row)"
              >
                订单详情
              </el-button>
              <el-button
                v-if="searchForm.tab === 'noship'"
                type="primary"
                text
                size="small"
                @click=""
              >
                订单发货
              </el-button>
              <el-button
                v-if="searchForm.tab === 'refunding'"
                type="primary"
                text
                size="small"
                @click="handleShipRefund(row.id, 1)"
              >
                同意退款
              </el-button>
              <el-button
                v-if="searchForm.tab === 'refunding'"
                type="primary"
                text
                size="small"
                @click="handleShipRefund(row.id, 0)"
              >
                拒绝退款
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

      <ExportExcel ref="exportExcelRef" :typesList="tabBars"></ExportExcel>

      <InfoModal ref="infoModalRef" :info="info"></InfoModal>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-table__row .el-button + .el-button) {
  @apply ml-0;
}
</style>
