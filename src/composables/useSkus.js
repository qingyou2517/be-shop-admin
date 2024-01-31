import { nextTick, ref, computed } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard,
} from "../api/goods";
import { useArrayMoveUp, useArrayMoveDown, perMutateAndCombine } from "./util";

// 当前商品的 id
export const goodsId = ref(0);

// 规格选项列表
export const skus_card_list = ref([]);

// 规格数据
export const skus_list = ref([]); // 添加了自定义字段，用于配合el-table渲染
export let skus_formData = ref([]); // 字段完全符合后端要求，用于提交给后端、更新规格

// 初始化规格选项列表
export function initSkusCardList(data) {
  skus_card_list.value = data.goodsSkusCard.map((item) => {
    item.text = item.name;
    item.loading = false;
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || "属性值";
      return v;
    });
    return item;
  });
  skus_list.value = data.goodsSkus;
}

// 添加规格选项
export const btnLoading = ref(false);
export async function addSkusCard() {
  btnLoading.value = true;
  try {
    const obj = {
      goods_id: goodsId.value,
      name: "规格名称",
      order: 50,
      type: 0,
    };
    const res = await createGoodsSkusCard(obj);

    skus_card_list.value.push({
      ...res,
      text: res.name,
      loading: false,
      goodsSkusCardValue: [],
    });
    getTableData();
  } catch (err) {
    console.error("新增规格选项失败：", err);
  } finally {
    btnLoading.value = false;
  }
}

// 修改规格选项
export async function updateSkusCard(item) {
  item.loading = true;
  try {
    const obj = {
      goods_id: goodsId.value,
      name: item.text,
      order: item.order,
      type: item.type,
    };
    await updateGoodsSkusCard(item.id, obj);
    getTableData();
  } catch (err) {
    item.text = item.name;
    console.error("修改规格选项失败：", err);
  } finally {
    item.loading = false;
  }
}

// 删除规格选项
export async function deleteSkusCard(item) {
  item.loading = false;
  try {
    await deleteGoodsSkusCard(item.id);
    const index = skus_card_list.value.findIndex((o) => o.id === item.id);
    if (index !== -1) {
      skus_card_list.value.splice(index, 1);
    }
    getTableData();
  } catch (err) {
    console.error("删除规格选项失败：", err);
  } finally {
  }
}

// 规格选项上下移动排序
export const bodyLoading = ref(false);
export async function sortSkusCard(direction, index) {
  bodyLoading.value = true;
  const func = direction === "up" ? useArrayMoveUp : useArrayMoveDown;
  const list = JSON.parse(JSON.stringify(skus_card_list.value)); // 深拷贝，用作接口参数
  func(list, index);
  const sortData = list.map((item, i) => {
    return {
      id: item.id,
      order: i + 1,
    };
  });
  try {
    await sortGoodsSkusCard({ sortdata: sortData });
    func(skus_card_list.value, index);
    getTableData();
  } catch (err) {
    console.error("排序商品规格，同步到后端失败: ", err);
  } finally {
    bodyLoading.value = false;
  }
}

// 选择后，设置规格选项和值
export async function chooseSetGoodsSkusCard(id, data) {
  let item = skus_card_list.value.find((obj) => obj.id === id);
  item.loading = true;
  try {
    const res = await chooseAndSetGoodsSkusCard(id, data);
    item.name = res.goods_skus_card.name;
    item.text = res.goods_skus_card.name;
    item.goodsSkusCardValue = res.goods_skus_card_value.map((obj) => {
      obj.text = obj.value || "属性值";
      return obj;
    });
    getTableData();
  } catch (err) {
    console.error("设置规格选项和值失败：", err);
  } finally {
    item.loading = false;
  }
}

