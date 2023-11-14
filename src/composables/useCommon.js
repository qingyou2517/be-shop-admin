import { ref, reactive } from "vue";
import { toast } from "~/composables/util.js";

// 搜索、列表展示、分页交互、修改状态、删除表格项
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
  const handleStatusChange = async (e, row) => {
    row.switchLoading = true;
    try {
      await option.updateStatus(row.id, e);
      toast("修改状态成功");
      row.status = e;
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
    } finally {
      loading.value = false;
    }
  };

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
      try {
        if (updateId.value !== 0) {
          await option.update(updateId.value, form);
          toast("修改成功");
          option.getData(option.currentPage.value);
        } else {
          await option.add(form);
          toast("新增成功");
          option.getData(1);
        }

        formDrawerRef.value.close();
      } finally {
        formDrawerRef.value.hideLoading();
      }
    });
  };

  // 把指定的 data 对象填充到表单 => 实现重置表单/读取data信息
  const resetForm = (data) => {
    if (formRef.value) formRef.value.clearValidate(); // 去除表单的校验报错信息
    for (const key in data) {
      form[key] = data[key];
    }
  };

  // 新增管理员
  const handleAdd = () => {
    updateId.value = 0;
    resetForm(option.defaultForm);
    drawerTitle.value = "新增";
    formDrawerRef.value.open();
  };

  // 修改管理员信息
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