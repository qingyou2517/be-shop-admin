<script setup></script>

<template>
  <router-view></router-view>
</template>

<style>
.btn {
  @apply bg-purple-500 text-indigo-50 px-4 py-2 rounded-full hover:( bg-purple-700) transition-all duration-500 focus:(ring-2 ring-purple-900);
}

#nprogress .bar {
  background: #f4f4f4 !important;
  height: 3px !important;
}
</style>
