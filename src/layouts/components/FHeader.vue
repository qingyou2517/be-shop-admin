<script setup>
import { useFullscreen } from "@vueuse/core";
import { useRePassword, useLogout } from "~/composables/useManager";
import FormDrawer from "~/components/FormDrawer.vue";

const { isFullscreen, toggle } = useFullscreen();
const { formDrawerRef, form, rules, formRef, openRePasswordDrawer, onSubmit } =
  useRePassword();
const { onLogout } = useLogout();

const handleCommand = (command) => {
  switch (command) {
    case "onLogout":
      onLogout();
      break;
    case "rePassword":
      openRePasswordDrawer();
      break;
    default:
      break;
  }
};

const onRefresh = () => location.reload();
const toggleScreen = () => toggle();
</script>

<template>
  <div
    class="flex items-center justify-start bg-indigo-700 text-light-50 h-16 fixed top-0 left-0 right-0"
  >
    <span class="w-[250px] flex items-center justify-center text-xl font-thin">
      <el-icon class="mr-1"><Shop /></el-icon>
      shop-admin
    </span>

    <el-icon class="icon-btn" @click="$store.commit('SET_ASIDE_WIDTH')">
      <Fold v-if="$store.state.asideWidth === '250px'" />
      <Expand v-else />
    </el-icon>

    <el-tooltip
      class="box-item"
      effect="dark"
      content="刷新"
      placement="bottom"
    >
      <el-icon class="icon-btn" @click="onRefresh"><Refresh /></el-icon>
    </el-tooltip>

    <div class="ml-auto flex items-center">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="全屏"
        placement="bottom"
      >
        <el-icon class="icon-btn" @click="toggleScreen"
          ><FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-tooltip>

      <el-dropdown
        class="h-16 cursor-pointer flex items-center justify-center mx-5"
        @command="handleCommand"
      >
        <span class="flex items-center text-light-50">
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="onLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <FormDrawer
    ref="formDrawerRef"
    title="修改密码"
    destroy-on-close
    @submit="onSubmit"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input
          type="password"
          show-password
          v-model="form.password"
          placeholder="请输入新密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input
          type="password"
          show-password
          v-model="form.repassword"
          placeholder="请再输入一次新密码"
        ></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<style scoped>
.icon-btn {
  @apply flex items-center justify-center w-[42px] h-16 cursor-pointer;
}
.icon-btn:hover {
  @apply bg-indigo-600;
}
:deep(.el-tooltip__trigger:focus-visible) {
  outline: none;
}
</style>
