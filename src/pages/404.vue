<script setup>
import { ref, reactive } from "vue";
</script>

<template>
  <el-result icon="warning" title="404 提示" sub-title="你找的页面走丢了~">
    <template #extra>
      <el-button type="primary" @click="this.$router.push('/')"
        >回到首页</el-button
      >
    </template>
  </el-result>
</template>

<style scoped></style>
