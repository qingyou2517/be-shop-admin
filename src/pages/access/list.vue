<script setup>
import { ref, reactive } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import IconSelect from "~/components/IconSelect.vue";
import { getRulesList, updateRule, addRule } from "~/api/rule.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";

// 树形列表
const defaultExpandedKeys = ref([]); // 默认展开的节点，由 node-key 组成的一维数组

// 级联选择器：从后台get的数据有个"rules"字段，可以作为级联选择器的数据源
const cascaderOptions = ref([]);

// 列表展示、修改状态、删除列表项
const option = {
  getList: getRulesList,
  getListSuccess: (res) => {
    cascaderOptions.value = res.rules; // 级联选择器数据源
    tableList.value = res.list;
    defaultExpandedKeys.value = res.list.map((item) => item.id);
  },
};
const { tableList, loading, getData, handleStatusChange, handleDelete } =
  useInitTable(option);

// 表单抽屉
const formOption = {
  // 注意要写成defaultForm，因为新增时传入resetForm的参数是option.defaultForm
  defaultForm: {
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: "",
  },
  rules: {
    rule_id: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur", // 触发校验的时机是：失去焦点时
      },
    ],
  },
  update: updateRule,
  add: addRule,
};
const {
  formDrawerRef,
  drawerTitle,
  formRef,
  form,
  rules,
  handleSubmit,
  handleAdd,
  handleEdit,
} = useInitForm(formOption);
</script>

<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleAdd" @refresh="getData"></ListHeader>
    <el-tree
      :data="tableList"
      :props="{ label: 'name', children: 'child' }"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      v-loading="loading"
    >
      <template #default="{ node, data }">
        <div class="w-full flex items-center text-[14px] pr-2">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{
            data.menu ? "菜单" : "权限"
          }}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>

          <div class="ml-auto items-center">
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
            />
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleEdit(data)"
              >修改</el-button
            >
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleAdd()"
              >增加</el-button
            >
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleDelete"
              >删除</el-button
            >
          </div>
        </div>
      </template>
    </el-tree>

    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader
            v-model="form.rule_id"
            placeholder="请选择上级菜单"
            :options="cascaderOptions"
            :props="{
              label: 'name',
              children: 'child',
              value: 'id',
              checkStrictly: true,
              emitPath: false,
            }"
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu" class="flex items-center">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" size="default" border>菜单</el-radio>
            <el-radio :label="0" size="default" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            class="w-[30%]"
          ></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu === 0">
          <el-input
            v-model="form.condition"
            placeholder="请输入后端规则"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="请求方式"
          prop="method"
          v-if="form.menu === 0"
          class="flex items-center"
        >
          <el-select
            v-model="form.method"
            class="m-2"
            placeholder="请选择请求方式"
          >
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-if="form.menu === 1"
          class="flex items-center"
        >
          <el-icon v-if="form.icon" class="mr-2">
            <component :is="form.icon"></component>
          </el-icon>
          <IconSelect v-model="form.icon"></IconSelect>
        </el-form-item>
        <el-form-item
          label="前端路由"
          prop="frontpath"
          v-if="form.menu === 1 && form.rule_id > 0"
        >
          <el-input
            v-model="form.frontpath"
            placeholder="请输入前端路由"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" :min="0" :max="1000" @change="">
          </el-input-number>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<style>
.el-tree-node__content {
  padding: 20px 0;
}
</style>
