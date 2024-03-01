<template>
  <div class="bg-light-50 rounded p-4">
    <el-tabs v-model="activeName">
      <el-tab-pane label="支付设置" name="first">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column label="支付方式">
            <template #default="{ row }">
              <div class="flex items-center">
                <el-image
                  :src="row.src"
                  fit="cover"
                  :lazy="true"
                  class="h-[40px] w-[40px] rounded"
                ></el-image>
                <div class="ml-2">
                  <p>{{ row.name }}</p>
                  <small>{{ row.desc }}</small>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="{ row }">
              <el-button type="primary" text @click="handleOpenDrawer(row)"
                >配置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="购物设置" name="second">
        <el-form :model="form" label-width="150px">
          <el-form-item label="未支付订单">
            <div class="flex flex-col">
              <el-input
                v-model="form.close_order_minute"
                type="number"
                style="width: 350px"
              >
                <template #append>
                  <span>分钟后自动关闭</span>
                </template>
              </el-input>
              <small class="text-gray-600 mt-1"
                >订单下单未付款，n 分钟后自动关闭；若设置 0，则不自动关闭</small
              >
            </div>
          </el-form-item>
          <el-form-item label="已发货订单">
            <div class="flex flex-col">
              <el-input
                v-model="form.auto_received_day"
                type="number"
                style="width: 350px"
              >
                <template #append>
                  <span>天后自动确认收货</span>
                </template>
              </el-input>
              <small class="text-gray-600 mt-1"
                >如果在期间未确认收货，系统自动完成收货，设置 0
                不自动收货</small
              >
            </div>
          </el-form-item>
          <el-form-item label="已完成订单">
            <div class="flex flex-col">
              <el-input
                v-model="form.after_sale_day"
                type="number"
                style="width: 350px"
              >
                <template #append>
                  <span>天后自动确认收货</span>
                </template>
              </el-input>
              <small class="text-gray-600 mt-1"
                >如果在期间未确认收货，系统自动完成收货，设置 0
                不自动收货</small
              >
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <FormDrawer ref="formDrawerRef" title="支付配置" @submit="handleSubmit">
      <el-form :model="form" label-width="120px" v-if="drawerType === 'alipay'">
        <el-form-item label="app_id">
          <el-input v-model="form.alipay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="ali_public_key">
          <el-input
            v-model="form.alipay.ali_public_key"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="private_key">
          <el-input
            v-model="form.alipay.private_key"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width="120px" v-else>
        <el-form-item label="公众号 APPID">
          <el-input v-model="form.wxpay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序 APPID">
          <el-input v-model="form.wxpay.miniapp_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序 secret">
          <el-input v-model="form.wxpay.secret"></el-input>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="form.wxpay.appid"></el-input>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="form.wxpay.mch_id"></el-input>
        </el-form-item>
        <el-form-item label="API 密钥">
          <el-input v-model="form.wxpay.key"></el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload
            class="upload-demo"
            :action="uploadAction"
            :limit="1"
            :header="{ token }"
            accept=".pem"
            :on-success="uploadClientSuccess"
          >
            <el-button type="primary">点击上传证书</el-button>
            <template #tip>
              <p class="text-rose-500">
                {{
                  form.wxpay.cert_client ? form.wxpay.cert_client : "尚未配置"
                }}
              </p>
              <div class="el-upload__tip">例如：apiclient_cert.pem</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_key">
          <el-upload
            class="upload-demo"
            :action="uploadAction"
            :limit="1"
            :header="{ token }"
            accept=".pem"
            :on-success="uploadKeySuccess"
          >
            <el-button type="primary">点击上传证书</el-button>
            <template #tip>
              <p class="text-rose-500">
                {{ form.wxpay.cert_key ? form.wxpay.cert_key : "尚未配置" }}
              </p>
              <div class="el-upload__tip">例如：apiclient_key.pem</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getSysconfigList, setSysconfig, uploadAction } from "~/api/sysconfig";
import { toast } from "~/composables/util";
import { getToken } from "~/composables/auth";
import FormDrawer from "~/components/FormDrawer.vue";

const token = getToken();

// tabs 切换
const activeName = ref("first");

// 购物设置、抽屉组件依赖的数据
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
  alipay: {
    app_id: "",
    ali_public_key: "",
    private_key: "",
  }, // 支付宝支付配置：对象类型
  wxpay: {
    app_id: "",
    miniapp_id: "",
    secret: "",
    appid: "",
    mch_id: "",
    key: "",
    cert_client: "xxx.pem",
    cert_key: "yyy.pem",
  }, // 微信支付配置
});

// 支付设置
const tableData = ref([
  {
    name: "支付宝支付",
    desc: "该系统支持即时到账接口",
    src: "/alipay.png",
    key: "alipay",
  },
  {
    name: "微信支付",
    desc: "该系统支持微信网页支付和扫码支付",
    src: "/wxpay.png",
    key: "wxpay",
  },
]);

const getData = async () => {
  try {
    let res = await getSysconfigList();
    for (const key in form) {
      form[key] = res[key];
    }
  } catch (err) {
    console.error(err);
  }
};
getData();

// 抽屉组件
const formDrawerRef = ref(null);
const drawerType = ref("");
const handleOpenDrawer = (row) => {
  formDrawerRef.value.open();
  drawerType.value = row.key;
};
const loading = ref(false);
const handleSubmit = async () => {
  loading.value = true;
  try {
    await setSysconfig({
      ...form,
    });
    toast("修改配置成功");
    getData();
  } catch (err) {
    console.error("修改配置失败：", err);
  } finally {
    loading.value = false;
  }
};

// 上传证书文件
const uploadClientSuccess = (response, uploadFile, uploadFiles) => {
  form.wxpay.cert_client = response.data;
};
const uploadKeySuccess = (response, uploadFile, uploadFiles) => {
  form.wxpay.cert_key = response.data;
};

// 保存购物设置
const handleSave = () => {
  handleSubmit();
};
</script>

<style scoped></style>
