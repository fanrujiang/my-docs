---
# 这是文章的标题
title: 关于本站
icon: info
order: 1
# 你可以自定义封面图片
#cover: /assets/images/cover3.jpg
# 这是页面的图标
#icon: file
# 这是侧边栏的顺序
#order: 1
# 设置作者
#author: fanfan
# 设置写作时间
date: 2021-01-01
# 一个页面可以有多个分类
#category:
#  - 使用指南
# 一个页面可以有多个标签
#tag:
#  - 页面配置
#  - 使用指南
# 此页面会在文章列表置顶
sticky: false
# 此页面会出现在文章收藏中
star: false
# 你可以自定义页脚
footer: 这是测试显示的页脚
# 你可以自定义版权信息
#copyright: 无版权
index: false
# 是否显示在文章列表中
article: false
---

### 💘 关于本站

由于博客框架从hexo切换到了VuePress后,markdown记录的笔记有一些不兼容,后续会慢慢迁移过来

本博客基于 VuePress 和 vuepress-theme-hope 搭建 和 魔改 

博主借鉴 墨七大佬的思路 开发了一款全局的音乐播放器。可以通过顶部导航栏右上角的 按钮打开 

![image-20231130023227744](intro/image-20231130023227744.png)

音源通过Python爬虫 爬取对应歌单的`音源文件,封面,作者,歌曲名 `

json示例

```json
[
    {
        "author": "王利民纯音",
        "lrc": "https://api2.52jan.com/qqmusic/lrc/001To4tG4UAuNW.lrc",
        "pic": "https://y.qq.com/music/photo_new/T002R300x300M000001PkaY90CFWqG.jpg",
        "title": "海风拂枕",
        "url": "https://api2.52jan.com/qqmusic/001To4tG4UAuNW"
    },
    {
        "author": "EMBRZ",
        "lrc": "https://api2.52jan.com/qqmusic/lrc/003kHw374BUJWD.lrc",
        "pic": "https://y.qq.com/music/photo_new/T002R300x300M000000vfsYu1T64L9.jpg",
        "title": "Breathe",
        "url": "https://api2.52jan.com/qqmusic/003kHw374BUJWD"
    }
]    
```

博客中的部分图片和音乐源于网络，侵删

本博客文章采用 CC BY-NC-SA 4.0 协议，转载请注明出处

欢迎小伙伴们交换友链，具体说明可在 友链页 查看。



### 🙋 免责声明

本站以分享互联网经验、学习知识为目的，所有文章所涉及使用的工具、资源等均来自互联网， 仅供学习和研究使用，版权归作者所有，如果无意之中侵犯了您的版权，请来信告知。本站将在第一时间删除！另外， 本站内的文章多为博主原创，部分是由CSDN平台和稀土掘金 搬迁过来，仅供学习交流之用，不参与商业用途。

遵守相关法律法规，由于本站资源部分来源于网络，开发也是使用开源模板，故无法核实资源侵权的真实性，无论出于何种目的要求本站删除内容，“您”均需要提供相关证明，否则不予处理。

