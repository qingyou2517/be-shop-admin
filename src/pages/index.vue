<script setup>
import { ref, reactive } from "vue";
import { toast, showModal } from "~/composables/util";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const onLogout = () => {
  showModal("是否退出登录?", "warning")
    .then((res) => {
      store.dispatch("userLogout").then((res) => {
        toast("已退出登录", "success");
        router.push("/login");
      });
    })
    .catch((err) => {});
};
</script>

<template>
  <div>后台首页</div>
  <div>{{ $store.state.user.username }}</div>
  <el-button type="primary" @click="onLogout">退出登录</el-button>
</template>

<style scoped></style>
