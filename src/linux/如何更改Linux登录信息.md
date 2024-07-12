---
title: 如何更改 Linux 登录信息
icon: /img/linux.svg
date: 2024-07-12 12:37:54
tags: Linux
categories:
- Linux
---
# 如何更改 Linux 登录信息

在使用 Linux 时，你可能会希望自定义登录时显示的欢迎信息和系统更新提示。本篇博客将详细介绍如何通过修改系统配置文件来实现这一目标。

## 步骤一：更改欢迎信息 (MOTD)

MOTD (Message of the Day) 是用户每次登录系统时看到的欢迎信息。在大多数Linux发行版中，这个信息存储在 `/etc/motd` 文件中。我们可以通过编辑这个文件来自定义欢迎信息。

### 修改 `/etc/motd` 文件

1. 打开终端并以超级用户身份编辑 `/etc/motd` 文件：

    ```sh
    sudo nano /etc/motd
    ```

2. 输入你希望显示的欢迎信息。例如：

    ```plaintext
    Welcome to My Custom ECS Instance!
    Have a great day!
    ```

3. 保存并退出编辑器。在 nano 编辑器中，按 `Ctrl+O` 保存文件，按 `Ctrl+X` 退出编辑器。

4. 修改前

    ![image-20240712113748577](%E5%A6%82%E4%BD%95%E6%9B%B4%E6%94%B9Linux%E7%99%BB%E5%BD%95%E4%BF%A1%E6%81%AF/image-20240712113748577.png)

5. 修改后

    ![image-20240712113548144](%E5%A6%82%E4%BD%95%E6%9B%B4%E6%94%B9Linux%E7%99%BB%E5%BD%95%E4%BF%A1%E6%81%AF/image-20240712113548144.png)

## 步骤二：更改更新提示

更新提示通常由 `dnf` 或 `yum` 等包管理工具生成。我们可以通过修改它们的配置文件来禁用或调整这些提示。

### 修改 `dnf` 配置文件

1. 打开并编辑 `dnf` 的自动更新配置文件：

    ```sh
    sudo nano /etc/dnf/automatic.conf
    ```

2. 找到以下部分并进行修改：

    ```ini
    [commands]
    upgrade_type = default
    random_sleep = 360
    ```

3. 将 `upgrade_type` 修改为 `none` 以禁用自动升级提示：

    ```ini
    upgrade_type = none
    ```

4. 保存并退出编辑器。

### 禁用 `dnf-automatic` 插件

如果你使用 `dnf-automatic` 插件，可以通过以下命令禁用它：

```sh
sudo systemctl disable --now dnf-automatic.timer
```

## 步骤三：更改登录时间和IP信息

登录时间和IP信息通常是系统自动生成的。我们可以通过在SSH配置文件中指定一个自定义的Banner文件来更改这些信息。

### 修改 `sshd_config` 文件

1. 打开并编辑SSH服务的配置文件：

    ```sh
    sudo nano /etc/ssh/sshd_config
    ```

2. 找到并修改 `Banner` 配置项，指定一个包含自定义内容的文件路径：

    ```ini
    Banner /etc/issue.net
    ```

3. 保存并退出编辑器。

### 编辑 `issue.net` 文件

1. 打开并编辑 `issue.net` 文件：

    ```sh
    sudo nano /etc/issue.net
    ```

2. 输入你希望显示的内容。例如：

    ```plaintext
    Authorized access only. All activity may be monitored and reported.
    ```

3. 保存并退出编辑器。

### 重启SSH服务

完成以上步骤后，重新启动SSH服务以应用更改：

```sh
sudo systemctl restart sshd
```

## 总结

通过这些配置，你不仅可以提高系统的个性化程度，还能增强用户体验。

希望这篇文章对你有所帮助，如果你有任何问题或建议，欢迎在评论区留言讨论。