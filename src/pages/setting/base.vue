<script setup>
import { ref, reactive } from "vue";
import { getSysconfigList, setSysconfig } from "~/api/sysconfig";
import { toast } from "~/composables/util";

// 展示
const form = reactive({
  open_reg: 1, // 开启注册，0关闭1开启
  reg_method: "username", // 注册方式，username普通phone手机
  password_min: 7, // 密码最小长度
  password_encrypt: ["0", "1", "2"], // 密码复杂度，"0" 数字、"1" 小写字母、"2" 大写字母、"3" 符号；后端要求如 "0,1,2" 格式
  upload_method: "oss", // 上传方式，local本地，oss对象存储
  upload_config: {
    Bucket: "",
    ACCESS_KEY: "",
    SECRET_KEY: "",
    http: "",
  }, // 上传配置：对象类型
  api_safe: 1, // api安全，0关闭1开启
  api_secret: "", // 秘钥
  close_order_minute: null, // 未支付订单自动关闭时间：分钟，0不自动关闭
  auto_received_day: null, // 已发货订单自动确认时间：天，0不自动收货
  after_sale_day: null, // 已完成订单允许申请售后：天
  alipay: null, // 支付宝支付配置：对象类型
  wxpay: null, // 微信支付配置
});
const activeName = ref("first");

// 获取数据
const loading = ref(false);
const getData = async () => {
  loading.value = true;
  try {
    let res = await getSysconfigList();
    for (const key in form) {
      form[key] = res[key];
      form.password_encrypt = res.password_encrypt.split(",");
    }
  } catch (err) {
    console.error("获取系统设置失败：", err);
  } finally {
    loading.value = false;
  }
};
getData();

// 保存设置
const handleSave = async () => {
  loading.value = true;
  try {
    await setSysconfig({
      ...form,
      password_encrypt: form.password_encrypt.join(","),
    });
  } catch (err) {
    console.error("保存基本设置失败：", err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-loading="loading" class="bg-light-50 rounded p-4">
    <el-form :model="form" label-width="150px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="注册与访问" name="first">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.open_reg">
              <el-radio :label="0" border>关闭</el-radio>
              <el-radio :label="1" border>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_method">
              <el-radio label="username" border>普通注册</el-radio>
              <el-radio label="phone" border>手机注册</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度">
            <el-input
              v-model="form.password_min"
              placeholder="输入数字"
              style="width: 360px"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="强制密码复杂度">
            <el-checkbox-group v-model="form.password_encrypt">
              <el-checkbox label="0" border>数字</el-checkbox>
              <el-checkbox label="1" border>小写字母</el-checkbox>
              <el-checkbox label="2" border>大写字母</el-checkbox>
              <el-checkbox label="3" border>符号</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="上传设置" name="second">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio label="oss" border>对象存储</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input
              v-model="form.upload_config.Bucket"
              clearable
              placeholder="Bucket"
              style="width: 360px"
            ></el-input>
          </el-form-item>
          <el-form-item label="ACCESS_KEY">
            <el-input
              v-model="form.upload_config.ACCESS_KEY"
              placeholder="ACCESS_KEY"
              type="password"
              style="width: 360px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="SECRET_KEY">
            <el-input
              v-model="form.upload_config.SECRET_KEY"
              placeholder="SECRET_KEY"
              type="password"
              style="width: 360px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="空间域名">
            <el-input
              v-model="form.upload_config.http"
              placeholder="空间域名"
              style="width: 360px"
              clearable
            ></el-input>
            <small class="ml-1 text-gray-400">请补全 http:// 或 https://</small>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="Api安全" name="third">
          <el-form-item label="是否开启API安全">
            <el-radio-group v-model="form.api_safe">
              <el-radio :label="0" border>关闭</el-radio>
              <el-radio :label="1" border>开启</el-radio>
            </el-radio-group>
            <small class="ml-1 text-gray-400"
              >api 安全功能开启之后，调用前端 api 需要传输签名串</small
            >
          </el-form-item>
          <el-form-item label="秘钥">
            <el-input
              v-model="form.api_secret"
              placeholder="请输入秘钥"
              clearable
              style="width: 360px"
            ></el-input>
            <small class="ml-1 text-gray-400"
              >秘钥设置关系系统中 api 调用传输签名串的编码规则，以及会员 token
              解析。请慎重设置，注意设置之后对应会员要求重新登录获取
              token</small
            >
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item
        ><el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
