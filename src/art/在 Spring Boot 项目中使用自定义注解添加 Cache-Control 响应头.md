---
title: 在 Spring Boot 项目中使用自定义注解添加 Cache-Control 响应头
date: 2024-06-06 18:27:19
tags: 
- 技术分享
categories:
- 技术分享
---
# 在 Spring Boot 项目中使用自定义注解添加 Cache-Control 响应头

在开发 Web 应用程序时，合理地设置 HTTP 响应头中的 `Cache-Control` 可以有效地提高应用的性能和用户体验。在这篇博客中，我们将介绍如何在 Spring Boot 项目中使用自定义注解，动态地在接口响应头中添加 `Cache-Control`。

### 1. 创建自定义注解

首先，我们需要定义一个自定义注解，用于标记需要添加 `Cache-Control` 的控制器方法。

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 修改 HTTP 请求响应头 Cache-Control 的自定义注解。
 * 
 * 使用此注解可以在指定的控制器方法上动态添加 Cache-Control 响应头。
 * 
 * @Target({ElementType.METHOD}) - 指定此注解只能用于方法上。
 * @Retention(RetentionPolicy.RUNTIME) - 指定此注解在运行时可用。
 * 
 * @value - 用于指定 Cache-Control 的值，默认为 "no-cache, no-store, must-revalidate"。
 * 
 * 使用示例：
 * 
 * 1. 在控制器方法上使用此注解，指定需要的 Cache-Control 值：
 * 
 *    ```java
 *    @CacheControl("public, max-age=3600")
 *    @GetMapping("/example")
 *    public String example() {
 *        return "This is an example response";
 *    }
 *    ```
 * 
 * 通过以上步骤，您可以使用 @CacheControl 注解为指定的控制器方法添加自定义的 Cache-Control 响应头。
 * 
 * @author fanfan
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface CacheControl {
    String value() default "no-cache, no-store, must-revalidate";
}
```

### 2. 创建拦截器

接下来，我们需要创建一个 Spring 的拦截器，用于在处理请求时检查方法是否有这个注解，如果有，就在响应头中添加 `Cache-Control`。

```java
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

@Component
public class CacheControlInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            Method method = handlerMethod.getMethod();
            if (method.isAnnotationPresent(CacheControl.class)) {
                // 如果方法上有 CacheControl 注解，则设置响应头
                CacheControl cacheControl = method.getAnnotation(CacheControl.class);
                response.setHeader("Cache-Control", cacheControl.value());
            }
        }
        return true;
    }
}
```

### 3. 注册拦截器

我们需要在 Spring 配置类中注册这个拦截器。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private CacheControlInterceptor cacheControlInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(cacheControlInterceptor);
    }
}
```

### 4. 在控制器方法上使用注解

最后，我们可以在控制器方法上使用这个注解，指定需要的 `Cache-Control` 值。

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExampleController {

    @CacheControl("public, max-age=3600")
    @GetMapping("/example")
    public String example() {
        return "This is an example response";
    }

    @CacheControl("no-store")
    @GetMapping("/example2")
    public String example2() {
        return "This response should not be stored in cache";
    }
}
```

### 5. 现存问题

接口报错也会设置响应头 我们该如何解决呢

因为博主用的 Ruoyi框架，就以此框架举例

找到全局异常处理器

若依的在这个类 com.ruoyi.framework.web.exception.GlobalExceptionHandler

由于他这个是后置处理 我们在基础上做响应头的覆盖就可以了，博主还对此全局异常处理做了优化

使其 在接口报错的时候响应正确的状态码，不会再一股脑的返回200状态

也算是解决了一个bug

```java
package com.ruoyi.framework.web.exception;

