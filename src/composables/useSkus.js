import { nextTick, ref } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
} from "../api/goods";
import { useArrayMoveUp, useArrayMoveDown } from "./util";

// 当前商品的 id
export const goodsId = ref(0);

// 规格选项列表
export const skus_card_list = ref([]);

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
  } catch (err) {
    console.error("排序商品规格，同步到后端失败: ", err);
  } finally {
    bodyLoading.value = false;
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
