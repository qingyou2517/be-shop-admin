<script setup>
import { ref, reactive, computed } from "vue";
import AsideListItem from "~/components/AsideListItem.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import {
  getImageClassList,
  createImageClass,
  updateImageClass,
  deleteImageClass,
} from "~/api/image_class.js";
import { toast } from "~/composables/util.js";

// 加载动画
const loading = ref(false);
// 图片分类名列表
const classNameList = ref([]);
// 选中的图库分类id
const activeId = ref(0);

// 分页
const currentPage = ref(1);
const total = ref(0); // 总共页数
const limit = ref(10); // 限制每页显示多少条分类名

// 区分复用抽屉组件时，具体是新增还是修改
const functionType = ref("");
const drawerTitle = computed(() => {
  return functionType.value === "create" ? "新增" : "修改";
});
const editId = ref(0);

// 改变activeId
const emit = defineEmits(["change"]);
function changeActive(id) {
  activeId.value = id;
  emit("change", id);
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
    if (item) changeActive(item.id); // 把第一项分类的id通知给父组件
  } finally {
    loading.value = false;
  }
}
getData();

// 调用FormDrawer组件提供的方法
const formDrawerRef = ref(null);
const handleCreate = () => {
  formDrawerRef.value.open();
  functionType.value = "create";
  formData.name = "";
  formData.order = 50;
};

// "新增图片分类" 按钮在父组件 image/list.vue 的头部区域，所以需要父组件触发打开抽屉
defineExpose({
  handleCreate,
});

// 表单
const formData = reactive({
  name: "",
  order: 50,
});
const formRef = ref(null);
const rules = {
  name: [
    {
      required: true,
      message: "图片分类名称不能为空",
      trigger: "blur", // 触发校验的时机是：失去焦点时
    },
  ],
};

// 监听FormDrawer组件提供 submit 的事件
function handleSubmit() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    // console.log("提交成功");
    formDrawerRef.value.showLoading();
    try {
      if (functionType.value === "create") {
        await createImageClass(formData);
        toast("新增成功");
        getData(1);
      } else if (functionType.value === "update") {
        await updateImageClass(editId.value, formData);
        toast("修改成功");
        getData(currentPage.value);
      }

      formDrawerRef.value.close();
    } finally {
      formDrawerRef.value.hideLoading();
    }
  });
}

// 编辑分类名
function handleEdit(item) {
  formData.name = item.name;
  formData.order = item.order;
  editId.value = item.id;
  functionType.value = "update";
  formDrawerRef.value.open();
}

// 删除分类名
async function handleDelete(id) {
  loading.value = true;
  try {
    await deleteImageClass(id);
    toast("删除成功");
    getData(currentPage.value);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <el-aside width="220px" class="border-right relative" v-loading="loading">
    <div class="absolute top-0 right-0 left-0 bottom-[50px] overflow-y-auto">
      <AsideListItem
        :active="activeId === item.id"
        v-for="(item, index) in classNameList"
        :key="index"
        @click="changeActive(item.id)"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
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

  <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="80px">
      <el-form-item label="相册名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input v-model="formData.order"></el-input>
        <el-input-number v-model="formData.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<style scoped></style>
