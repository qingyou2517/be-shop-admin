<script setup>
import { ref, reactive } from "vue";
</script>

<template>
  <div>这是index页面, 当前用户: {{ $store.state.user.username }}</div>
</template>

<style scoped></style>
