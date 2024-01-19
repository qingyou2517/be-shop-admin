<template>
  <FormDrawer
    ref="formDrawerRef"
    title="设置商品详情"
    destroy-on-close
    size="70%"
    @submit="handleSubmit"
  >
    <el-form :model="form">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0">单规格</el-radio>
          <el-radio :label="1">多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 单规格 -->
      <template v-if="form.sku_type === 0">
        <el-form-item label="市场价格">
          <el-input v-model="form.sku_value.oprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="form.sku_value.pprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="form.sku_value.cprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.sku_value.weight" style="width: 35%">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="form.sku_value.volume" style="width: 35%">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <!-- 多规格 -->
      <template v-else></template>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { setGoodsSkus, readGoods } from "~/api/goods";
import { toast } from "../../composables/util";

const form = reactive({
  sku_type: 0,
  sku_value: { oprice: 0, pprice: 0, cprice: 0, weight: 0, volume: 0 },
});
const formDrawerRef = ref(null);

// 点击按钮，先请求加载数据，再打开抽屉
const goodsId = ref(0);
const open = async (row) => {
  goodsId.value = row.id;
  row.skusLoading = true;
  try {
    const res = await readGoods(goodsId.value);
    form.sku_type = res.sku_type || 0;
    form.sku_value = res.sku_value || {
      oprice: 0,
      pprice: 0,
      cprice: 0,
      weight: 0,
      volume: 0,
    };
    formDrawerRef.value.open();
  } catch (err) {
    console.error("查看商品资料失败: ", err);
  } finally {
    row.skusLoading = false;
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
    await setGoodsSkus(goodsId.value, form);
    toast("设置商品规格成功");
    emit("reload");
    formDrawerRef.value.close();
  } catch (err) {
    console.error("设置商品规格失败: ", err);
  } finally {
    formDrawerRef.value.hideLoading();
  }
};
</script>

<style scoped></style>
