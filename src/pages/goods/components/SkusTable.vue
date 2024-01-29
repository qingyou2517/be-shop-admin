<template>
  <el-form-item label="规格设置">
    <el-popconfirm
      title="是否重置所有筛选条件?"
      confirmButtonText="确认"
      cancelButtonText="取消"
      @confirm="clearFilter"
    >
      <template #reference>
        <el-button type="primary" size="small" class="my-2"
          >重置所有筛选条件</el-button
        >
      </template>
    </el-popconfirm>

    <el-table :data="skus_list" border style="width: 100%" ref="tableRef">
      <el-table-column label="商品规格" style="text-align: center">
        <el-table-column
          v-for="(skuObj, index) in skus_labels"
          :key="skuObj.id"
          :label="skuObj.name"
          :prop="`sku_value_${index}`"
          v-if="skus_labels.length > 0"
          :filters="getFilters(index)"
          :filter-method="filterSku"
          filter-placement="bottom-end"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="销售价" prop="pprice">
        <template #default="{ row }">
          <el-input v-model="row.pprice" size="small" type="number"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="市场价" prop="oprice">
        <template #default="{ row }">
          <el-input v-model="row.oprice" size="small" type="number"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="成本价" prop="cprice">
        <template #default="{ row }">
          <el-input v-model="row.cprice" size="small" type="number"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock">
        <template #default="{ row }">
          <el-input v-model="row.stock" size="small" type="number"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="体积" prop="volume">
        <template #default="{ row }">
          <el-input v-model="row.volume" size="small" type="number"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight">
        <template #default="{ row }">
          <el-input v-model="row.weight" size="small" type="number"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="编码" prop="code">
        <template #default="{ row }">
          <el-input v-model="row.code" size="small"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-form-item>
</template>

<script setup>
import { ref, computed } from "vue";
import { initSkusTable } from "~/composables/useSkus";

const { skus_labels, skus_list } = initSkusTable();

// 列表筛选
const tableRef = ref(null);
const getFilters = (index) => {
  let arr = [];
  let skusCardValue = skus_labels.value[index].goodsSkusCardValue;
  skusCardValue.forEach((item) => {
    arr.push({
      text: item.value,
      value: item.value,
    });
  });
  return arr;
};
const filterSku = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};
const clearFilter = () => {
  tableRef.value.clearFilter();
};
</script>

<style scoped>
:deep(.el-table__cell) {
  text-align: center;
}
</style>
