<script setup lang="ts">
import { ref, reactive } from "vue";
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";
import FTagList from "./components/FTagList.vue";
</script>

<template>
  <el-container>
    <el-header>
      <FHeader></FHeader>
    </el-header>
    <el-container>
      <el-aside>
        <FMenu></FMenu>
      </el-aside>
      <el-main>
        <el-header>
          <FTagList></FTagList>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped></style>
