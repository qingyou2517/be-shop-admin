<script setup>
import { ref, reactive } from "vue";
import AsideListItem from "~/components/AsideListItem.vue";
import { getImageClassList } from "~/api/image_class.js";

// 加载动画
const loading = ref(false);
// 图片分类名列表
const classNameList = ref([]);
// 激活的分类项
const activeId = ref(0);

// 分页
const currentPage = ref(1);
const total = ref(0); // 总共页数
const limit = ref(10); // 限制每页显示多少条分类名

// 改变activeId
function changeActive(id) {
  activeId.value = id;
}

// 获取数据
async function getData(p = null) {
  // 假如切换分页，getData 会拿到 current-change 事件传递过来的页码(即 p )
  if (typeof p === "number") {
    currentPage.value = p;
  }

  loading.value = true;
  try {
    let { list, totalCount } = await getImageClassList(currentPage.value);
    classNameList.value = list;
    total.value = totalCount;
    let item = classNameList.value[0]; // 默认选中第一项图片分类名
    if (item) activeId.value = item.id;
  } finally {
    loading.value = false;
  }
}
getData();
</script>

<template>
  <el-aside width="220px" class="border-right relative" v-loading="loading">
    <div class="absolute top-0 right-0 left-0 bottom-[50px] overflow-y-auto">
      <AsideListItem
        :active="activeId === item.id"
        v-for="(item, index) in classNameList"
        :key="index"
        @click="changeActive(item.id)"
        >{{ item.name }}</AsideListItem
      >
      <!-- <AsideList /> -->
    </div>
    <div
      class="flex justify-center items-center absolute left-0 right-0 bottom-0 h-[50px]"
    >
      <el-pagination
        background
        layout="prev,  next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-aside>
</template>

<style scoped></style>
