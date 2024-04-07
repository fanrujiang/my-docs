import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import {searchProPlugin} from "vuepress-plugin-search-pro";

// import { commentPlugin } from "vuepress-plugin-comment2";


export default defineUserConfig({

  base: "/",

  lang: "zh-CN",
  title: "FanFanの学习笔记",
  description: "fanfan",

  theme,



  plugins: [

    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),

    // commentPlugin({
    //   provider: "Waline", // Artalk | Giscus | Waline | Twikoo
    //   serverURL: "https://my-talk-eso6fkicc-fanrujiangs-projects.vercel.app/"
    //   // 在这里放置其他选项
    //   // ...
    // }),
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});
