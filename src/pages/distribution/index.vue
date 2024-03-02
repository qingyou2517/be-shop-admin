<template>
  <div>
    <Panel></Panel>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getAgentList,
  getUserBillList,
  updateDistributionSetting,
  getDistributionSetting,
} from "~/api/distribution";
import Panel from "./components/Panel.vue";
</script>

<style scoped></style>
