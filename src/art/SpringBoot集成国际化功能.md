---
title: SpringBoot集成国际化功能最佳实践
date: 2024-08-31 18:40:20
tags: 
- 技术分享
categories:
- 技术分享
---

在构建多语言支持的 Web 应用程序时，国际化（i18n）是一个关键部分。Spring 提供了强大的国际化支持，但默认的 `java.util.Locale` 并不能满足所有场景的需求。为了支持更广泛的语言和区域格式，我们可以使用 ICU4J（International Components for Unicode for Java），这是一个功能强大的国际化库。

<!-- more -->

### 0. 准备工作

#### 1. 创建国际化资源文件

首先需要创建或修改已有的国际化资源文件。这些文件通常放在项目的 **src/main/resources/i18n/** 目录下。对于不同的语言，你可以创建对应的属性文件，例如：

- messages.properties - 默认
- messages_en_US.properties - 英语
- messages_zh_CN.properties - 简体中文

示例文件内容：

![image-20240831184919328](SpringBoot%E9%9B%86%E6%88%90%E5%9B%BD%E9%99%85%E5%8C%96%E5%8A%9F%E8%83%BD/image-20240831184919328.png)

#### messages.properties

```properties
1welcome=欢迎
2hello=你好
```

#### messages_zh_CN.properties

```properties
1welcome=欢迎
2hello=你好
```

#### messages_en_US.properties

```properties
1welcome=Welcom
2hello=Hello
```



#### 2. 配置 Spring Boot 应用

为了使Spring Boot能够识别这些资源文件，你需要在配置文件中指定国际化配置。可以在 `application.yml` 或 `application.properties` 文件中添加如下配置：

```
# application.yml
spring:
  messages:
    basename: i18n/messages
```

```
# application.properties
spring.messages.basename=i18n/messages
```

### 1. 引入 ICU4J 依赖

```xml
<dependency>
    <groupId>com.ibm.icu</groupId>
    <artifactId>icu4j</artifactId>
    <version>75.1</version>
</dependency>

```

### 2. 使用 ICU4J 替代 `java.util.Locale`

ICU4J 提供了更丰富的国际化功能，相较于标准的 `java.util.Locale`，它支持更多的区域设置和更灵活的语言环境处理。我们可以使用 `ULocale` 来替代 `Locale`，并通过自定义过滤器 `ULocaleFilter` 来在每个请求中解析 `Accept-Language` 头部，设置用户的语言环境。

```java
import com.ibm.icu.util.ULocale;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * 国际化过滤器
 *
 * @author fanfan
 */
@Slf4j
@Component
public class ULocaleFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String acceptLanguage = httpRequest.getHeader("Accept-Language");

        if (acceptLanguage != null && !acceptLanguage.isEmpty()) {
            ULocale uLocale = determineBestULocale(acceptLanguage);
            log.info("这个用户的语言是: {}", uLocale.getLanguage());
            log.info("这个用户的国家是: {}", uLocale.getCountry());
            log.info("这个用户的语言环境的完整名称是: {}", uLocale.getDisplayName());
            ULocaleContextHolder.setULocaleContext(new ULocaleContext(uLocale));
        } else {
            ULocaleContextHolder.setULocaleContext(new ULocaleContext(ULocale.US));
            log.info("没有找到用户的语言信息，使用默认: 美国英文");
        }

        try {
            chain.doFilter(request, response);
        } finally {
            ULocaleContextHolder.resetULocaleContext();
        }
    }

    private ULocale determineBestULocale(String acceptLanguage) {
        String[] locales = acceptLanguage.split(",");
        Map<Double, List<ULocale>> weightedLocales = new TreeMap<>((a, b) -> b.compareTo(a)); // 按权重从高到低排序

        for (String localeStr : locales) {
            String[] parts = localeStr.trim().split(";q=");
            ULocale locale = ULocale.forLanguageTag(parts[0]);
            double weight = parts.length > 1 ? Double.parseDouble(parts[1]) : 1.0;
            weightedLocales.computeIfAbsent(weight, k -> new ArrayList<>()).add(locale);
        }

        return weightedLocales.values().stream().flatMap(List::stream).findFirst().orElse(ULocale.getDefault());
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化配置
    }

    @Override
    public void destroy() {
        // 销毁过滤器
    }
}

