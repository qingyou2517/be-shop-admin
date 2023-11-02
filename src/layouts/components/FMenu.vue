<script setup>
import { ref, reactive, computed } from "vue";
import router from "~/router";
import store from "~/store";
import { useRoute } from "vue-router";

const route = useRoute();
// 当前路由url
const defaultActive = ref(route.path);

const asideMenus = computed(() => store.state.menus);

// 是否折叠
const isFold = computed(() => {
  return store.state.asideWidth === "64px";
});

const handleSelect = (index) => {
  router.push(index);
};
</script>

<template>
  <div
    class="f-menu shadow-md fixed top-16 bottom-0 left-0 bg-light-50 overflow-y-auto overflow-x-hidden transition-all duration-200"
    :style="{ width: $store.state.asideWidth }"
  >
    <el-menu
      class="el-menu-vertical-demo border-0"
      @select="handleSelect"
      :collapse="isFold"
      :collapse-transition="false"
      :unique-opened="true"
      :default-active="defaultActive"
    >
      <template v-for="(item, index) in asideMenus" :key="index">
        <!-- 一级菜单 -->
        <el-sub-menu
          :index="item.name"
          v-if="item.child && item.child.length > 0"
        >
          <!-- icon 图标 -->
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(item2, index2) in item.child"
            :key="index2"
            :index="item2.frontpath"
          >
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 注意是二级菜单 -->

        <el-menu-item :index="item.frontpath" v-else>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.f-menu::-webkit-scrollbar {
  width: 0px;
}
</style>
