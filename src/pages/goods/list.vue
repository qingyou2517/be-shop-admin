<script setup>
import { ref } from "vue";
import {
  getGoodsList,
  updateGoodsStatus,
  addGood,
  updateGood,
  deleteGoods,
  restoreGoods,
  destroyGoods,
} from "~/api/goods";
import { getCategoryList } from "~/api/category";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "../../components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import banners from "./banners.vue";
import content from "./content.vue";
import skus from "./skus.vue";
import { useInitTable, useInitForm } from "../../composables/useCommon";

// 组件特有的搜索、get方法、get成功后的数据操作、修改状态、删除表格项、批量删除、为按钮添加 loading
const option = {
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: getGoodsList,
  getListSuccess: (res) => {
    tableList.value = res.list.map((item) => {
      item.bannersLoading = false; // 为"设置轮播图"按钮添加 loading 效果
      item.contentLoading = false; // 为"商品详情"按钮添加 loading 效果
      item.skusLoading = false; // 为"商品规格"按钮添加 loading 效果
      return item;
    });
    total.value = res.totalCount;
  },
  updateStatus: updateGoodsStatus,
  delete: deleteGoods,
  restoreGoods: restoreGoods,
  destroyGoods: destroyGoods,
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
  handleReStoreGoods,
  handleDestroyGoods,
  handleMultiStatusChange,
  hasSelect,
} = useInitTable(option);

// 新增、修改
const formOption = {
  defaultForm: {
    title: "",
    category_id: null,
    cover: null,
    desc: "",
    unit: "件",
    stock: 100, // 总库存
    min_stock: 10, // 库存预警
    status: 1, // 上架状态：0 表示处于仓库，1表示上架
    stock_display: 1, // 库存显示：0表示隐藏，1表示显示
    min_price: 0, // 最多售价
    min_oprice: 0, // 最低原价
  },
  rules: {
    title: [
      {
        required: true,
        message: "商品名称不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    cover: [
      {
        required: true,
        message: "请上传一个封面",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    category_id: [
      {
        required: true,
        message: "请选择所属分类",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
    unit: [
      {
        required: true,
        message: "请输入单位",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  currentPage,
  getData,
  update: updateGood,
  add: addGood,
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

// tabs 切换
const tabBars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];
// 商品分类
const categoryList = ref([]);
getCategoryList().then((res) => (categoryList.value = res));

// 轮播图
const bannersRef = ref(null);
const handleSetBanners = (row) => {
  bannersRef.value.open(row);
};

// 设置商品详情
const contentRef = ref(null);
const handleSetContent = (row) => {
  contentRef.value.open(row);
};

// 设置商品规格
const skusRef = ref(null);
const handleSetSkus = (row) => {
  skusRef.value.open(row);
};
// 是否设置了商品规格
const hasSetSkus = (row) => {
  if (row.sku_type === 1 && row.goods_skus.length === 0) {
    return false;
  } else if (row.sku_type === 0 && !row.sku_value) {
    return false;
  } else {
    return true;
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
        <SearchItem label="关键词">
          <el-input
            v-model="searchForm.title"
            placeholder="商品名称"
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

      <ListHeader
        layout="create,refresh"
        @create="handleAdd"
        @refresh="getData"
      >
        <el-button
          size="small"
          type="danger"
          @click="handleMultiDelete"
          v-if="searchForm.tab !== 'delete'"
          >批量删除</el-button
        >
        <el-button
          size="small"
          type="warning"
          @click="handleReStoreGoods"
          v-if="searchForm.tab === 'delete'"
          >恢复商品</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDestroyGoods"
          v-if="searchForm.tab === 'delete'"
          >彻底删除</el-button
        >
        <el-button
          size="small"
          @click="handleMultiStatusChange(1)"
          v-if="searchForm.tab === 'all' || searchForm.tab === 'off'"
          >上架</el-button
        >
        <el-button
          size="small"
          @click="handleMultiStatusChange(0)"
          v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'"
          >下架</el-button
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
        <el-table-column label="商品" width="350">
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
        <el-table-column label="实际销量" prop="sale_count" align="center" />
        <el-table-column label="商品状态" prop="status">
          <template #default="{ row }">
            <el-tag class="ml-2" type="success" v-if="row.status === 1"
              >上架</el-tag
            >
            <el-tag class="ml-2" type="danger" v-else>仓库</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          width="120"
          align="center"
          v-if="searchForm.tab !== 'delete'"
        >
          <template #default="{ row }">
            <div
              v-if="row.ischeck === 0"
              class="flex flex-col items-center justify-center"
            >
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button type="danger" size="small" plain class="mt-2"
                >审核拒绝</el-button
              >
            </div>
            <span v-else>{{ row.ischeck === 1 ? "通过" : "拒绝" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总库存" prop="stock" align="center" />
        <el-table-column label="操作" align="center" width="450">
          <template #default="scope">
            <div v-if="searchForm.tab !== 'delete'">
              <el-button
                type="primary"
                text
                size="small"
                @click="handleEdit(scope.row)"
              >
                修改
              </el-button>
              <el-button
                :type="hasSetSkus(scope.row) ? 'primary' : 'danger'"
                text
                size="small"
                :loading="scope.row.skusLoading"
                @click="handleSetSkus(scope.row)"
              >
                商品规格
              </el-button>
              <el-button
                :type="
                  scope.row.goods_banner.length === 0 ? 'danger' : 'primary'
                "
                text
                size="small"
                :loading="scope.row.bannersLoading"
                @click="handleSetBanners(scope.row)"
              >
                设置轮播图
              </el-button>
              <el-button
                :type="scope.row.content ? 'primary' : 'danger'"
                text
                size="small"
                :loading="scope.row.contentLoading"
                @click="handleSetContent(scope.row)"
              >
                商品详情
              </el-button>
              <el-popconfirm
                title="是否删除该商品?"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button type="primary" text size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <div v-else>暂无操作</div>
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

      <FormDrawer
        ref="formDrawerRef"
        :title="drawerTitle"
        :destroyOnClose="true"
        @submit="handleSubmit"
      >
        <el-form
          :model="form"
          ref="formRef"
          :rules="rules"
          label-width="100px"
          :inline="false"
        >
          <el-form-item label="商品名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入商品名称，不能超过60个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <ChooseImage v-model="form.cover"></ChooseImage>
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select
              v-model="form.category_id"
              placeholder="选择所属商品分类"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input
              type="textarea"
              v-model="form.desc"
              placeholder="选填，商品卖点"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入单位"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input type="number" v-model="form.stock" style="width: 40%">
              <template #append>{{ form.unit ? form.unit : "件" }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input type="number" v-model="form.min_stock" style="width: 40%">
              <template #append>{{ form.unit ? form.unit : "件" }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低售价" prop="min_price">
            <el-input type="number" v-model="form.min_price" style="width: 40%">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_price">
            <el-input
              type="number"
              v-model="form.min_oprice"
              style="width: 40%"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>

    <banners ref="bannersRef" @reload="getData"></banners>
    <content ref="contentRef" @reload="getData"></content>
    <skus ref="skusRef" @reload="getData"></skus>
  </div>
</template>

<style scoped>
:deep(.el-table__row .el-button + .el-button) {
  @apply ml-0;
}
</style>
