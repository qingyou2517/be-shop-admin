<template>
  <FormDrawer ref="formDrawerRef" title="推荐商品" @submit="handleSubmit">
    <el-table :data="tableData" border stripe class="w-full">
      <el-table-column prop="goods_id" label="ID" width="100" />
      <el-table-column label="商品封面" width="180">
        <template #default="{ row }">
          <el-image
            :src="row.cover"
            fit="fill"
            :lazy="true"
            class="w-[64px] h-[64px]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" class="truncate" />
      <el-table-column prop="title" label="操作" width="120">
        <template #default="{ row }">
          <el-popconfirm
            title="是否删除该商品?"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button
                :loading="row.btnLoading"
                type="primary"
                text
                size="small"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { getCategoryGoods, deleteCategoryGood } from "~/api/category.js";
import { toast } from "~/composables/util";

// 表单抽屉组件
const formDrawerRef = ref(null);
const category_id = ref(0);

// 抽屉组件的打开、关闭
const open = async (data) => {
  formDrawerRef.value.open();

  category_id.value = data.id;
  data.goodsDrawerLoading = true;
  try {
    await getTableData();
  } catch (err) {
    console.error(err);
  } finally {
    data.goodsDrawerLoading = false;
  }
};
const close = () => {
  formDrawerRef.value.close();
};
defineExpose({
  open,
  close,
});

// table 数据
const tableData = ref([]);

function getTableData() {
  return getCategoryGoods(category_id.value)
    .then((res) => {
      tableData.value = res.map((o) => {
        o.btnLoading = false;
        return o;
      });
    })
    .catch((err) => {
      console.error("获取table数据失败：", err);
    });
}

const handleDelete = async (row) => {
  row.btnLoading = true;
  try {
    await deleteCategoryGood(row.id);
    toast("删除成功");
    await getTableData();
  } catch (err) {
    console.error("删除关联产品失败：", err);
  }
};

// 表单提交
const handleSubmit = () => {};
</script>

<style scoped></style>
