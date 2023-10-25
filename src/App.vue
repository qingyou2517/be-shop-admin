<script setup></script>

<template>
  <button class="btn">按钮</button>
</template>

<style scoped>
.btn {
  @apply bg-purple-500 text-indigo-50 px-4 py-2 rounded-full hover:( bg-purple-700) transition-all duration-500 focus:(ring-2 ring-purple-900);
}
</style>
