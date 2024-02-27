import { ref, reactive, computed } from "vue";
import { toast } from "~/composables/util.js";

// 搜索、列表展示、分页交互、修改状态、删除表格项、批量删除
export function useInitTable(option = {}) {
  const tableList = ref([]);
  const loading = ref(false);

  // 搜索
  let searchForm = null;
  let resetSearchForm = null;
  if (option.searchForm) {
    searchForm = reactive({ ...option.searchForm }); // 搜索表单
    // 重置搜索表单
    resetSearchForm = () => {
      for (const key in option.searchForm) {
        searchForm[key] = option.searchForm[key];
      }
      getData();
    };
  }

  // 分页
  const currentPage = ref(1);
  const total = ref(0);
  const limit = ref(10);

  // 获取数据
  async function getData(p = null) {
    // 假如切换分页，getData 会拿到 current-change 事件传递过来的页码(即 p )
    if (typeof p === "number") {
      currentPage.value = p;
    }

    loading.value = true;
    try {
      let res = await option.getList(currentPage.value, searchForm);
      if (
        option.getListSuccess &&
        typeof option.getListSuccess === "function"
      ) {
        option.getListSuccess(res);
      } else {
        tableList.value = res.list;
        total.value = res.totalCount;
      }
    } finally {
      loading.value = false;
    }
  }
  // 别忘了执行
  getData();

  // 修改状态
  const handleStatusChange = async (status, row) => {
    row.switchLoading = true;
    try {
      await option.updateStatus(row.id, status);
      toast("修改状态成功");
      row.status = status;
    } catch (err) {
      console.error("修改状态失败：", err);
    } finally {
      row.switchLoading = false;
    }
  };

  // 删除表格项
  const handleDelete = async (id) => {
    loading.value = true;
    try {
      await option.delete(id);
      toast("删除成功");
      getData(currentPage.value);
    } catch (err) {
      console.log("删除失败：", err);
    } finally {
      loading.value = false;
    }
  };

  // 多选
  const ids = ref([]);
  const handleSelectionChange = (e) => {
    ids.value = e.map((item) => item.id);
  };

  // 批量删除
  const multipleTableRef = ref(null);
  const handleMultiDelete = async () => {
    if (ids.value.length <= 0) {
      toast("需要先勾选操作对象", "error");
      return;
    }
    loading.value = true;
    try {
      await option.delete(ids.value);
      toast("删除成功");
      // 清空多选框的选中标记
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection();
      }
      getData(1);
    } finally {
      loading.value = false;
    }
  };

  // 批量恢复回收站商品
  const handleReStoreGoods = async () => {
    if (ids.value.length <= 0) {
      toast("需要先勾选操作对象", "error");
      return;
    }
    loading.value = true;
    try {
      await option.restoreGoods(ids.value);
      toast("成功恢复商品");
      // 清空多选框的选中标记
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection();
      }
      getData(1);
    } finally {
      loading.value = false;
    }
  };

  // 彻底删除回收站商品
  const handleDestroyGoods = async () => {
    if (ids.value.length <= 0) {
      toast("需要先勾选操作对象", "error");
      return;
    }
    loading.value = true;
    try {
      await option.destroyGoods(ids.value);
      toast("彻底删除成功");
      // 清空多选框的选中标记
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection();
      }
      getData(1);
    } finally {
      loading.value = false;
    }
  };

  // 批量修改状态：即批量上架、下架
  const handleMultiStatusChange = async (status) => {
    if (ids.value.length <= 0) {
      toast("需要选择至少一件商品", "error");
      return;
    }
    loading.value = true;
    try {
      await option.updateStatus(ids.value, status);
      toast("修改状态成功");
      // 清空多选框的选中标记
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection();
      }
      getData();
    } catch (err) {
      console.error("修改状态失败：", err);
    } finally {
      loading.value = false;
    }
  };

  // 批量删除按钮是否可点击
  const hasSelect = computed(() => {
    return ids.value.length > 0;
  });

  return {
    tableList,
    loading,
    searchForm,
    resetSearchForm,
    currentPage,
    total,
    limit,
    getData,
    handleStatusChange,
    handleDelete,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    handleReStoreGoods,
    handleDestroyGoods,
    handleMultiStatusChange,
    hasSelect,
    ids,
  };
}

// 新增、修改
export function useInitForm(option = {}) {
  // 抽屉组件
  const formDrawerRef = ref(null);
  const drawerTitle = ref("");

  // 表单数据
  const updateId = ref(0);
  const formRef = ref(null);
  const form = reactive({});
  const rules = option.rules || {};

  // 表单提交
  const handleSubmit = () => {
    formRef.value.validate(async (valid) => {
      if (!valid) return;

      formDrawerRef.value.showLoading();

      // 访问后台接口前的数据处理(如优惠券的起止时间：前台展示&后台返回均为字符串格式，但后台上传要求是时间戳格式)
      let data = {};
      if (option.beforeSubmit && typeof option.beforeSubmit === "function") {
        // 对form对象深拷贝，因为beforeSubmit要修改表单数据
        data = option.beforeSubmit({ ...form });
      } else {
        data = form;
      }
      // 访问后台接口
      try {
        if (updateId.value !== 0) {
          await option.update(updateId.value, data);
          toast("修改成功");
          option.currentPage
            ? option.getData(option.currentPage.value)
            : option.getData();
        } else {
          await option.add(data);
          toast("新增成功");
          option.currentPage ? option.getData(1) : option.getData();
        }

        formDrawerRef.value.close();
      } catch (err) {
        updateId.value !== 0
          ? console.log("修改失败：", err)
          : console.log("新增失败：", err);
      } finally {
        formDrawerRef.value.hideLoading();
      }
    });
  };

  // 把指定的 data 对象填充到表单 => 实现重置表单/读取data信息
  const resetForm = (data) => {
    if (formRef.value) formRef.value.clearValidate(); // 去除表单的校验报错信息
    for (const key in data) {
      // 过滤对象属性：只填充 defaultForm 含有的属性
      if (option.defaultForm.hasOwnProperty(key)) {
        form[key] = data[key];
      }
    }
  };

  // 新增
  const handleAdd = () => {
    updateId.value = 0;
    resetForm(option.defaultForm);
    drawerTitle.value = "新增";
    formDrawerRef.value.open();
  };

  // 编辑修改
  const handleEdit = (item) => {
    updateId.value = item.id;
    resetForm(item);
    drawerTitle.value = "修改";
    formDrawerRef.value.open();
  };
  return {
    formDrawerRef,
    drawerTitle,
    updateId,
    formRef,
    form,
    rules,
    handleSubmit,
    handleAdd,
    handleEdit,
  };
}
