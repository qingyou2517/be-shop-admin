<script setup>
import { ref, reactive } from "vue";
</script>

<template>
  <el-aside width="220px" class="border-right relative">
    <div class="absolute top-0 right-0 left-0 bottom-[50px] overflow-y-auto">
      <div v-for="i in 100" :key="i">
        {{ i }}
      </div>
    </div>
    <div
      class="flex justify-center items-center absolute left-0 right-0 bottom-0 h-[50px]"
    >
      分页区域
    </div>
  </el-aside>
</template>

<style scoped></style>
