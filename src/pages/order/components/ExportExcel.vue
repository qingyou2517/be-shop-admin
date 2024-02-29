<template>
  <el-drawer
    v-model="drawerVisible"
    title="导出订单"
    size="40%"
    destroy-on-close
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="订单类型" prop="tab">
        <el-select v-model="form.tab" placeholder="选择所属商品分类">
          <el-option
            v-for="item in typesList"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="form.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="handleExport"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import { exportOrder } from "~/api/order";
import { toast } from "~/composables/util";

defineProps({
  // 订单类型
  typesList: {
    type: Array,
    default: [],
    required: true,
  },
});

// 表单抽屉
const drawerVisible = ref(false);
const form = reactive({
  tab: null,
  timeRange: "",
});
const rules = {
  tab: [
    {
      required: true,
      message: "请选择订单类型",
    },
  ],
};

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

// 导出excel
const loading = ref(false);
const starttime = ref("");
const endtime = ref("");
const handleExport = async () => {
  if (!form.tab) {
    toast("请选择订单类型", "error");
    return;
  }
  try {
    loading.value = true;
    if (form.timeRange && Array.isArray(form.timeRange)) {
      starttime.value = form.timeRange[0];
      endtime.value = form.timeRange[1];
    }
    let res = await exportOrder({
      tab: form.tab,
      starttime: starttime.value,
      endtime: endtime.value,
    });
    // 构造隐藏的 a 标签，用于网页端下载文件
    const url = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    const filename = new Date().getTime() + ".xlsx";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    close();
  } catch (err) {
    console.error("导出订单数据失败：", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
