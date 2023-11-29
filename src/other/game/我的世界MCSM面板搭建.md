---
title: 我的世界MCSM面板搭建
date: 2021-2-07 16:06:18
tags: Minecraft
categories:
- 游戏
- 我的世界
---

# 我的世界MCSM面板搭建

## Linux

如果你并不想去学习如何自己搭建，可以使用源作者的安装指令（我的脚本没必要了）

<details class="custom-block details"><summary>Linux 系统快速安装（适用于 Ubuntu/Centos/Debian/Arch）</summary> <p>安装成功后，使用 <code>systemctl start mcsm-{(web, daemon)}</code> 命令即可启动面板</p> <div class="language- line-numbers-mode"><pre class="language-text"><code>wget -qO- https://gitee.com/mcsmanager/script/raw/master/setup.sh | bash
</code></pre> <div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div></details>


## 前期需要软件

1. 远程SSH控制台软件（本教程使用 Remote Terminal 此为win10商店软件）[[点我下载(此软件为Xshell)\]  (opens new window)](https://vlssu.lanzoui.com/i88wyvi)
2. 支持Sftp的FTP软件（本教程使用 FileZilla）[[点我下载\]  (opens new window)](https://www.lanzoui.com/i88wyqd)
3. 服务端（本教程使用 Spigot）
4. Centos或Ubuntu主机一台 （教程使用 centos7.9）

## 注意事项

1. 极力推荐Centos系统，Ubuntu系统未经博主测试
2. 未标注哪个系统指令则两者都可适用
3. 若标题注释了哪个系统那只能适用那个系统或另一个系统不需要输此指令

## 环境部署

### 系统更新

- 首先你要确保你的系统是最新的

```bash
yum update # (Centos)
//Ubuntu需要两条指令来升级
apt-get update -y # (Ubuntu)
apt-get upgrade -y # (Ubuntu)
```

### 安装node.js

- **若发现国内下载很慢可以参考这篇来使用国内镜像部署**[**[Linux系统如何安装node管理器\]**]()

1. 安装Git

```bash
yum install git -y # (Centos)
apt install git # (Ubuntu)
```

1. 安装node.js管理器等组件

```bash
git clone https://github.com/creationix/nvm.git ~/nvm
# 设置nvm 自动运行
echo "source ~/nvm/nvm.sh" >> ~/.bashrc
source ~/.bashrc
# 安装npm的v16版本
nvm install v16.14.0
# 使用v13版本
nvm use v16.14.0
# 安装npm最新版本并使用最新版本 //建议使用稳定版而不是最新测试版
# nvm install stable && nvm use stable
```

请关闭终端重新打开或重新连接终端 再依次执行以下命令（重要！）

### 安装java

- 如果要看更精细的步骤可以看这个文章 [[如何在Linux系统中安装Java8\]]()

#### Centos

- 使用`yum`安装`java`。

```bash
# 安装java8
# yum install java-1.8.0-openjdk java-1.8.0-openjdk-devel
# 安装java11 按需安装，建议直接下载用绝对链接来开服
# yum install java-11-openjdk java-11-openjdk-devel
# 安装java17 按需安装，建议直接下载用绝对链接来开服
yum install java-17-openjdk java-17-openjdk-devel
# 查看java版本
java -version
```



#### Ubuntu

1. 安装`java`

```bash
apt install openjdk-17-jdk
```

1. 如果我们在服务器上安装了多个Java版本，我们可以使用**update-alternatives**系统更改默认版本

```bash
sudo update-alternatives --config java
```

要维持当前值[*]请按<回车键>，或者键入选择的编号：
 在出现提示时输入号码并按Enter键。

1. 查看`java`版本

```bash
java -version
```

### 安装MCSM

克隆**MCSManager前端**并安装依赖

```bash
# 下载面板端（Web）程序 并重命名为 web
git clone https://github.com/MCSManager/MCSManager-Web-Production.git web
# 进入 web 文件夹中
cd web
# 安装依赖库
npm install --registry=https://registry.npm.taobao.org
```

克隆**MCSManager后端**并安装依赖

```bash
# 下载守护进程（Daemon）程序
git clone https://github.com/MCSManager/MCSManager-Daemon-Production.git daemon
# 进入 daemon 文件夹中
cd daemon
# 安装依赖库
npm install --registry=https://registry.npm.taobao.org
```

| 访问地址 |       localhost:24444        |
| :------: | :--------------------------: |
| 访问密钥 | [你的密钥，是一串16进制数字] |
|          | 密钥作为守护进程唯一认证手段 |

## 保持后台运行

我们使用`pm2`软件来让面板保持后台运行

```bash
# 安装pm2
npm install -g pm2

# 先启动守护进程
pm2 start daemon/app.js

# 然后启动面板端进程
pm2 start web/app.js
```

**PM2命令：**

```bash
npm install -g pm2
pm2 start app.js        // 启动
pm2 start app.js -i max //启动 使用所有CPU核心的集群
pm2 stop app.js         // 停止
pm2 stop all            // 停止所有
pm2 restart app.js      // 重启
pm2 restart all         // 重启所有
pm2 delete  app.js      // 关闭
```

##  端口开放

面板需要 23333（主功能） 端口
 24444（后端api）端口（可选）

如果你使用阿里云，腾讯云或者服务商，**请进入控制台到防火墙安全组策略，放行以上端口。**

如果依然无法访问，请关闭系统自带防火墙：

```bash
# 关闭防火墙，依次执行
systemctl stop firewalld.service
systemctl disable firewalld.service
```

## 修改站点配置文件

|     配置文件     |  `data/SystemConfig/config.json`  |
| :--------------: | :-------------------------------: |
|   用户数据文件   |        `data/User/*.json`         |
| 远程守护进程配置 | `data/RemoteServiceConfig/*.json` |

## 默认账户

现在，访问 http://你的ip:23333/ 即可进入面板。

```text
# 最高管理员权限（注意，管理员与管理员之间账号可互删）
默认账号：root
默认密码: 123456
```

请及时修改密码。

## 服务端

- [Spigot  (opens new window)](https://getbukkit.org/download/spigot) [可以装插件]
- [paper  (opens new window)](https://papermc.io/downloads) [可以装插件]
- [Forge  (opens new window)](https://files.minecraftforge.net) [可以装MOD]

## 服务器插件/MOD

- [bukkit  (opens new window)](https://dev.bukkit.org) [下载插件]
- [spigotmc  (opens new window)](https://www.spigotmc.org) [下载插件]
- [curseforge  (opens new window)](https://www.curseforge.com/minecraft/modpacks) [下载MOD]
