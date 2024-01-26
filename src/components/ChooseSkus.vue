<template>
  <el-dialog title="选择规格" v-model="dialogVisible" width="80%" top="5vh">
    <el-container style="height: 65vh">
      <el-aside width="200px" class="border-right relative" v-loading="loading">
        <div
          class="absolute top-0 right-0 left-0 bottom-[50px] overflow-y-auto"
        >
          <!-- 规格选项 -->
          <div
            v-for="(item, index) in tableList"
            :key="index"
            class="p-3 text-sm text-gray-500 flex items-center cursor-pointer border-bottom hover:( bg-blue-100)"
            :class="{ 'bg-blue-100': activeId === item.id }"
            @click="selectSku(item)"
          >
            {{ item.name }}
          </div>
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
      <el-main class="relative" v-loading="loading">
        <div
          class="absolute top-0 right-0 left-0 bottom-[50px] overflow-y-auto p-3"
        >
          <!-- 规格值 -->
          <el-checkbox-group v-model="form.list">
            <el-checkbox v-for="item in list" :key="item" :label="item" border>
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-main>
    </el-container>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getSkusList } from "~/api/sku";
import { useInitTable } from "~/composables/useCommon";

// 打开规格选择弹窗
const dialogVisible = ref(false);
let callbackFun; // 用于传递所选规格数据
const open = (callback = null) => {
  callbackFun = callback;
  dialogVisible.value = true;
  getData(1);
};

defineExpose({
  open,
});

// 调用useInitTable()
const option = {
  getList: getSkusList,
  // 默认选中第一个规格选项
  getListSuccess: (res) => {
    tableList.value = res.list;
    if (tableList.value.length > 0) {
      selectSku(tableList.value[0]);
    }
    total.value = res.totalCount;
  },
};
const { tableList, loading, currentPage, total, limit, getData } =
  useInitTable(option);

// 选择规格选项、展示对应规格值
const activeId = ref(0);
const list = ref([]);
const form = reactive({
  name: "",
  list: [],
});
function selectSku(item) {
  activeId.value = item.id;
  list.value = []; // 清空
  const valueObj = tableList.value.find((obj) => obj.id === item.id);
  if (valueObj) {
    list.value = valueObj.default.split(",");
    form.name = valueObj.name;
  }
}

// 选择规格后，提交
const handleSubmit = () => {
  if (typeof callbackFun === "function") {
    callbackFun(form);
  }
  dialogVisible.value = false;
};
</script>

<style scoped>
.border-right {
  border-right: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #f4f4f4;
}
</style>