// 初始化规格值列表
export function initSkusCardItem(skusCardId) {
  // 获取对应规格选项下的规格值列表
  const item = skus_card_list.value.find((obj) => obj.id === skusCardId);

  // 来自 element-plus 的可编辑 tag 组件配置
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref();
  const loading = ref(false);
  // 配置: 用于删除选项值
  const handleClose = async (tag) => {
    loading.value = true;
    try {
      await deleteGoodsSkusCardValue(tag.id);
      const index = item.goodsSkusCardValue.findIndex(
        (obj) => obj.id === tag.id
      );
      if (index !== -1) {
        item.goodsSkusCardValue.splice(index, 1);
      }
      getTableData();
    } catch (err) {
      console.error("删除规格选项值失败: ", err);
    } finally {
      loading.value = false;
    }
  };
  // 配置: 展示输入框，用于新增选项值
  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };
  // 配置: 新增选项值
  const handleInputConfirm = async () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    loading.value = true;
    try {
      const res = await createGoodsSkusCardValue({
        goods_skus_card_id: skusCardId,
        name: item.name,
        order: 50,
        value: inputValue.value,
      });
      item.goodsSkusCardValue.push({
        ...res,
        text: res.value,
      });
      getTableData();
    } catch (err) {
      console.error("新增规格选项值失败: ", err);
    } finally {
      inputVisible.value = false;
      inputValue.value = "";
      loading.value = false;
    }
  };

  // 修改选项值
  const handleChange = async (value, tag) => {
    loading.value = true;
    try {
      await updateGoodsSkusCardValue(skusCardId, {
        goods_skus_card_id: tag.id,
        name: item.name, // 规格选项名
        order: tag.order,
        value, // 规格选项值
      });
      tag.value = value;
      getTableData();
    } catch (err) {
      tag.text = tag.value;
      console.error("修改选项值失败：", err);
    } finally {
      loading.value = true;
    }
  };

  return {
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    item,
    handleChange,
  };
}

// 初始化 "规格设置" 对应的表格
export function initSkusTable() {
  // 只展示有规格值的规格选项
  const skus_labels = computed(() => {
    return skus_card_list.value.filter(
      (item) => item.goodsSkusCardValue.length > 0
    );
  });

  skus_formData.value = JSON.parse(JSON.stringify(skus_list.value));

  skus_list.value = skus_list.value.map((skuObj, index) => {
    let skus = skuObj.skus;
    if (Object.prototype.toString(skus) === "[object Object]") {
      for (let key in skus) {
        // skus_list 每一项添加自定义字段
        skuObj[`sku_value_${key}`] = skus[key].value;
        // skus_formData 每一项删除那些自定义字段
        if (skus_formData.value[index][`sku_value_${key}`]) {
          delete skus_formData.value[index][`sku_value_${key}`];
        }
      }
    } else if (Array.isArray(skus)) {
      skus.forEach((item, i) => {
        // skus_list 每一项添加自定义字段
        skuObj[`sku_value_${i}`] = item.value;
        // skus_formData 每一项删除那些自定义字段
        if (skus_formData.value[index][`sku_value_${i}`]) {
          delete skus_formData.value[index][`sku_value_${i}`];
        }
      });
    }
    return skuObj;
  });

  return {
    skus_labels,
    skus_list,
    skus_formData,
  };
}

export function getTableData() {
  setTimeout(() => {
    // 若没有设置规格选项
    if (skus_card_list.value.length === 0) return [];
    let list = [];
    skus_card_list.value.forEach((obj) => {
      if (obj.goodsSkusCardValue && obj.goodsSkusCardValue.length > 0) {
        list.push(obj.goodsSkusCardValue); // 得到二维数组
      }
    });
    // 若设置了规格选项，但是没有设置值
    if (list.length === 0) return [];

    let tableData = perMutateAndCombine(...list); // 二维数组

    skus_list.value = [];
    skus_list.value = tableData.map((arr) => {
      return {
        image: "",
        pprice: "0.00",
        oprice: "0.00",
        cprice: "0.00",
        stock: 0,
        volume: 0,
        weight: 0,
        code: "",
        goods_id: 28,
        skus: arr,
      };
    });
    initSkusTable();
  }, 200);
}
