import { defineClientConfig } from "@vuepress/client";
import { defineAsyncComponent, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import "vuepress-theme-hope/presets/bounce-icon.scss";
import MyIcon from "./Components/MyIcon.vue";
import BlogBg from "./Components/BlogBg.vue"; // 为页面图标添加鼠标悬停的跳动效果。

const NavMusic = defineAsyncComponent(() => import("./Components/NavMusic.vue"));
// const HeroBG = defineAsyncComponent(() => import('./Components/HeroBG.vue'));
const HeroHitokoto = defineAsyncComponent(() => import("./Components/HeroHitokoto.vue"));

// 声明 window._hmt 以避免 TypeScript 报错
declare global {
  interface Window {
    _hmt?: any[];
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default defineClientConfig({
  setup() {
    const route = useRoute();

    onMounted(() => {
      if (typeof window !== "undefined") {
        // 百度统计
        const baiduTongjiId = "ba12f6d18a40583b3df45d23c95c7bcb";
        if (!window._hmt) {
          window._hmt = [];
          const hm = document.createElement("script");
          hm.src = `https://hm.baidu.com/hm.js?${baiduTongjiId}`;
          hm.async = true;
          document.head.appendChild(hm);
        }

        // 谷歌分析
        const googleTagId = "G-W45VECSKCH";
        if (!window.dataLayer) {
          window.dataLayer = [];
        }
        if (!window.gtag) {
          window.gtag = function () {
            window.dataLayer!.push(arguments);
          };
        }
        window.gtag("js", new Date());
        window.gtag("config", googleTagId);

        const gtmScript = document.createElement("script");
        gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`;
        gtmScript.async = true;
        document.head.appendChild(gtmScript);

        watch(
            () => route.fullPath,
            (newPath) => {
              if (window._hmt) {
                window._hmt.push(["_trackPageview", newPath]);
              }
              if (window.gtag) {
                window.gtag("config", googleTagId, { page_path: newPath });
              }
            },
            { immediate: true } // 立即执行一次，确保首页也能上报
        );
      }
    });
  },

  rootComponents: [
    NavMusic,
    HeroHitokoto,
    MyIcon,
    BlogBg,
  ],
});