```

### 3. 线程工具类 用来保存国际化信息

```java
import com.ibm.icu.util.ULocale;


public class ULocaleContext {
    private final ULocale uLocale;

    public ULocaleContext(ULocale uLocale) {
        this.uLocale = uLocale;
    }

    public ULocale getULocale() {
        return uLocale;
    }
}
```

```java
import com.ibm.icu.util.ULocale;

public class ULocaleContextHolder {
    private static final ThreadLocal<ULocaleContext> localeContextHolder = new ThreadLocal<>();

    public static void setULocaleContext(ULocaleContext context) {
        localeContextHolder.set(context);
    }

    public static ULocaleContext getULocaleContext() {
        return localeContextHolder.get();
    }

    public static ULocale getULocale() {
        ULocaleContext context = getULocaleContext();
        return (context != null ? context.getULocale() : ULocale.getDefault());
    }

    public static void resetULocaleContext() {
        localeContextHolder.remove();
    }
}

```

### 4. 创建 I18nUtils 用于业务中调用

```java
import cn.hutool.extra.spring.SpringUtil;
import com.ibm.icu.util.ULocale;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;

/**
 * i18n 国际化工具
 *
 * @author fanfan
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class I18nUtils {

    private static final MessageSource MESSAGE_SOURCE = SpringUtil.getBean(MessageSource.class);

    /**
     * 根据消息键和参数 获取消息 委托给spring messageSource
     *
     * @param code 消息键
     * @param args 参数
     * @return 获取国际化翻译值
     */
    public static String message(String code, Object... args) {
        try {
            ULocale uLocale = ULocaleContextHolder.getULocale();
            return MESSAGE_SOURCE.getMessage(code, args, uLocale.toLocale());
        } catch (NoSuchMessageException e) {
            return code;
        }
    }


    /**
     * 获取当前语言
     * @return 语言
     */
    public static String getLanguage() {
        ULocale uLocale = ULocaleContextHolder.getULocale();
        return uLocale.getLanguage();
    }
}
```

![image-20240831185117235](SpringBoot%E9%9B%86%E6%88%90%E5%9B%BD%E9%99%85%E5%8C%96%E5%8A%9F%E8%83%BD/image-20240831185117235.png)

### 5. 编写测试 controller 进行测试

```java
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import org.hibernate.validator.constraints.Range;
import org.jeecg.common.api.vo.Result;
import org.jeecg.config.i18n.I18nUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;


/**
 * 测试国际化
 *
 * @author fanfan
 */
@RestController
@RequestMapping("/i18n")
public class TestI18nController {

    /**
     * 通过code获取国际化内容
     *
     * @param code 国际化code
     */
    @ApiOperation(value = "国际化测试")
    @GetMapping()
    public Result<Void> get(String code) {
        return Result.ok(I18nUtils.message(code));
    }

