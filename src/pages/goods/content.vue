<template>
  <FormDrawer
    ref="formDrawerRef"
    title="设置商品详情"
    destroy-on-close
    @submit="handleSubmit"
  >
    <el-form :model="form">
      <el-form-item>
        <Editor v-model="form.content"></Editor>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import Editor from "~/components/Editor.vue";
import { readGoods, updateGood } from "~/api/goods";
import { toast } from "../../composables/util";

const form = reactive({
  content: "",
});
const formDrawerRef = ref(null);

// 点击按钮，先请求加载数据，再打开抽屉
const goodsId = ref(0);
const open = async (row) => {
  goodsId.value = row.id;
  row.contentLoading = true;
  try {
    const res = await readGoods(goodsId.value);
    form.content = res.content;
    formDrawerRef.value.open();
  } catch (err) {
    console.error("查看商品资料失败: ", err);
  } finally {
    row.contentLoading = false;
  }
};

defineExpose({
  open,
});

const emit = defineEmits(["reload"]);

// 点击提交，设置商品详情
const handleSubmit = async () => {
  formDrawerRef.value.showLoading();
  try {
    await updateGood(goodsId.value, form);
    toast("设置商品详情成功");
    emit("reload");
    formDrawerRef.value.close();
  } catch (err) {
    console.error("设置商品详情失败: ", err);
  } finally {
    formDrawerRef.value.hideLoading();
  }
};
</script>

<style scoped></style>
