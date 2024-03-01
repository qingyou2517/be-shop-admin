<template>
  <div class="bg-light-50 rounded p-4">
    <el-form :model="form" label-width="150px">
      <el-form-item label="物流查询key">
        <div class="flex flex-col">
          <el-input v-model="form.ship" style="width: 350px"> </el-input>
          <small class="text-gray-600 mt-1"
            >用于查询物流信息，接口申请（仅供参考）</small
          >
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getSysconfigList, setSysconfig } from "~/api/sysconfig";
import { toast } from "~/composables/util";

// 购物设置、抽屉组件依赖的数据
const form = reactive({
  ship: "",
});

const getData = async () => {
  try {
    let res = await getSysconfigList();
    for (const key in form) {
      form[key] = res[key];
    }
  } catch (err) {
    console.error(err);
  }
};
getData();

const loading = ref(false);
const handleSave = async () => {
  loading.value = true;
  try {
    await setSysconfig({
      ...form,
    });
    toast("修改配置成功");
    getData();
  } catch (err) {
    console.error("修改配置失败：", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
