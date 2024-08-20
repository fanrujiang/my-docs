---
title: 01_SpringBoot 项目集成 Prometheus
date: 2024-08-20 17:37:54
tags: 监控
categories:
- 监控
---

> 监控是一项具有挑战性的任务。这是建立稳定生产系统的关键一步。通过观察各种指标，我们可以了解系统在不同负载条件下的表现以及哪些指标需要更多关注。



在本系列教程中，我将向您展示如何设置[Prometheus](https://prometheus.io/)和[Grafana](https://grafana.com/)来监控 Spring Boot 应用程序。

你将学习如何：

- 配置 Spring Boot Actuator 以启用指标
- 配置 Prometheus 来抓取指标
- 使用[PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/)在 Prometheus UI 中查询各种指标
- 在 Grafana 仪表板中可视化指标

*本文假设您具有基本的 Spring Boot 知识。我们将集中讨论监控配置部分。*

让我们开始吧！



### 1. 准备项目

#### 1. 了解组件

首先，我们看一下下面的图表来了解监控的工作原理：

![img](01_SpringBoot%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90Prometheus/1quNFxdE5j7OtCYBgTOnpVg.png)

监控 Spring Boot 应用程序大图

- Spring Boot 应用程序有一个 Actuator 模块，允许我们监控和管理我们的应用程序。它与第三方监控工具（如 Prometheus）完美集成。
- Micrometer 从我们的应用程序收集指标并将其公开给外部系统，在本例中为 Prometheus。
- Grafana 是一个可视化工具，可以在仪表板中显示来自数据源（例如 Prometheus）的指标。

#### 2. 添加依赖项

我为这个演示准备了一个简单的 Spring Boot 项目。您可以在参考资料部分找到完整的源代码。

我们需要以下依赖项：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-core</artifactId>
        </dependency>
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>
```

#### 3. 配置 Spring Boot Actuator

现在让我们配置`application.yml`文件来启用监控：

```yml
spring:
  application:
    name: fanfan-demo

management:
  endpoints:
    web:
      base-path: /actuator  # 所有 Actuator 端点的基础路径
      exposure:
        include: ["health", "prometheus", "metrics"]  # 暴露健康检查、Prometheus 和 Metrics 端点
  endpoint:
    health:
      show-details: always  # 始终显示健康检查的详细信息

server:
  port: 8080
```

### 2. 启动项目

请注意，我们启用了健康、指标和 Prometheus 路径。

启动应用程序并打开`http://localhost:8080/actuator`[](http://localhost:8080/actuator)

您应该看到以下端点：

![img](01_SpringBoot%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90Prometheus/1VV17sAsicC_FNZ3UKoqV0g.png)

已启用端点

#### 1. 端点`health`

显示我们的应用程序是否正在运行：

![img](01_SpringBoot%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90Prometheus/1VVWVa2Rx5Wh6vqHD9kZzgQ.png)

#### 2. 端点`prometheus`

显示各种指标，例如 JVM 线程状态、有关 HTTP 服务器请求的信息等。

![img](01_SpringBoot%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90Prometheus/1RT_yo4bK3ywbIJmWhvzkzQ.png)

端点`metrics`提供有关 JVM 内存、系统 CPU 使用率等的信息。

![img](01_SpringBoot%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90Prometheus/1Hp83eedCI9V6D_zqbLh8yw.png)

### 3. 编写测试接口

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;


@RestController
public class MethodCountController {

    //测试方法
    @GetMapping("/hello")
    public Object hello() {
        System.out.println("hello-----" + LocalDateTime.now().toString());
        return "hello-----" + LocalDateTime.now().toString();
    }


}
```

### 4. 测试监控指标

在浏览器访问几次 [localhost:8080/hello](http://localhost:8080/hello)



观察 [localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus) 内监控指标是否成功记录

![image-20240820143354898](01_SpringBoot%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90Prometheus/image-20240820143354898.png)

1. **http_server_requests_seconds_count**: 这个计数器（counter）记录了满足特定条件的HTTP请求的数量。在这个例子中，它表示的是没有异常、方法为`GET`、结果成功（`SUCCESS`）、状态码为`200`且URI为`/hello`的请求总数。数值`20598.0`意味着这样的请求已经发生了20,598次。
2. **http_server_requests_seconds_sum**: 这个计数器记录了满足上述相同条件的所有请求处理时间的总和（以秒为单位）。数值`5.677197`意味着所有这些请求的处理时间加起来总共耗时大约5.677197秒。
3. **http_server_requests_seconds_max**: 这个指标是一个计量表（gauge），它显示了满足上述条件的所有请求中最长的处理时间。数值`0.0356412`意味着最长的一个请求处理时间为大约0.0356412秒。

综上所述，我们可以得出结论，对于路径`/hello`上的`GET`请求，它们都是成功的并且没有抛出异常。到目前为止，这类请求总共发生了20,598次，累计处理时间大约为5.677197秒，而单个请求的最长处理时间约为0.0356412秒。



> OK，目前为止 SpringBoot 项目已经成功集成了 Prometheus
