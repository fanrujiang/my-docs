---
title: 宝塔nginx缓存清理
date: 2024-06-06 18:20:19
tags: 
- 技术分享
categories:
- 技术分享
---

# 宝塔Nginx缓存清理

在工作中使用宝塔部署项目时，我发现宝塔会奇怪地缓存接口的数据。经过排查，发现只有设置了响应头包含 `Cache-Control` 的接口才会被宝塔Nginx的反向代理缓存。

于是，我开始着手解决这个问题。

首先，我找到了宝塔Nginx中反向代理的配置文件和缓存目录。一旦确定了位置，解决思路也就清晰了。

## 步骤一：删除缓存目录中的文件

反向代理的缓存目录位于：

```shell
/www/server/nginx/proxy_cache_dir
```

要清除缓存，只需执行以下命令：

```shell
rm -rf /www/server/nginx/proxy_cache_dir/*
```

## 步骤二：修改配置文件以禁止缓存

接下来，需要修改Nginx的配置文件，防止其继续缓存。在文件 `/www/server/nginx/conf/proxy.conf` 中找到 `proxy_cache cache_one;` 这一行，并将其注释掉：

```nginx
nginx复制代码proxy_temp_path /www/server/nginx/proxy_temp_dir;

proxy_cache_path /www/server/nginx/proxy_cache_dir levels=1:2 keys_zone=cache_one:20m inactive=1d max_size=5g;

client_body_buffer_size 512k;

proxy_connect_timeout 60;

proxy_read_timeout 60;

proxy_send_timeout 60;

proxy_buffer_size 32k;

proxy_buffers 4 64k;

proxy_busy_buffers_size 128k;

proxy_temp_file_write_size 128k;

proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;

#proxy_cache cache_one;  # 注释掉，这样全局的缓存就关闭了
```

在宝塔内对某个反向代理域名打开缓存开关时，`proxy_cache cache_one` 会自动添加到反向代理的配置代码中，此时缓存才会再次针对该反向代理域名生效。

通过上述步骤，我们成功地清除了宝塔Nginx的缓存，并防止其再次缓存不必要的数据。如果需要对某个特定域名进行缓存，可以在宝塔内单独开启缓存开关。

希望这篇文章能帮助到你，解决在宝塔Nginx缓存方面遇到的问题。





