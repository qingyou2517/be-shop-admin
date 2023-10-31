import { createApp } from "vue";
// import './style.css'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./permission";

const app = createApp(App);
app.use(store);
app.use(ElementPlus);
app.use(router);

import "virtual:windi.css";
import "nprogress/nprogress.css";

app.mount("#app");
