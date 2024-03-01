<template>
  <el-drawer
    v-model="drawerVisible"
    title="物流信息"
    size="40%"
    destroy-on-close
  >
    <el-card shadow="never" class="border-0">
      <template #header>
        <div class="flex items-center mb-3">
          <el-image
            :src="info.logo"
            fit="cover"
            :lazy="true"
            class="w-[60px] h-[60px] rounded border"
          ></el-image>
          <div class="ml-2">
            <p>物流公司：{{ info.typename }}</p>
            <p>物流单号：{{ info.number }}</p>
          </div>
        </div>
      </template>
      <el-timeline style="max-width: 600px" class="ml-[-40px]">
        <el-timeline-item
          :timestamp="item.time"
          placement="top"
          v-for="(item, index) in info.list"
        >
          <p>{{ item.status }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { getShipInfo } from "~/api/order";
import { toast } from "~/composables/util";

const props = defineProps({
  shipInfo: {
    type: Object,
    default: {},
  },
});

// 抽屉组件
const drawerVisible = ref(false);
const info = ref(null);
const open = (id) => {
  return getShipInfo(id)
    .then((res) => {
      if (res.status !== 0) {
        return toast("订单号失效了", "error");
      }
      drawerVisible.value = true;
      info.value = res.result;
    })
    .catch((err) => {
      console.error("获取物流信息失败：", err);
    });
};
const close = () => {
  drawerVisible.value = false;
};
defineExpose({
  open,
  close,
});
</script>

<style scoped></style>
