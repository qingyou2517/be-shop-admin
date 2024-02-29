<template>
  <el-drawer
    v-model="drawerVisible"
    title="订单详情"
    size="40%"
    destroy-on-close
  >
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div>
          <span class="font-bold text-sm">订单详情</span>
        </div>
      </template>
      <el-form label-width="80px">
        <el-form-item label="订单号">{{ info.no }}</el-form-item>
        <el-form-item label="付款方式">{{ info.payment_method }}</el-form-item>
        <el-form-item label="付款时间">{{ info.paid_time }}</el-form-item>
        <el-form-item label="创建时间">{{ info.create_time }}</el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mb-4" v-if="info.ship_data">
      <template #header>
        <div>
          <span class="font-bold text-sm">发货信息</span>
        </div>
      </template>
      <el-form label-width="80px">
        <el-form-item label="物流公司">{{
          info.ship_data.express_company
        }}</el-form-item>
        <el-form-item label="运单号">{{
          info.ship_data.express_no
        }}</el-form-item>
        <el-form-item label="发货时间">{{ ship_time }}</el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div>
          <span class="font-bold text-sm">商品信息</span>
        </div>
      </template>
      <div
        class="flex my-2 items-center"
        v-for="item in info.order_items"
        :key="item.id"
      >
        <el-image
          fit="cover"
          :lazy="true"
          :src="item.goods_item ? item.goods_item.cover : ''"
          class="w-[60px] h-[60px] rounded"
        ></el-image>
        <div class="ml-2">
          <div>
            {{ item.goods_item ? item.goods_item.title : "该商品已被删除" }}
          </div>
          <div>
            <el-tag
              type="info"
              size="small"
              v-if="item.skus_type === 1 && item.goods_skus"
            >
              {{ getTagStr(item.goods_skus.skus) }}
            </el-tag>
          </div>
          <div>
            <span class="text-rose-500 font-bold text-sm"
              >¥ {{ item.price }}</span
            >
            <small class="ml-2 text-gray-500">×{{ item.num }}</small>
          </div>
        </div>
      </div>
      <el-form label-width="80px">
        <el-form-item label="成交价">
          <span class="text-rose-500 font-bold text-sm"
            >¥ {{ info.total_price }}</span
          >
        </el-form-item>
      </el-form>

      <div class="ml-6 mt-2"></div>
    </el-card>
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div>
          <span class="font-bold text-sm">收货信息</span>
        </div>
      </template>
      <el-form label-width="80px" :inline="false">
        <el-form-item label="收货人">{{ info.address.name }}</el-form-item>
        <el-form-item label="联系方式">{{ info.address.phone }}</el-form-item>
        <el-form-item label="收货地址">{{ receivedAddress }}</el-form-item>
      </el-form>
    </el-card>
    <el-card
      shadow="never"
      class="mb-4"
      v-if="info.refund_status !== 'pending'"
    >
      <template #header>
        <div class="flex items-center">
          <span class="font-bold text-sm">退款信息</span>
          <el-button type="text" size="default" disabled class="ml-auto">{{
            refund_status
          }}</el-button>
        </div>
      </template>
      <el-form label-width="80px">
        <el-form-item label="退款理由">{{
          info.extra.refund_reason
        }}</el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDateFormat } from "@vueuse/core";

const props = defineProps({
  info: {
    type: Object,
    default: {},
  },
});

// 商品信息：tag 展示多规格
const getTagStr = (skus) => {
  if (!Array.isArray(skus)) {
    skus = Object.keys(skus).map((key) => skus[key]);
  }
  const arr = skus.map((o) => o.value);
  return arr.join(",");
};

// 发货信息：展示发货时间
const ship_time = computed(() => {
  let str = useDateFormat(
    props.info.ship_data.express_time * 1000,
    "YYYY-MM-DD hh:mm:ss"
  );
  return str.value;
});

// 退款信息
const refund_status = computed(() => {
  const option = {
    pending: "未退款",
    applied: "已申请，等待审核",
    processing: "退款中",
    success: "退款成功",
    failed: "退款失败",
  };
  return option[props.info.refund_status];
});

// 收货信息：收货地址
const receivedAddress = computed(() => {
  const address = props.info.address;
  return address.province + address.city + address.district + address.address;
});

// 抽屉组件
const drawerVisible = ref(false);

const open = () => {
  drawerVisible.value = true;
};
const close = () => {
  drawerVisible.value = false;
};
defineExpose({
  open,
  close,
});
</script>

<style scoped>
:deep(.el-card__header) {
  @apply !p-2 bg-gray-50;
}
</style>
