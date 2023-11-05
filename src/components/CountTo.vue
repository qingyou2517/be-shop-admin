<script setup>
import { ref, reactive, watch } from "vue";
import gsap from "gsap";

const data = reactive({
  num: 0,
});

const props = defineProps({
  // 该数字滚动到的终点数值
  value: {
    type: Number,
    default: 0,
  },
});

const AnimateToValue = () => {
  // 通过0.5秒的动画，慢慢滚动到终点数值
  gsap.to(data, {
    duration: 0.5,
    num: props.value,
  });
};
AnimateToValue();

// 防止 setup 完毕才执行 AnimateToValue 函数
watch(
  () => props.value,
  () => AnimateToValue()
);
</script>

<template>
  <div>{{ data.num.toFixed(0) }}</div>
</template>

<style scoped></style>
