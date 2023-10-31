<script setup>
import { ref, reactive } from "vue";
</script>

<template>
  这是index
  <div>{{ $store.state.user.username }}</div>
</template>

<style scoped></style>
