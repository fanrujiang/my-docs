---
title: jeecg-boot 防止重复提交
date: 2024-05-16 16:32:19
tag: 
- 源码解读
- jeecg-boot
category:
- 源码解读
- jeecg-boot

---


# jeecg-boot 防止重复提交

在现代Web开发中，防止重复提交是一个常见的问题，特别是在处理表单提交、支付操作等场景时。重复提交不仅会影响用户体验，还可能带来安全隐患和数据一致性问题。为了解决这个问题，jeecg-boot 提供了一个非常实用的工具：@JRepeat 注解。

## 1. 什么是 @JRepeat 注解？

@JRepeat 是 jeecg-boot 中的自定义注解，主要用于防止用户重复提交请求。它通过结合缓存机制（如 Redis）和拦截器或 AOP 切面，来确保同一请求在短时间内不会被多次处理。

@JRepeat 是一个基于 Redis 实现的分布式锁注解，它可以用于方法级别的重复提交限制，保证某个方法在同一时间只能被一个请求调用。其中 lockKey 是锁的键值，支持 SpEL 表达式，可以动态生成；lockTime 是锁的过期时间，单位为秒。

## 2. @JRepeat 注解的工作原理

1. **注解定义**：
   在方法上使用 @JRepeat 注解，标记需要防止重复提交的接口。
   
2. **拦截器或 AOP 切面**：
   拦截所有标记了 @JRepeat 注解的方法请求。拦截器或 AOP 切面会生成一个唯一标识符（token），并将其与请求一起存储在缓存中。

3. **缓存校验**：
   每次请求到达时，拦截器或 AOP 切面会检查缓存中是否存在相同的标识符。如果在设定的时间内（如几秒钟）存在相同标识符，则认为是重复提交，拦截请求并返回错误信息。

4. **处理请求**：
   如果缓存中不存在相同标识符，则将请求正常处理，并将标识符存储在缓存中以防止后续重复提交。

## 3. 如何使用 @JRepeat 注解

下面是一个简单的使用示例，演示如何在 jeecg-boot 中使用 @JRepeat 注解来防止重复提交：

1. **引入依赖**：
   确保你的项目已经引入了 jeecg-boot 相关依赖。

   ```xml
   <!-- 引入分布式锁依赖 -->
   <dependency>
       <groupId>org.jeecgframework.boot</groupId>
       <artifactId>jeecg-boot-starter-lock</artifactId>
   </dependency>
   ```

2. **方法上使用 @JRepeat 注解**：
   在需要防止重复提交的方法上添加 @JRepeat 注解放在需要限制重复提交的方法上即可，例如：

```java
@JRepeat(lockKey = "#name", lockTime = 5)
public void doSomething(String name) {
    // 业务逻辑
}
```

JRepeat注解使用说明

```java
/**
 * 超时时间
 *
 * @return
 */
int lockTime();
/**
 * redis 锁key的
 *
 * @return redis 锁key
 */
String lockKey() default "";
```

在每次调用该方法时，会先检查 Redis 中是否存在相应的锁，如果存在，则说明该方法正在被调用，需要等待锁过期后再次尝试调用。如果不存在锁，则创建锁并执行业务逻辑，执行完成后释放锁。

举个例子

当多个用户同时对同一资源进行修改时，可能会发生并发冲突。为了避免这种情况，可以采用加锁机制来限制同一时间只有一个用户能够对该资源进行操作。

在Spring框架中，可以使用注解来实现加锁机制，其中@JRepeat就是一个加锁注解，它的作用是对某个方法加锁。

例如，假设有一个UserService的服务类，其中有一个方法updateUserName(String name)，该方法用于更新用户的用户名。为了避免多个用户同时更新同一个用户名，我们可以在该方法上加上@JRepeat注解，设置相应的锁定参数，如下所示：

