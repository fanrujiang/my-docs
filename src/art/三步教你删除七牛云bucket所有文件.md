---
title: 三步教你删除七牛云bucket所有文件
date: 2024-05-09 15:40:19
tags: 
- 技术分享
categories:
- 技术分享
---

## 三步教你删除七牛云bucket所有文件

今天要删除一个不再使用的空间（bucket），释放存储空间，删除时提示“空间「xxx」不为空”，意思是要先清空空间内的文件，再删除，由于文件有几TB，后台提供的删除功能没法在短时间内清空，工作量较大

![image-20240509153406432](%E4%B8%89%E6%AD%A5%E6%95%99%E4%BD%A0%E5%88%A0%E9%99%A4%E4%B8%83%E7%89%9B%E4%BA%91bucket%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6/image-20240509153406432.png)

于是咨询七牛云工程师后 有了解决方案

## 使用 Qshell 进行删除

Qshell 是利用七牛文档上公开的API实现的一个方便开发者测试和使用七牛API服务的命令行工具。该工具设计和开发的主要目的就是帮助开发者快速解决问题。目前该工具融合了七牛存储，CDN，以及其他的一些七牛服务中经常使用到的方法对应的便捷命令，比如b64decode，就是用来解码七牛的URL安全的Base64编码用的，所以这是一个面向开发者的工具，任何新的被认为适合加到该工具中的命令需求，都可以在[ISSUE列表](https://github.com/qiniu/qshell/issues)里面提出来，我们会尽快评估实现，以帮助大家更好地使用七牛服务。

Github [代码地址](https://github.com/qiniu/qshell)

### 1. 下载

该工具使用 Go 语言编写而成，当然为了方便不熟悉 Go 或者急于使用工具来解决问题的开发者，我们提供了预先编译好的各主流操作系统平台的二进制文件供大家下载使用，由于平台的多样性，我们把这些二进制打包放到一个文件里面，请大家根据下面的说明各自需要选择支持合适平台来使用。

> 更新日志 [查看](https://github.com/qiniu/qshell/blob/master/CHANGELOG.md)，`强烈建议使用 v2.8.0 及以上版本`.

| 支持平台      | 链接                                                         |
| :------------ | :----------------------------------------------------------- |
| Windows X86   | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-windows-386.zip) |
| Windows amd64 | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-windows-amd64.zip) |
| Windows arm   | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-windows-arm.zip) |
| Linux X86     | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-linux-386.tar.gz) |
| Linux amd64   | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-linux-amd64.tar.gz) |
| Linux arm     | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-linux-arm.tar.gz) |
| Linux arm64   | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-linux-arm64.tar.gz) |
| Mac OS amd64  | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-darwin-amd64.tar.gz) |
| Mac OS arm64  | [下载](https://kodo-toolbox-new.qiniu.com/qshell-v2.13.0-darwin-arm64.tar.gz) |

### 2. 安装

该工具由于是命令行工具，所以只需要从上面的下载链接下载后即可执行使用。

**Linux和Mac平台**

（1）权限
如果在Linux或者Mac系统上遇到`Permission Denied`的错误，请使用命令`chmod +x qshell`来为文件添加可执行权限。这里的`qshell`是上面文件重命名之后的简写。

（2）任何位置运行
对于Linux或者Mac，如果希望能够在任何位置都可以执行，那么可以把`qshell`所在的目录加入到环境变量`$PATH`中去。假设`qshell`命令被解压到路径`/home/jemy/tools`目录下面，那么我们可以把如下的命令写入到你所使用的bash所对应的配置文件中，如果是`/bin/bash`，那么就是`~/.bashrc`文件，如果是`/bin/zsh`，那么就是`~/.zshrc`文件中。写入的内容为：

```
拷贝
export PATH=$PATH:/home/jemy/tools
```

保存完毕之后，可以通过两种方式立即生效，其一为输入`source ~/.zshrc`或者`source ~/.bashrc`来使配置立即生效，或者完全关闭命令行，然后重新打开一个即可，接下来就可以在任何位置使用`qshell`命令了。

**Windows平台**

（1）闪退问题
本工具是一个命令行工具，在Windows下面请先打开命令行终端，然后输入工具名称执行，不要双击打开，否则会出现闪退现象。

（2）任何位置运行
如果你希望可以在任意目录下使用`qshell`，请将`qshell`工具可执行文件所在目录添加到系统的环境变量中。由于Windows系统是图形界面，所以方便一点。假设`qshell.exe`命令被解压到路径`E:\jemy\tools`目录下面，那么我们把这个目录放到系统的环境变量`PATH`里面。

[![img](%E4%B8%89%E6%AD%A5%E6%95%99%E4%BD%A0%E5%88%A0%E9%99%A4%E4%B8%83%E7%89%9B%E4%BA%91bucket%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6/FrJbSsVTFtZyFcEPKhVMYLfsSd9e.png)](https://dn-odum9helk.qbox.me/FrJbSsVTFtZyFcEPKhVMYLfsSd9e)

（3）文本编码问题

当使用 qupload 等需要配置文件的命令时，不要使用 Notepad++ 等编辑器来编写配置文件，在本地右键默认新建一个文本文档来进行编写。

（4） Windows 平台文件路径和字符

Windows 平台下的文件路径需要写为`\\`的写法，如`C:\\Users\\li\\Downloads`。

在使用命令和配置文件时，需要使用 `“”` 双引号,不能使用单引号。

### 3. 密钥设置

该工具有两类命令，一类需要鉴权，另一类不需要。

需要鉴权的命令都需要依赖七牛账号下的 `AccessKey` 和 `SecretKey`。所以这类命令运行之前，需要使用 `account` 命令来设置下 `AccessKey` ，`SecretKey` 。

```
拷贝
$ qshell account ak sk name
```

其中name表示该账号的名称, 如果ak, sk, name首字母是"-", 需要使用如下的方式添加账号, 这样避免把该项识别成命令行选项:

```
拷贝
$ qshell account -- ak sk name
```

可以连续使用qshell account 添加账号ak, sk, name信息，qshell会保存这些账号的信息， 可以使用qshell user命令列举账号信息，在各个账号之间切换, 删除账号等

### 4. 读取bucket所有文件写入到TXT文件中

```shell
qshell listbucket2 空间名 -o result.txt
```

![image-20240509154002198](%E4%B8%89%E6%AD%A5%E6%95%99%E4%BD%A0%E5%88%A0%E9%99%A4%E4%B8%83%E7%89%9B%E4%BA%91bucket%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6/image-20240509154002198.png)

### 5. 使用命令删除文件

使用batchdelete命令批量删除第2步列举出的列表文件。

```shell
qshell batchdelete --force 空间名 -i result.txt
```

![image-20240509154111783](%E4%B8%89%E6%AD%A5%E6%95%99%E4%BD%A0%E5%88%A0%E9%99%A4%E4%B8%83%E7%89%9B%E4%BA%91bucket%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6/image-20240509154111783.png)

就酱，很简单是不是