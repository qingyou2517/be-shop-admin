<template>
  <el-drawer
    title="设置轮播图"
    v-model="dialogVisible"
    size="50%"
    destroy-on-close
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图">
        <ChooseImage v-model="form.banners" :limit="9"></ChooseImage>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import ChooseImage from "~/components/ChooseImage.vue";
import { readGoods, setGoodsBanner } from "~/api/goods";
import { toast } from "../../composables/util";

const dialogVisible = ref(false);
const form = reactive({
  banners: [],
});

// 打开抽屉
const goodsId = ref(0);
const open = async (row) => {
  goodsId.value = row.id;
  row.bannersLoading = true;
  try {
    const res = await readGoods(goodsId.value);
    form.banners = res.goodsBanner.map((item) => item.url);
    dialogVisible.value = true;
  } catch (err) {
    console.error("查看商品资料失败: ", err);
  } finally {
    row.bannersLoading = false;
  }
};
// 关闭抽屉
const close = () => (dialogVisible.value = false);

defineExpose({
  open,
});

const emit = defineEmits(["reload"]);

// 点击提交，设置轮播图
const loading = ref(false);
const handleSubmit = async () => {
  loading.value = true;
  try {
    await setGoodsBanner(goodsId.value, form);
    toast("设置轮播图成功");
    emit("reload");
    close();
  } catch (err) {
    console.error("设置轮播图失败: ", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
