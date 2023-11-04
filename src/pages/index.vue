<script setup>
import { ref, reactive } from "vue";
</script>

<template>
  这是index页面
  <div>当前用户: {{ $store.state.user.username }}</div>
</template>

<style scoped></style>
