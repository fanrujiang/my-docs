---
title: 友链页
order: 4
icon: /assets/icon/friend.svg
# 是否显示在文章列表中
article: false
#sidebar: false


blog:
  
  - name: FanFanの学习笔记
    desc: 过去无可挽回,未来可以改变
    logo: https://www.fanliu.top/logo.svg
    url: https://www.fanliu.top
    repo: https://github.com/fanrujiang
    preview: assets/image/page.png
    
  - name: 柒柒blog
    desc: 代码写的好不好，我DEBUG一下就知道了。
    logo: https://thirdqq.qlogo.cn/g?b=qq&nk=2144693292&s=100
    url: https://blog.lwgzs.cn
    preview: assets/image/77.png
    
  - name: 刑辩人在路上
    desc: 刑辩人在路上
    logo: https://xingbianren.cn/zb_users/upload/2023/05/202305231684818873372207.png
    url: https://xingbianren.cn
    preview: https://xingbianren.cn/zb_users/upload/2023/06/202306021685717413207375.jpg
    
  - name: Viper3の小破站
    desc: 时空是个圆圈 我们终会相见
    logo: https://viper3-1318672778.cos.ap-beijing.myqcloud.com/user/DeftCup.jpg
    url: https://viper3.top/
    preview: https://viper3-1318672778.cos.ap-beijing.myqcloud.com/wallpaper/sunsetglow.jpg
    
  - name: 许大阳的日记本
    desc: 潇洒不是洒脱，自由但是有度
    logo: https://imxcy.cn/img/647.jpeg
    url: https://imxcy.cn/
    preview: /img/null.png

---

<SiteInfo
v-for="item in $frontmatter.blog"
:key="item.link"
v-bind="item"
/>




## 提交说明

> 欢迎小伙伴和我交换友链


1. **网站资格要求**：

   - 您的网站需要保持稳定运行状态，并具备一定的内容量。具体要求包括：
     - 域名注册时间不少于半年。
     - 发布了10篇及以上的文章。

2. **优先考虑的网站类型**：

   - 会优先考虑符合以下类别的网站：
     - 已备案的网站。
     - 拥有原创内容的网站。
     - 以技术或生活为主题的网站。

3. **不收录的内容类型**：

   - 不接受含有以下内容的网站，包括但不限于：
     - 反动、极端主义内容。
     - 色情、成人内容。
     - 涉及赌博或类似不良行为的内容，或提供此类链接的网站。

4. **友链交换要求**：

   - 如果符合条件，请在您的网站中添加本站的链接。

   - 将您的网站信息以如下格式发表在评论区,看到会及时添加

     ```yml
       - name: FanFanの学习笔记     # 网站名称
         desc: 过去无可挽回,未来可以改变   # 网站简要说明
         logo: https://www.fanliu.top/logo.svg   # 网站logo
         url: https://www.fanliu.top   # 网站链接
         repo: https://github.com/fanrujiang  # github仓库地址 (可不填)
         preview: https://www.fanliu.top/assets/image/page.png   # 网站主页展示图
     ```

     

