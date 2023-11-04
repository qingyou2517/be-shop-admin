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

        <router-view v-slot="{ Component }">
          <Transition name="fade">
            <KeepAlive :max="10">
              <component :is="Component"></component>
            </KeepAlive>
          </Transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
/* 进入之前 */
.fade-enter-from {
  @apply opacity-0;
}

/* 进入之后 */
.fade-enter-to {
  @apply opacity-100;
}

/* 离开之前 */
.fade-leave-from {
  @apply opacity-100;
}

/* 离开之后 */
.fade-leave-to {
  @apply opacity-0;
}

/* 动画时长 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

/* 延迟进入动画 */
.fade-enter-active {
  transition-delay: 0.3s;
}
</style>