@Service
public class UserService {

```java
@JRepeat(lockKey = "#name", lockTime = 5)
public void updateUserName(String name) {
    // 更新用户的用户名
}
}
```


在上面的例子中，@JRepeat 注解中的 lockKey 参数设置为方法参数 name，表示对不同的 name 参数值进行加锁，lockTime 参数设置为5，表示锁定时间为5秒。

当有多个用户同时调用 updateUserName 方法时，只有一个用户能够成功执行该方法，其他用户则需要等待锁定时间过后才能执行该方法。这样可以避免多个用户同时更新同一个用户名的情况发生，保证数据的一致性。

## 4. @JRepeat 源码解析

> 想要真正掌握一件事情或一个东西，最好的方法就是真正的 明白它，理解它，所以我们看源码

### 1. @JRepeat 注解 

在对应依赖包下的这个目录中  org.jeecg.boot.starter.lock.annotation

#### 源码

```java
package org.jeecg.boot.starter.lock.annotation;

/**
 * @author zyf
 */

import java.lang.annotation.*;

/**
 * 防止重复提交的注解
 *
 * @author 2019年6月18日
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
@Documented
public @interface JRepeat {

    /**
     * 超时时间
     *
     * @return
     */
    int lockTime();


    /**
     * redis 锁key的
     *
     * @return redis 锁key
     */
    String lockKey() default "";



}
```

#### 代码解释

- `@Retention(RetentionPolicy.RUNTIME)`: 指定了该注解的生命周期为运行时，这意味着它可以在运行时通过反射机制读取。
- `@Target({ElementType.METHOD})`: 指定了该注解可以应用于方法上。这意味着你可以在方法级别使用`JRepeat`注解来防止方法被重复调用。
- `@Documented`: 表明这个注解应该被包含在生成的JavaDoc文档中，方便开发者理解其用途。

​	`JRepeat`注解定义了两个属性：

- `lockTime()`：这是一个没有默认值的方法，意味着使用此注解时必须为其指定一个整数值。这个值表示锁的超时时间，单位通常取决于具体实现（但未在代码中明确），用于控制锁在Redis中自动释放的时间长度。
- `lockKey() default ""`: 这个属性提供了默认值`""`，即空字符串。它代表了在Redis中用于锁定的键的名称。如果未在注解使用时指定，则默认为空字符串。实际应用中，为了确保锁的唯一性，通常需要根据业务场景设置一个具有唯一性的键名。

### 2.  RepeatSubmitAspect 切面拦截器

#### 源码

```java
package org.jeecg.boot.starter.lock.aspect;

/**
 * @author zyf
 */

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.jeecg.boot.starter.lock.annotation.JRepeat;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.exception.JeecgCloudException;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * 防止重复提交分布式锁拦截器
 *
 * @author 2019年6月18日
 */
@Aspect
@Component
public class RepeatSubmitAspect extends BaseAspect{

    @Resource
    private RedissonLockClient redissonLockClient;

    /***
     * 定义controller切入点拦截规则，拦截JRepeat注解的业务方法
     */
    @Pointcut("@annotation(jRepeat)")
    public void pointCut(JRepeat jRepeat) {
    }

    /**
     * AOP分布式锁拦截
     *
     * @param joinPoint
     * @return
     * @throws Exception
     */
    @Around("pointCut(jRepeat)")
    public Object repeatSubmit(ProceedingJoinPoint joinPoint,JRepeat jRepeat) throws Throwable {
        String[] parameterNames = new LocalVariableTableParameterNameDiscoverer().getParameterNames(((MethodSignature) joinPoint.getSignature()).getMethod());
        if (Objects.nonNull(jRepeat)) {
            // 获取参数
            Object[] args = joinPoint.getArgs();
            // 进行一些参数的处理，比如获取订单号，操作人id等
            StringBuffer lockKeyBuffer = new StringBuffer();
            String key =getValueBySpEL(jRepeat.lockKey(), parameterNames, args,"RepeatSubmit").get(0);
            // 公平加锁，lockTime后锁自动释放
            boolean isLocked = false;
            try {
                isLocked = redissonLockClient.fairLock(key, TimeUnit.SECONDS, jRepeat.lockTime());
                // 如果成功获取到锁就继续执行
                if (isLocked) {
                    // 执行进程
                    return joinPoint.proceed();
                } else {
                    // 未获取到锁
                    throw new JeecgCloudException("请勿重复提交");
                }
            } finally {
                // 如果锁还存在，在方法执行完成后，释放锁
                if (isLocked) {
                    redissonLockClient.unlock(key);
                }
            }
        }

        return joinPoint.proceed();
    }


}
```

#### 代码解释

这段代码定义了一个AOP（面向切面编程）的切面类`RepeatSubmitAspect`，其主要作用是通过拦截带有`@JRepeat`注解的方法来实现防止重复提交的功能。这里使用了Redisson 客户端来实现分布式锁，确保在高并发环境下操作的原子性和一致性

##### 类注解

- `@Aspect`: 表示该类是一个切面类，用于定义切点（Pointcut）、通知（Advice）等AOP相关的操作。
- `@Component`: 将该类标记为Spring的一个Bean，使其能够被Spring容器管理。

##### 成员变量

- `@Resource`: 用于注入`RedissonLockClient`实例，这是与Redis交互并处理锁逻辑的关键组件。

##### 方法说明

###### pointCut 方法

- **作用**: 定义切入点表达式，匹配所有标有`@JRepeat`注解的方法。
- **参数**: `jRepeat` 是一个`JRepeat`类型的参数，代表了被拦截方法上的`@JRepeat`注解实例。

###### repeatSubmit 方法

- 环绕通知(@Around): 在匹配的方法执行前后进行拦截处理。
  - 参数:
    - `joinPoint`: 代表了被拦截的方法的执行点，可以从中获取方法签名、参数等信息。
    - `jRepeat`: 当前执行方法上的`@JRepeat`注解实例。
- 流程:
  1. **解析参数**: 使用`LocalVariableTableParameterNameDiscoverer`获取方法参数名，以便后续拼接锁的键值。
  2. **构建锁键**: 根据`@JRepeat`注解中的`lockKey`属性和方法参数值，动态生成锁的键。
  3. **加锁处理**: 调用`redissonLockClient.fairLock(key, ..., jRepeat.lockTime())`尝试公平锁，如果在指定的`lockTime`内获取锁成功，则执行原方法；否则抛出`JeecgCloudException`阻止重复提交。
  4. **执行原方法**: 加锁成功后，通过`joinPoint.proceed()`执行被拦截的方法。
  5. **释放锁**: 不论方法执行结果如何，在`finally`块中确保解锁操作执行，释放`Redis`锁资源。

##### 关键技术点

- **AOP切面编程**: 通过定义切点和通知逻辑，实现了在不修改原有业务代码的基础上，增强了防止重复提交的功能。
- **Redisson**: 提供了对Redis高级功能的支持，如分布式锁，这里利用了它的公平锁特性来保证线程安全和操作的有序性。
- **动态生成锁键**: 结合方法参数值动态生成锁的键，使得每个特定的业务操作都能获得唯一的锁，避免锁的范围过大影响并发性能。

### 3. BaseAspect 父切面拦截器

#### 源码

用于解析Spring Expression Language (SpEL) 表达式的方法

```java
package org.jeecg.boot.starter.lock.aspect;

import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

import java.util.ArrayList;
import java.util.List;

/**
 * @author zyf
 */
@Slf4j
public class BaseAspect {

    /**
     * 通过spring SpEL 获取参数
     *
     * @param key            定义的key值 以#开头 例如:#user
     * @param parameterNames 形参
     * @param values         形参值
     * @param keyConstant    key的常亮
     * @return
     */
    public List<String> getValueBySpEL(String key, String[] parameterNames, Object[] values, String keyConstant) {
        List<String> keys = new ArrayList<>();
        if (!key.contains("#")) {
            String s = "redis:lock:" + key + keyConstant;
            log.debug("lockKey:" + s);
            keys.add(s);
            return keys;
        }
        //spel解析器
        ExpressionParser parser = new SpelExpressionParser();
        //spel上下文
        EvaluationContext context = new StandardEvaluationContext();
        for (int i = 0; i < parameterNames.length; i++) {
            context.setVariable(parameterNames[i], values[i]);
        }
        Expression expression = parser.parseExpression(key);
        Object value = expression.getValue(context);
        if (value != null) {
            if (value instanceof List) {
                List value1 = (List) value;
                for (Object o : value1) {
                    addKeys(keys, o, keyConstant);
                }
            } else if (value.getClass().isArray()) {
                Object[] obj = (Object[]) value;
                for (Object o : obj) {
                    addKeys(keys, o, keyConstant);
                }
            } else {
                addKeys(keys, value, keyConstant);
            }
        }
        log.info("表达式key={},value={}", key, keys);
        return keys;
    }

    private void addKeys(List<String> keys, Object o, String keyConstant) {
        keys.add("redis:lock:" + o.toString() + keyConstant);
    }
}

```

#### 代码解释

##### `getValueBySpEL` 方法

- **目的**: 该方法主要用于解析传入的SpEL表达式，并根据表达式的计算结果生成一个或多个锁的键值。这些键值随后可用于分布式锁的获取与释放操作，确保操作的安全性和幂等性。
- **参数**:
  - `key`: 字符串类型，包含SpEL表达式，可能直接是一个字符串键值或者以`#`开头的表达式，如`#orderId`，用于引用方法参数。
  - `parameterNames`: 字符串数组，表示被拦截方法的参数名。
  - `values`: 对象数组，对应方法的实际参数值。
  - `keyConstant`: 字符串常量，用于在最终生成的锁键中添加一个固定的后缀。
- **流程**:
  1. **检查直接键值**: 如果`key`不包含`#`，说明是一个直接的键值，直接加上`keyConstant`后缀构造锁键并返回。
  2. **初始化SpEL解析环境**: 创建`ExpressionParser`和`EvaluationContext`，并将方法参数绑定到上下文中。
  3. **解析SpEL表达式**: 使用`parser`解析`key`中的SpEL表达式，并在给定的`context`中求值。
  4. **处理表达式结果**: 根据表达式计算得到的`value`类型（可能是单个值、列表或数组），遍历并调用`addKeys`方法为每个元素添加锁键。
  5. **记录和返回**: 打印日志并返回生成的所有锁键列表。

##### `addKeys` 方法

- **辅助功能**: 这是一个私有方法，用于向锁键列表`keys`中添加元素。它接收一个对象`o`和一个常量`keyConstant`，构造锁键（格式为`redis:lock:` + `o.toString()` + `keyConstant`）并将其加入到`keys`列表中。

## 总结

@JRepeat 注解是 jeecg-boot 中一个强大且简洁的工具，可以有效防止重复提交，提升应用的可靠性和用户体验。通过简单的注解和拦截配置，即可轻松实现重复提交拦截功能。如果你在实际使用中遇到任何问题或有更多的需求，可以根据具体情况调整缓存逻辑或配置，以适应你的应用场景。

希望这篇博客能帮助你更好地理解和使用 @JRepeat 注解来防止重复提交。如果你有任何疑问或需要进一步的帮助，请随时留言讨论。
