---
home: true
icon: home
title: 主页
heroImage: /logo.svg
bgImage: https://theme-hope-assets.vuejs.press/bg/10-light.svg
bgImageDark: https://theme-hope-assets.vuejs.press/bg/10-dark.svg
bgImageStyle:
  background-attachment: fixed
heroText: FanFanの学习笔记
tagline: 业精于勤，荒于嬉；行成于思，毁于随。
actions:
  - text: 进入博客
    icon: /assets/icon/blog.svg
    link: ./blog/
    type: primary

  - text: 关于作者
    icon: /assets/icon/about-me.svg
    link: ./intro/

highlights:      
  - header: 
#    image: /assets/image/features.svg
    bgImage: https://theme-hope-assets.vuejs.press/bg/10-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/10-dark.svg
    features:
      - title: AJAX
        icon: ajax
        details: Ajax是前端技术，可在不刷新页面的情况下与服务器交换数据，提高用户体验。
        link: ./ajax/

      - title: JavaSE
        icon: java
        details: JavaSE是Java平台标准版，提供核心功能和基础库，用于开发跨平台的桌面和嵌入式应用程序。
        link: ./javaSE/

      - title: Linux
        icon: /img/linux.svg
        details: Linux是一种开源操作系统，以稳定、安全和灵活著称，广泛用于服务器和嵌入式系统。
        link: ./linux/

      - title: Docker
        icon: /img/docker.svg
        details: Docker是一种容器化平台，用于打包、发布和运行应用程序，提供高效的跨平台部署解决方案。
        link: ./docker/

      - title: Nginx
        icon: nginx
        details: Nginx 是开源、高性能、高可靠的 Web 和反向代理服务器。
        link: ./nginx/
        
      - title: nodeJS
        icon: /img/node.svg
        details: Node.js是一个基于Chrome V8引擎的JavaScript运行时环境，用于构建高性能、可扩展的网络应用程序。
        link: ./nodeJS/        


copyright: false
#footer: 使用 MIT 协议, 版权所有 © 2019-present FanFan
---


### <center>梦开始的地方</center>

::: code-tabs#shell

@tab python

```bash
print("Hello, World!")
```

@tab JavaScript

```bash
console.log("Hello, World!");
```

@tab Java

```bash
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

```

@tab C

```bash
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

@tab C++

```bash
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}

```

@tab Ruby

```bash
puts 'Hello, World!'
```

@tab Swift

```bash
print("Hello, World!")
```

@tab Go

```bash
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```
@tab Rust

```bash
fn main() {
    println!("Hello, World!");
}
```

:::