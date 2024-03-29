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
      <template v-else>
        <SkusCard></SkusCard>
        <SkusTable></SkusTable>
      </template>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
// 报错说需要把文件名首字母改为小写s，非常奇怪：文件名大写、引入时小写，我这样改居然就不报错了
import SkusCard from "./components/skusCard.vue";
import SkusTable from "./components/SkusTable.vue";
import { updateGoodsSkus, readGoods } from "~/api/goods";
import { toast } from "../../composables/util";
import {
  goodsId,
  initSkusCardList,
  skus_formData,
  skus_list,
} from "../../composables/useSkus.js";

const form = reactive({
  sku_type: 0,
  sku_value: { oprice: 0, pprice: 0, cprice: 0, weight: 0, volume: 0 },
});
const formDrawerRef = ref(null);

// 点击按钮，先请求加载数据，再打开抽屉
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
    initSkusCardList(res);
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

// 点击提交，设置商品(单/多)规格
const handleSubmit = async () => {
  formDrawerRef.value.showLoading();
  let data = {
    sku_type: form.sku_type,
    sku_value: form.sku_value,
  };
  if (form.sku_type === 1) {
    data.goodsSkus = skus_formData.value;
  }
  try {
    await updateGoodsSkus(goodsId.value, data);
    toast("设置商品规格成功");
    emit("reload");
    formDrawerRef.value.close();
  } catch (err) {
    console.error("设置商品规格失败: ", err);
  } finally {
    formDrawerRef.value.hideLoading();
  }
};

// skus_list更新的时候，同步到 skus_formData，且 skus_formData 要删去那些自定义字段
watch(
  () => skus_list.value,
  () => {
    skus_formData.value = JSON.parse(JSON.stringify(skus_list.value));
    skus_formData.value = skus_formData.value.map((skuObj) => {
      let skus = skuObj.skus;
      if (Object.prototype.toString(skus) === "[object Object]") {
        for (let key in skus) {
          // skus_formData 每一项删除那些自定义字段
          if (skuObj[`sku_value_${key}`]) {
            delete skuObj[`sku_value_${key}`];
          }
        }
      } else if (Array.isArray(skus)) {
        skus.forEach((item, i) => {
          // skus_formData 每一项删除那些自定义字段
          if (skuObj[`sku_value_${i}`]) {
            delete skuObj[`sku_value_${i}`];
          }
        });
      }
      return skuObj;
    });
  },
  { deep: true }
);
</script>

<style scoped></style>
