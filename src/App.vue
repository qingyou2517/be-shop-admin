<script setup></script>

<template>
  <router-view></router-view>
</template>

<style>
body {
  @apply bg-gray-100;
}
.btn {
  @apply bg-purple-500 text-indigo-50 px-4 py-2 rounded-full hover:( bg-purple-700) transition-all duration-500 focus:(ring-2 ring-purple-900);
}

#nprogress .bar {
  background: #f4f4f4 !important;
  height: 3px !important;
}

/* 全局滚动条宽高 */
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}
/* 滚动条边角部分：两个滚动条的交汇处 */
::-webkit-scrollbar-corner {
  display: block;
}
/* 滚动条小方块部分 */
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}
/* 滚动条轨道 */
::-webkit-scrollbar-thumb， ::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  /* 比滚动条背景色浅一些 */
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