    /**
     * 获取当前语言
     */
    @ApiOperation(value = "国际化测试获取对应语言")
    @GetMapping("/getLang")
    public Result<Void> getLang() {
        return Result.ok("此用户使用的语言是: " + I18nUtils.getLanguage());
    }
}    
```

在 ApiPost中进行接口测试

#### 测试国际化

下面是一个简化的示例表格，展示了不同国家和地区常用的 `Accept-Language` 设置。请注意，实际使用中，这些值可能会根据用户的个人设置有所不同。

| 国家/地区        | 典型的 `Accept-Language` 值 |
| ---------------- | --------------------------- |
| 美国             | `en-US,en;q=0.9`            |
| 加拿大（英语区） | `en-CA,en;q=0.9`            |
| 加拿大（法语区） | `fr-CA,fr;q=0.9`            |
| 英国             | `en-GB,en;q=0.9`            |
| 澳大利亚         | `en-AU,en;q=0.9`            |
| 新西兰           | `en-NZ,en;q=0.9`            |
| 南非             | `en-ZA,en;q=0.9`            |
| 中国             | `zh-CN,zh;q=0.9`            |
| 台湾             | `zh-TW,zh;q=0.9`            |
| 香港             | `zh-HK,zh;q=0.9`            |
| 日本             | `ja-JP,ja;q=0.9`            |
| 韩国             | `ko-KR,ko;q=0.9`            |
| 德国             | `de-DE,de;q=0.9`            |
| 法国             | `fr-FR,fr;q=0.9`            |
| 西班牙           | `es-ES,es;q=0.9`            |
| 俄罗斯           | `ru-RU,ru;q=0.9`            |
| 巴西             | `pt-BR,pt;q=0.9`            |
| 葡萄牙           | `pt-PT,pt;q=0.9`            |
| 意大利           | `it-IT,it;q=0.9`            |
| 荷兰             | `nl-NL,nl;q=0.9`            |

这里的 `q` 参数表示“质量”或优先级，`q=0.9` 表示该语言的优先级为0.9，通常默认值是1.0。例如，“en-US,en;q=0.9”意味着首先偏好美国英语（`en-US`），但如果不可用，则接受通用英语（`en`），其优先级稍低。

请注意，这些值并不是固定的，它们可以根据用户的浏览器设置和偏好而变化。



根据请求头调整 **Accept-Language** 为 美国英语 对应的区域标准代码是 en-US,en;q=0.9

![image-20240831190038324](SpringBoot%E9%9B%86%E6%88%90%E5%9B%BD%E9%99%85%E5%8C%96%E5%8A%9F%E8%83%BD/image-20240831190038324.png)

根据请求头调整 **Accept-Language** 为 中国简中 对应的区域标准代码是 zh-CN,zh;q=0.9

![image-20240831190252510](SpringBoot%E9%9B%86%E6%88%90%E5%9B%BD%E9%99%85%E5%8C%96%E5%8A%9F%E8%83%BD/image-20240831190252510.png)

#### 获取对应语言信息测试

![image-20240831190650857](SpringBoot%E9%9B%86%E6%88%90%E5%9B%BD%E9%99%85%E5%8C%96%E5%8A%9F%E8%83%BD/image-20240831190650857.png)

现在就完成了最基本的国际化，后续就可以使用 I18nUtils 的对应国际化消息了

### 6. 扩展

对异常消息的处理

```java
    public static boolean verifyToken(String token, CommonAPI commonApi, RedisUtil redisUtil) {
        if (StringUtils.isBlank(token)) {
            throw new JeecgBoot401Exception(I18nUtils.message("token.null"));
        }

        // 解密获得username，用于和数据库进行对比
        String username = JwtUtil.getUsername(token);
        if (username == null) {
            throw new Exception(I18nUtils.message("token.expired"));
        }

        // 查询用户信息
        LoginUser user = TokenUtils.getLoginUser(username, commonApi, redisUtil);
        //LoginUser user = commonApi.getUserByName(username);
        if (user == null) {
            throw new Exception(I18nUtils.message("user.password.not.match"));
        }
        // 判断用户状态
        if (user.getStatus() != 1) {
            throw new Exception(I18nUtils.message("user.blocked"));
        }
        // 校验token是否超时失效 & 或者账号密码是否错误
        if (!jwtTokenRefresh(token, username, user.getPassword(), redisUtil)) {
            throw new Exception(I18nUtils.message("token.expired"));
        }
        return true;
    }
```

这样，根据客户端发送的语言设置，页面上将显示相应的语言版本。

以上就是基本的国际化配置方法，你可以根据实际需求调整配置和实现细节。

**如果您有需要，可联系我 发您完整示例代码**