import com.ruoyi.common.constant.HttpStatus;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.exception.DemoModeException;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 全局异常处理器
 *
 * @author ruoyi
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 权限校验异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    public AjaxResult handleAccessDeniedException(AccessDeniedException e, HttpServletRequest request, HttpServletResponse response) {
        String requestURI = request.getRequestURI();
        log.error("请求地址'{}',权限校验失败'{}'", requestURI, e.getMessage());
        int code = HttpStatus.UNAUTHORIZED;
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return AjaxResult.error(HttpStatus.FORBIDDEN, "没有权限，请联系管理员授权");
    }

    /**
     * 请求方式不支持
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public AjaxResult handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException e,
                                                          HttpServletRequest request, HttpServletResponse response) {
        String requestURI = request.getRequestURI();
        log.error("请求地址'{}',不支持'{}'请求", requestURI, e.getMethod());

        int code = HttpStatus.ERROR;
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return AjaxResult.error(e.getMessage());
    }

    /**
     * 业务异常
     */
    @ExceptionHandler(ServiceException.class)
    public AjaxResult handleServiceException(ServiceException e, HttpServletRequest request, HttpServletResponse response) {
        log.error(e.getMessage(), e);
        Integer code = e.getCode();
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return StringUtils.isNotNull(code) ? AjaxResult.error(code, e.getMessage()) : AjaxResult.error(e.getMessage());
    }

    /**
     * 拦截未知的运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public AjaxResult handleRuntimeException(RuntimeException e, HttpServletRequest request, HttpServletResponse response) {
        String requestURI = request.getRequestURI();
        log.error("请求地址'{}',发生未知异常.", requestURI, e);
        int code = HttpStatus.ERROR;
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return AjaxResult.error(e.getMessage());
    }

    /**
     * 系统异常
     */
    @ExceptionHandler(Exception.class)
    public AjaxResult handleException(Exception e, HttpServletRequest request, HttpServletResponse response) {
        String requestURI = request.getRequestURI();
        log.error("请求地址'{}',发生系统异常.", requestURI, e);
        int code = HttpStatus.ERROR;
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return AjaxResult.error(e.getMessage());
    }

    /**
     * 自定义验证异常
     */
    @ExceptionHandler(BindException.class)
    public AjaxResult handleBindException(BindException e, HttpServletResponse response) {
        log.error(e.getMessage(), e);
        String message = e.getAllErrors().get(0).getDefaultMessage();
        int code = HttpStatus.ERROR;
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return AjaxResult.error(message);
    }

    /**
     * 自定义验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Object handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletResponse response) {
        log.error(e.getMessage(), e);
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        int code = HttpStatus.ERROR;
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return AjaxResult.error(message);
    }

    /**
     * 演示模式异常
     */
    @ExceptionHandler(DemoModeException.class)
    public AjaxResult handleDemoModeException(DemoModeException e, HttpServletResponse response) {
        int code = HttpStatus.ERROR;
        response.setStatus(code);
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        return AjaxResult.error("演示模式，不允许操作");
    }
}

```



这样处理后 即使报错 客户端会重新发送请求

![image-20240606182541227](%E5%9C%A8%20Spring%20Boot%20%E9%A1%B9%E7%9B%AE%E4%B8%AD%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B3%A8%E8%A7%A3%E6%B7%BB%E5%8A%A0%20Cache-Control%20%E5%93%8D%E5%BA%94%E5%A4%B4/image-20240606182541227.png)

![image-20240606182630256](%E5%9C%A8%20Spring%20Boot%20%E9%A1%B9%E7%9B%AE%E4%B8%AD%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B3%A8%E8%A7%A3%E6%B7%BB%E5%8A%A0%20Cache-Control%20%E5%93%8D%E5%BA%94%E5%A4%B4/image-20240606182630256.png)

### 5. 总结

通过以上步骤，我们实现了一个自定义注解 `@CacheControl`，并使用拦截器动态地在 HTTP 响应头中添加 `Cache-Control`。这样可以根据不同的接口需求灵活地设置缓存策略，提升应用的性能和用户体验。

希望这篇博客能帮助您更好地理解和实现自定义注解在 Spring Boot 项目中的应用。如果有任何问题或建议，欢迎在评论区留言讨论。