<template>
  <el-row :gutter="20" class="mb-5">
    <!-- 骨架屏 -->
    <template v-if="loading">
      <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
        <el-skeleton style="width: 100%" animated loading>
          <template #template>
            <el-card shadow="hover" class="border-0">
              <!-- 使用 <el-skeleton-item> 替换 <el-card> 内的数据渲染部分 -->
              <template #header>
                <div class="flex justify-between">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </template>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <!-- 实际内容 -->
    <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
      <el-card shadow="never">
        <div class="flex items-center">
          <div
            class="hidden bg-blue-400 bg-orange-400 bg-green-400 bg-indigo-400"
          ></div>
          <el-icon
            :class="item.color"
            class="w-[40px] h-[40px] rounded-full text-white"
            :size="20"
          >
            <User v-if="index === 0" />
            <ShoppingCart v-if="index === 1" />
            <PriceTag v-if="index === 2" />
            <Timer v-if="index === 3" />
          </el-icon>
          <div class="flex flex-col ml-2">
            <p class="font-bold text-lg">{{ item.value }}</p>
            <small class="text-gray-400 text-xs mt-2">{{ item.label }}</small>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getAgentStatistics } from "~/api/distribution";

const list = ref([]);
const loading = ref(false);
const getData = async () => {
  loading.value = true;
  try {
    const res = await getAgentStatistics();
    list.value = res.panels;
  } catch (err) {
    console.error("获取分销统计数据失败：", err);
  } finally {
    loading.value = false;
  }
};
getData();
</script>

<style scoped></style>
