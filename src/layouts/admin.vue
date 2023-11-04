<script setup>
import { ref, reactive } from "vue";
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";
import FTagList from "~/layouts/components/FTagList.vue";
</script>

<template>
  <el-container>
    <el-header>
      <FHeader></FHeader>
    </el-header>
    <el-container>
      <el-aside
        :style="{ width: $store.state.asideWidth }"
        class="transition-all duration-200"
      >
        <FMenu></FMenu>
      </el-aside>
      <el-main>
        <FTagList></FTagList>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped></style>
