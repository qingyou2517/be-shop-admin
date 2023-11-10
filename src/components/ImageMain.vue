<script setup>
import { ref, reactive } from "vue";
import { getImageList, updateImageName, deleteImage } from "~/api/image.js";
import { showPrompt } from "~/composables/util.js";
import { toast } from "../composables/util";
import UploadFile from "~/components/UploadFile.vue";

// 上传图片
const drawer = ref(false);
const openUploadFile = () => (drawer.value = true);

// 分页
const currentPage = ref(1);
const total = ref(0); // 总共页数
const limit = ref(10); // 限制每页显示多少条分类名

// 加载动画
const loading = ref(false);
// 图片列表
const imageList = ref([]);
// 图库分类id
const image_class_id = ref(0);

// 获取某分类、某分页下的图片列表数据
async function getData(p = null) {
  // 假如切换分页，getData 会拿到 current-change 事件传递过来的页码(即 p )
  if (typeof p === "number") {
    currentPage.value = p;
  }

  loading.value = true;
  try {
    let { list, totalCount } = await getImageList(
      image_class_id.value,
      currentPage.value
    );
    imageList.value = list;
    total.value = totalCount;
  } finally {
    loading.value = false;
  }
}

// 根据分类id加载图片列表：先加载左侧相册，再加载右侧图片列表
function loadData(id) {
  currentPage.value = 1;
  image_class_id.value = id;
  getData();
}
defineExpose({
  loadData,
  openUploadFile,
});

// 重命名
async function handleRename(item) {
  let { value } = await showPrompt("重命名", item.name);

  loading.value = true;
  try {
    let res = await updateImageName(item.id, value);
    toast("修改成功");
    getData();
  } finally {
    loading.value = false;
  }
}

// 删除图片
async function handleDelete(item) {
  loading.value = true;
  try {
    await deleteImage([item.id]);
    toast("删除成功");
    getData();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

// 图片上传成功，刷新当前页
const handleUploadSuccess = (response, uploadFile, uploadFiles) => getData(1);
</script>

<template>
  <el-main class="relative" v-loading="loading">
    <div
      class="absolute top-0 right-0 left-0 bottom-[50px] overflow-y-auto p-3"
    >
      <!-- <div v-for="i in 100" :key="i">{{ i }}</div> -->
      <el-row :gutter="10">
        <el-col
          :span="6"
          :offset="0"
          v-for="(item, index) in imageList"
          :key="index"
        >
          <el-card
            shadow="hover"
            class="relative mb-3"
            :body-style="{ padding: 0 }"
          >
            <el-image
              :src="item.url"
              fit="cover"
              class="w-full h-[150px]"
              :preview-src-list="[item.url]"
              :initial-index="0"
            ></el-image>
            <div
              class="absolute top-[122px] left-[-1px] right-[-1px] text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1"
            >
              {{ item.name }}
            </div>
            <div class="flex items-center justify-center p-2">
              <el-button
                type="primary"
                size="small"
                text
                @click="handleRename(item)"
                >重命名</el-button
              >
              <el-popconfirm
                title="是否删除该图片?"
                confirmButtonText="确认"
                cancelButtonText="取消"
                @confirm="handleDelete(item)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div
      class="flex justify-center items-center absolute left-0 right-0 bottom-0 h-[50px]"
    >
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-main>

  <el-drawer v-model="drawer" title="上传图片">
    <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess" />
  </el-drawer>
</template>

<style scoped></style>
