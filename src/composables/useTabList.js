import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { router } from "~/router";
import { useCookies } from "@vueuse/integrations/useCookies";

export function useTabList() {
  const route = useRoute();
  const cookie = useCookies();

  const activeTab = ref(route.fullPath);
  const tabList = ref([
    {
      title: "主控台", // el-tabs 的tag标签文本
      path: "/", // el-tabs 的tag标签的唯一标识：使用页面url
    },
  ]);

  // 添加tag标签导航
  const addTag = (tab) => {
    let index = tabList.value.findIndex((item) => item.path === tab.path);
    if (index < 0) {
      tabList.value.push(tab);
      cookie.set("tabList", tabList.value);
    }
  };

  onBeforeRouteUpdate((to, from) => {
    addTag({
      title: to.meta.title,
      path: to.path,
    });
    activeTab.value = to.path; // 激活tag的选中样式
  });

  // 切换tab，跳转对应url
  const changeTab = (name) => {
    router.push(name);
  };

  // 关闭tag
  const removeTab = (url) => {
    let tabs = tabList.value;
    let active = activeTab.value;
    // 判断要关闭的是否是已激活的那个tag
    if (url === active) {
      tabs.forEach((tab, index) => {
        // 找到关闭之后将要切换、激活的 tab
        if (tab.path === url) {
          let nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) active = nextTab.path; // 记录它对应的页面url，绑定给v-model
        }
      });
    }
    // activeTab发生改变会自动触发 tab 切换动画，但不会会触发tab-change事件
    // 所以要手动调用下它的事件处理函数 changeTab
    activeTab.value = active;
    changeTab(activeTab.value);
    tabList.value = tabs.filter((tab) => tab.path !== url);
    cookie.set("tabList", tabList.value);
  };

  // 初始化标签导航列表
  const initTabList = () => {
    let tbs = cookie.get("tabList");
    if (tbs) tabList.value = tbs;
  };
  initTabList();

  const handleClose = (command) => {
    console.log(command);
    if (command === "closeAll") {
      // 只剩下首页
      activeTab.value = "/";
      tabList.value = [
        {
          title: "主控台",
          path: "/",
        },
      ];
      changeTab(activeTab.value);
    } else if (command === "closeOther") {
      // 只剩下首页和当前激活的tag
      tabList.value = tabList.value.filter((tab) => {
        return tab.path === activeTab.value || tab.path === "/";
      });
    }
    // 更新cookie
    cookie.set("tabList", tabList.value);
  };

  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose,
  };
}
