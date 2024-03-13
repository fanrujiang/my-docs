---
title: Springboot 原理篇
date: 2024-03-13 18:26:47
icon: /img/spring.svg
category: Spring
tags:
  - Spring
---

# Springboot 原理篇


# 1 springboot的自动配置原理【重点】

### 【目标】

掌握springboot自动配置原理

### 【路径】

1：RedisTemplate分析引入

2：自定义类实现自动配置

3：需求优化

### 【讲解】

在我们使用springboot的时候，能带来的方便性和便利性，不需要配置便可以实现相关的使用，开发效率极大的提升，那么实际上，springboot本身的基础依赖中封装了许许多多的配置帮我们自动完成了配置了。那么它是如何实现的呢？

## 1.1 Condition接口Conditional注解

​	讲Springboot自动配置，逃不开ConditionalOnxxx等等注解，也逃不开condition接口所定义的功能。

### 1.1.1 condition接口

​	condition接口是spring4之后提供给了的接口，增加条件判断功能，用于选择性的创建Bean对象到spring容器中。

思考一个问题 ?

​	我们之前用过springboot整合redis 实现的步骤：就是添加redis起步依赖之后，直接就可以使用从spring容器中获取注入RedisTemplate对象了，而不需要创建该对象放到spring容器中了.意味着Spring boot redis的起步依赖已经能自动的创建该redisTemplate对象加入到spring容器中了。这里应用的重要的一个点就是condition的应用。

我们来演示下，是否加入依赖就可以获取redisTemplate,不加依赖就不会获取到redisTemplate

#### 1.1.1.1 RedisTemplate分析

演示步骤：

```
1.创建maven工程
2.加入依赖
3.创建启动类
4.获取restTemplate的bean对象
```

（1）创建工程添加依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>itheima-springboot-demo01-condition</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <!--加入springboot的starter起步依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>


</project>
```

(2)com.itheima下创建启动类

```java
package com.itheima;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class MySpringBootApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(MySpringBootApplication.class, args);
        Object redisTemplate = context.getBean("redisTemplate");
        System.out.println(redisTemplate);
    }
}
```

(3)启动main方法，查看效果

![1583138681364](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583138681364-1710323726715-1.png)

(4)注释依赖则报错：

![1583138756611](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583138756611-1710323726715-2.png)

![1583138775576](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583138775576-1710323726716-3.png)

#### 1.1.1.2 自定义实现类

刚才看到的效果，那么它到底是如何实现的呢？我们现在给一个需求：

```
@ConditionalOnClass(RedisOperations.class)
如果引入redis的坐标（包含RedisOperations.class）,就会执行RedisAutoConfiguration配置类，@Bean就会创建RedisTemplate对象
```

(1)需求

​	在spring容器中有一个user的bean对象，如果导入了redisclient(jedis)的坐标则注册该bean，如果没有导入则不注册该bean.

@ConditionalOnClass(RedisOperations.class) => @Conditional(condition)

如果导入了redisclient的坐标, 创建user的bean对象

(2)实现步骤：

```properties
1.定义一个类来实现接口condition
2.实现方法 判断是否有Jedis类字节码对象，有则返回true 没有则返回false
3.定义一个User的pojo
4.定义一个配置类用于创建user对象交给spring容器管理 @Confiuration(@Bean) = application.xml(<bean>)
5.修改加入注解@conditional(value=Condition实现类)
6.测试打印
```

(3)创建POJO

```JAVA
public class User {
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
```

(4)创建condition的接口实现类

```java
public class MyCondition implements Condition {
    /**
     * 返回true 则满足条件  返回false 则不满足条件
     *
     * @param context  上下文信息对象 可以获取环境的信息 和容器工程 和类加载器对象
     * @param metadata 注解的元数据 获取注解的属性信息
     * @return
     */
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {

        //1.获取当前的redis的类字节码对象
        try {
            //2.加载成功则说明存在 redis的依赖 返回true，
            Class.forName("redis.clients.jedis.Jedis");
            return true;
        } catch (ClassNotFoundException e) {
            // 如果加载不成功则redis依赖不存在 返回false
            e.printStackTrace();
            return false;
        }
    }
}
```

(5) 定义配置类 在com.itheima.config下

```java
package com.itheima.config;

import com.itheima.condition.MyCondition;
import com.itheima.pojo.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserConfig {

    @Bean
    //conditinal 用于指定当某一个条件满足并返回true时则执行该方法创建bean交给spring容器
    @Conditional(value = MyCondition.class)
    public User user() {
        return new User();
    }
}
```

解释：

```properties
@Conditional(value = MyCondition.class) 当符合指定类的条件返回true的时候则执行被修饰的方法，放入spring容器中。
```

(6)测试：

+ 加入jedis的依赖时：

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.2.0</version>
</dependency>
```

![1583140031840](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583140031840-1710323726716-4.png)

+ 不加入jedis的依赖时：

![1583140076596](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583140076596-1710323726716-5.png)

#### 1.1.1.3 小结

我们由上边的看出。由于有了条件接口，那么我们可以选择性的在某种条件下才进行bean的注册和初始化等操作。他的接口的说明也描述了这有点；

![1583140248012](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583140248012-1710323726716-6.png)

### 1.1.2 需求优化

​	我们希望这个类注解可以进行动态的加载某一个类的全路径，不能写死为redis.将来可以进行重用。

（1）需求：

```properties
1.可以自定义一个注解 用于指定具体的类全路径 表示有该类在类路径下时才执行注册
2.在配置类中使用该自定义注解 动态的指定类路径
3.在条件的实现类中进行动态的获取并加载类即可
```

(2)实现步骤

```
1.自定义注解
2.配置类使用注解
3.条件实现类中修改方法实现
```

(3) com.itheima.annotation下自定义注解：

```java
package com.itheima.annotation;

import com.itheima.condition.OnClassCondition;
import org.springframework.context.annotation.Conditional;

import java.lang.annotation.*;

@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Conditional(MyCondition.class)
public @interface MyConditionalOnClass {
    /**
     * 指定所有的类全路径的字符数组
     * @return
     */
    String[] name() default {};
}

```

(4)修改配置类

```java
@Configuration
public class UserConfig {

    @Bean
    //conditinal 用于指定当某一个条件满足并返回true时则执行该方法创建bean交给spring容器
    @MyConditionalOnClass(name = "redis.clients.jedis.Jedis")
    public User user() {
        return new User();
    }
}
```

如下图：

 ![image-20210426103112067](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/image-20210426103112067-1710323726716-7.png)



（5）修改实现类

```java
public class MyCondition implements Condition {
    /**
     * 返回true 则满足条件  返回false 则不满足条件
     *
     * @param context  上下文信息对象 可以获取环境的信息 和容器工程 和类加载器对象
     * @param metadata 注解的元数据 获取注解的属性信息
     * @return
     */
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {

        //1.获取当前的redis的类字节码对象
        /*try {
            //2.加载成功则说明存在 redis的依赖 返回true，
            Class.forName("redis.clients.jedis.Jedis");
            return true;
        } catch (ClassNotFoundException e) {
            // 如果加载不成功则redis依赖不存在 返回false
            e.printStackTrace();
            return false;
        }*/
        //获取注解的信息
        Map<String, Object> annotationAttributes = metadata.getAnnotationAttributes(MyConditionalOnClass.class.getName());
        //获取注解中的name的方法的数据值
        String[] values = (String[]) annotationAttributes.get("name");
        for (String value : values) {
            try {
                Class.forName(value);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }
}
```

### 1.1.3 相关的条件的注解说明

常用的注解如下：

```
ConditionalOnBean   当spring容器中有某一个bean时使用
ConditionalOnClass  当判断当前类路径下有某一个类时使用
ConditionalOnMissingBean 当spring容器中没有某一个bean时才使用
ConditionalOnMissingClass 当当前类路径下没有某一个类的时候才使用
ConditionalOnProperty 当配置文件中有某一个key value的时候才使用
....
```

![1583147249708](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583147249708-1710323726716-8.png) 

### 小结

1. Condtional注解：标记是否要注册bean对spring容器，看它的属性中的value中的Condtion接口实现类的matches方法，如果返回true，则注册，否则不注册
2. Condtion接口：判断是否满足条件，实现matches方法。



## 1.2. 切换内置的web服务器

我们知道在springboot启动的时候如果我们使用web起步依赖，那么我们默认就加载了tomcat的类嵌入了tomcat了，不需要额外再找tomcat。

加载配置tomcat的原理：

（1）加入pom.xml中起步依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

(2)查看依赖图

web起步依赖依赖于spring-boot-starter-tomcat，这个为嵌入式的tomcat的包。

![1583151926451](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583151926451-1710323726716-9.png)



（3）自动配置类说明：

![1583152113593](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583152113593-1710323726716-10.png) 

![1583152191247](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583152191247-1710323726716-11.png)

以上如图所示：

```properties
web容器有4种类型：
+ tomcat容器
+ jetty
+ netty
+ undertow 
默认spring-boot-starter-web加入的是tomcat ,所以根据上图配置，会配置tomcat作为web容器
```

启动时如下：

![1583152442301](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583152442301-1710323726716-12.png)

(4)可以尝试修改web容器：

​	如上，我们可以通过修改web容器，根据业务需求使用性能更优越的等等其他的web容器。这里我们演示使用jetty作为web容器。

在pom.xml中排出tomcat依赖，添加jetty依赖即可：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <artifactId>spring-boot-starter-tomcat</artifactId>
            <groupId>org.springframework.boot</groupId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

再次启动如下图所示：

![1583152603491](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583152603491-1710323726716-13.png)

## 1.3. @SpringBootApplication注解说明

在我们使用的代码当中，其中启动类中有一个注解：

@SpringBootApplication注解里面有@EnableAutoConfiguration，那么这种@Enable*开头就是springboot中定义的一些动态启用某些功能的注解，他的底层实现原理实际上用的就是@import注解导入一些配置，自动进行配置，加载Bean.

那么我们自己定义写Eanble相关的注解来学习下这种注解所实现的功能，以下 来实现相关功能。

### 1.3.1 @SpringbootConfiguration

![1583154950615](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583154950615-1710323726716-14.png)

如上图所示，就是该注解实际上是在启动类上的注解中的一个注解，我们再点击进去：

![1583154995273](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583154995273-1710323726716-15.png) 

我们发现其实该注解就是一个@configuration注解，那么意味着我们的启动类被注解修饰后，意味着它本身也是一个配置类,该配置类就可以当做spring中的applicationContext.xml的文件，用于加载配置使用。

### 1.3.2 @ComponentScan注解

![1583155076125](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583155076125-1710323726716-16.png)



如上图，在启动类的注解@springbootapplication注解里面又修饰了@compnetScan注解，该注解的作用用于组件扫描包类似于xml中的context-componet-scan，如果不指定扫描路径，那么就扫描该注解修饰的启动类所在的包以及子包。这就是为什么我们在第一天的时候写了controller 并没有扫描也能使用的原因。

### 1.3.3. 实现加载第三方的Bean方式

#### 1.3.3.1. 创建两个测试工程

需求：

```properties
1.定义两个工程demo2(只有启动类) demo3 demo3中有bean
2.demo2依赖了demo3 
3.我们希望demo2直接获取加载demo3中的bean
```

(1) 定义工程：demo2

pom.xml:只加入springbootstarter

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>itheima-springboot-demo02-enable</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
      
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

(2)在包com.itheima下定义demo2启动类，并加载第三方的依赖中的bean

```java
package com.itheima;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;


@SpringBootApplication
public class DemoEnable2Application {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(DemoEnable2Application.class, args);
        //获取加载第三方的依赖中的bean
        Object user = context.getBean("user");
        System.out.println(user);
    }
}
```

工程结构如下：

![1583155446515](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583155446515-1710323726716-17.png) 



(3)定义工程demo3

pom.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>itheima-springboot-demo03-enable</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
    </dependencies>

</project>
```

(4) 在demo3工程中定义配置类和POJO

pojo:在com.itheima.pojo下创建

```java
public class User {

}
```



配置类：【**注意**】，在com.config下创建配置类：

```java
@Configuration
public class UserConfig {

    @Bean
    public User user(){
        return new User();
    }
}
```

【注意】demo03工程要执行install安装到本地仓库

(5)修改demo2工程的pom.xml:加入demo3的依赖如下图所示：

![1583155780174](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583155780174-1710323726716-18.png)



（6）启动测试：发现报错：

![1583155959293](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583155959293-1710323726716-19.png)

#### 1.3.3.2. 包扫描路径放大

方式一：第一种使用组件扫描 包扫描路径放大

在demo2启动类上修改

```java
@ComponentScan(basePackages = "com")


打印所有spring容器bean对象
String[] beanDefinitionNames = context.getBeanDefinitionNames();
 for (String beanDefinitionName : beanDefinitionNames) {
     System.out.println(beanDefinitionName);
 }
```

#### 1.3.3.3. import注解

方式二：第二种使用import注解进行导入配置类的方式即可

- 直接导入Bean
- 导入配置类
- 导入ImportSelector的实现类，通常用于加载配置文件中的Bean
- 导入ImportBeanDefinitionRegistrar实现类

##### 1.3.3.3.1. 导入配置类

![1583156064706](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583156064706-1710323726716-20.png)

![1583156241861](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583156241861-1710323726716-21.png)

##### 1.3.3.3.2. ImportSelector

在demo3工程中定义类

```java
package com.config;

public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        //返回要注册到spring容器中的Bean的全路径
        return new String[]{"com.pojo.Role", "com.pojo.User"};
    }
}
```

定义POJO:

```java
package com.itheima.pojo;

public class Role {
    
}
```

在demo2中修改导入：

![1583157601958](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583157601958-1710323726716-22.png)

打印：

![1583157619081](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583157619081-1710323726716-23.png)

##### 1.3.3.3.3. ImportBeanDefinitionRegistrar

（1）在demo3下定义实现类

```java
package com.config;
import com.itheima.pojo.User;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;


public class MyImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        //创建BeanDefiniation
        AbstractBeanDefinition beanDefinition = BeanDefinitionBuilder.rootBeanDefinition(User.class).getBeanDefinition();
        //注册bean 目前只注册User
        registry.registerBeanDefinition("user",beanDefinition);
    }
}
```

（2）修改demo2的启动类配置：

![1583158084602](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158084602-1710323726716-24.png)

```java
@SpringBootApplication
//@ComponentScan("com")
//@Import(UserConfig.class)
//@EnableUser
//@Import(MyImportSelector.class)
@Import(MyImportBeanDefinitionRegistrar.class)
public class DemoEnable2Application {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(DemoEnable2Application.class, args);
        //获取加载第三方的依赖中的bean
//        Object user = context.getBean("user");
        User user = context.getBean(User.class);
        System.out.println(user);
        Role role = context.getBean(Role.class);
        System.out.println(role);
    }
}
```

如上图所示也能成功，针对User成功，针对Role失败，这里我们只加载了User.

### 1.3.4. 自定义注解加载bean

方式三：第三种自定义注解加载bean

上一节中我们使用了import和Component扫描的方式，都可以解决问题，但是这两种方式相对要麻烦一些，不那么优雅，而且类多那么容易编写麻烦，能否有一种一个注解就能搞定，一看就明白的方式呢？答案是肯定的。

（1）在demo03中com.config下创建一个自定义注解@EnableUser：

```java
package com.config;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(UserConfig.class)
public @interface EnableUser {
    
}
```

（2）在demo2中使用该注解即可

![1583156638701](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583156638701-1710323726716-25.png)

如上一目了然，当然这里面用的功能点不在于自定义的注解，而在于import的注解。

## 1.4 @EnableAutoConfiguration

自动配置流程：

```
1.@import注解 导入配置
2.selectImports导入类中的方法中加载配置返回Bean定义的字符数组
3.加载META-INF/spring.factories 中获取Bean定义的全路径名返回
4.最终返回回去即可
```

流程截图：

![1583158758976](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158758976-1710323726716-26.png)



![1583158780822](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158780822-1710323726717-27.png)



![1583158795454](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158795454-1710323726717-28.png)

![1583158810650](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158810650-1710323726717-29.png)

![1583158829063](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158829063-1710323726717-30.png)



![1583158874947](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158874947-1710323726717-31.png)



其中就有：redis的自动配置类，redis的自动配置我们在说codition的时候已经说过只要加入依赖则配置交到spring容器中自动配置了。

![1583158918790](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583158918790-1710323726717-32.png)

### 【小结】

1：理解springboot自动配置原理

2：理解自动配置注解的原理解析  SPI（Service Provider Interface）通过读取jar下某个特定目录下的配置文件来加载类

```properties
  1.启动类启动时，类上有个注解@SpringBootApplication, 里头有@EnableAutoConfiguration
  2.加载@EnableAutoConfiguration注解时，找所有jar下的META-INF/spring.factories文件，读取它们
  3.读取所有的EnableAutoConfiguration配置项的值
  4.过滤后，加载剩下的XXXAutoConfiguration 全量类名的字符串
  5. XXXAutoConfiguration类中的注解@Conditional与Condition执行, 是否去注册bean对象,条件满足则注册
  6.使用时，就可以直接@Resource注入
  默认配置项的值：
  1. ConfigurationProperties 类中的属性初始化值
  2. MEATA-INF/additional-spring-configuration-metadata.json 配置
```



# 2.Springboot自动配置 自定义starter【使用】

### 【目标】

自定义配置案例实现

### 【路径】

1：自定义起步依赖需求分析

2：自定义起步依赖功能实现

@EnableAutoConfiguration： 加载jar下的META-INF/spring.factories: org.springframework....EnableAutoConfiguration=自定义的自动配置类

Condition接口，定义是否加载bean对象, ConditionOnClass

### 【讲解】

以上我们学习了springboot的自动配置原理，那么我们通过一个案例来强化我们的学习。

## 2.1. 需求说明

​	当加入redis客户端的坐标的时候，自动配置jedis的bean 加载到spring容器中。

## 2.2. 实现步骤

我们可以参考springboot整合mybatis的依赖进行配置实现。为了简单起见我们只定义一个工程即可。

xxx-spring-boot-starter 第三方封装,如: mybatisplus-spring-boot-starter

spring-boot-starter-xxx Spring官方封装的

```properties
1.创建工程 itheima-redis-springboot-starter 用作起步依赖
2.添加依赖
3.创建自动配置类和POJO(jedis配制信息 host, port)
4.创建工程 itheima-test-starter 用于测试使用
```



### 2.2.1. 创建工程itheima-redis-springboot-starter

该工程创建不需要启动类，不需要测试类，只需要spring-boot-starter以及jedis的依赖坐标。

项目结构如下：

 ![image-20210426145830640](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/image-20210426145830640-1710323726717-33.png) 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>itheima-redis-springboot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <!--springboot的starter-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <!--redis的依赖jedis-->
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>3.2.0</version>
        </dependency>
    </dependencies>

</project>
```



### 2.2.2. 创建自动配置类

```java
@Configuration
@EnableConfigurationProperties(RedisProperties.class)
@ConditionalOnClass(Jedis.class)
public class MyRedisAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(name = "jedis")
    public Jedis jedis(MyRedisProperties redisProperties) {
        System.out.println("哈哈哈哈=====" + redisProperties.getHost() + ":" + redisProperties.getPort());
        return new Jedis(redisProperties.getHost(), redisProperties.getPort());
    }
}
```

### 2.2.3. 创建POJO

```java
@ConfigurationProperties(prefix = "redis")
public class MyRedisProperties {
    private String host = "localhost";//给与默认值
    private Integer port = 6379;//给与默认值

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }
}
```

### 2.2.4. 创建spring.factories【注意】

在resources下创建META-INF/spring.factories文件并定义内容如下：

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.itheima.redis.config.MyRedisAutoConfiguration
```

### 2.2.5. 创建测试工程

创建测试工程itheima-test-starter，添加依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>itheima-test-starter</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <!--springboot的起步依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <!--加入itheima的redis的起步依赖-->
        <dependency>
            <groupId>com.itheima</groupId>
            <artifactId>itheima-redis-springboot-starter</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>
</project>
```



![1583226081654](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583226081654-1710323726717-34.png)

(2)定义启动类

```java
package com.itheima;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import redis.clients.jedis.Jedis;

@SpringBootApplication
public class ItheimaRedisTestApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext applicationContext = SpringApplication.run(ItheimaRedisTestApplication.class, args);
        Object jedis = applicationContext.getBean("jedis");
        System.out.println(jedis);
    }

    //@Bean
    public Jedis jedis(){
        return new Jedis("localhost",6379);
    }
}
```

(3)配置application.yml:

```yaml
redis:
  port: 6666
  host: localhost
```

(4)测试：

（1）注释掉则出现如下结果

![1583226319665](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583226319665-1710323726717-35.png)

（2）不注释掉出现如下结果：

![1583226370095](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583226370095-1710323726717-36.png)

### 【小结】

1：掌握自定义springboot的starter

步骤：

1. 创建工程，添加依赖（parent, starter, jedis)

2. 创建MyRedisProperties, 注解@ConfigurationProperties(prefix=redis), 添加2个属性host,port【注意添加getter与setter】

3. 创建MyRedisAutoConfiguration,添加注解：@Configuration, @ConditionOnClass(Jedis.class), @EnableConfigurationProperties(MyRedisProperties.class)

   * 添加@Bean, @ConidtionOnMissingBean("jedis"), 方法有参数(MyRedisProperties) 创建jedis对象

4. resoures下创建META-INF/spring.factories,内容如下

   ```properties
   org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
   com.itheima.redis.config.MyRedisAutoConfiguration
   ```

5. 进行clean与安装

# 3. SpringBoot的监控【了解】

### 【目标】

springboot监控介绍

### 【路径】

1：创建监听工程

2：监控路径了解

### 【讲解】

时常我们在使用的项目的时候，想知道相关项目的一些参数和调用状态，而SpringBoot自带监控功能Actuator，可以帮助实现对程序内部运行情况监控，比如监控状况、Bean加载情况、配置属性、日志信息等。

## 3.1. Actuator

​	Actuator是springboot自带的组件可以用来进行监控，Bean加载情况、环境变量、日志信息、线程信息等等，使用简单

### 3.1.1. 使用actuator

(1)操作步骤：

```
1.创建springboot工程
2.添加Actuator的起步依赖
3.配置开启端点和相关配置项
4.通过端口路径查看信息 http://localhost:端口/路径
```

#### 3.1.1.1. 创建工程添加依赖

pom.xml添加依赖如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>my-springboot-actuator</artifactId>
    <version>1.0-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

#### 3.1.1.2. 编写启动类：

```java
package com.itheima;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class ItheimaActuatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(ItheimaActuatorApplication.class, args);
    }

    @RestController
    @RequestMapping("/test")
    class TestController {
        @GetMapping("/index")
        public String show() {
            return "hello world";
        }
    }
}
```

#### 3.1.1.3. application.properties

```properties
# 配置健康端点开启所有详情信息
management.endpoint.health.show-details=always 
# 设置开放所有web相关的端点信息
management.endpoints.web.exposure.include=*
# 设置info前缀的信息设置
info.name=zhangsan
info.age=18
```

#### 3.1.1.4. 测试

在浏览器输入 地址：`http://localhost:8080/actuator`

 ![1583320454547](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583320454547-1710323726717-37.png)

显示如上的信息，就可以看到相关的路径，这些路径分表代表不同的信息的含义。

### 3.1.2 监控路径列表说明

以下展示部分列表

| **路径**        | **描述**                                                     |
| --------------- | ------------------------------------------------------------ |
| /beans          | 描述应用程序上下文里全部的Bean，以及它们的关系               |
| /env            | 获取全部环境属性                                             |
| /env/{name}     | 根据名称获取特定的环境属性值                                 |
| /health         | 报告应用程序的健康指标，这些值由HealthIndicator的实现类提供  |
| /info           | 获取应用程序的定制信息，这些信息由info打头的属性提供         |
| /mappings       | 描述全部的URI路径，以及它们和控制器(包含Actuator端点)的映射关系 |
| /metrics        | 报告各种应用程序度量信息，比如内存用量和HTTP请求计数         |
| /metrics/{name} | 报告指定名称的应用程序度量值                                 |
| /trace          | 提供基本的HTTP请求跟踪信息(时间戳、HTTP头等)                 |

## 3.2  SpringBoot admin

如果使用actuator使用起来比较费劲，没有数据直观感受。

### 3.2.1 介绍

- Spring Boot Admin是一个开源社区项目，用于管理和监控SpringBoot应用程序。 
- Spring Boot Admin 有两个角色，客户端(Client)和服务端(Server)。
- 应用程序作为Spring Boot Admin Client向为Spring Boot Admin Server注册
- Spring Boot Admin Server 通过图形化界面方式展示Spring Boot Admin Client的监控信息。



### 3.2.2 使用 

spring boot admin的架构角色

+ admin server 用于收集统计所有相关client的注册过来的信息进行汇总展示
+ admin client 每一个springboot工程都是一个client 相关的功能展示需要汇总到注册汇总到server

![1583320990670](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583320990670-1710323726717-38.png)

#### 3.2.2.1. 创建admin server

创建admin server 工程my-springboot-admin-server

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>my-springboot-admin-server</artifactId>
    <version>1.0-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>
    <properties>
        <spring-boot-admin.version>2.1.0</spring-boot-admin.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-starter-server</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>


        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>de.codecentric</groupId>
                <artifactId>spring-boot-admin-dependencies</artifactId>
                <version>${spring-boot-admin.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 3.2.2.2. 创建启动类

```java
@SpringBootApplication
@EnableAdminServer
public class IthimaAdminServerApplication {
   public static void main(String[] args) {
      SpringApplication.run(IthimaAdminServerApplication.class, args);
   }
}
```

注意：

@EnableAdminServer 该注解用于启用Server功能。

#### 3.2.2.3. 修改application.properties文件

```properties
server.port=9000
```

#### 3.2.2.4. 创建admin client

创建admin client 工程my-springboot-admin-client

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.itheima</groupId>
    <artifactId>my-springboot-admin-client</artifactId>
    <version>1.0-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>
    <properties>
        <spring-boot-admin.version>2.1.0</spring-boot-admin.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-starter-client</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>de.codecentric</groupId>
                <artifactId>spring-boot-admin-dependencies</artifactId>
                <version>${spring-boot-admin.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 3.2.2.5. 创建启动类

```java
package com.itheima;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class ItheimaAdminClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(ItheimaAdminClientApplication.class, args);
    }

    @RestController
    @RequestMapping("/user")
    class TestController {

        @RequestMapping("/findAll")
        public String a() {
            return "aaaa";
        }
    }
}
```

#### 3.2.2.6. application.properties

```properties
# 配置注册到的admin server的地址
spring.boot.admin.client.url=http://localhost:9000
# 启用健康检查 默认就是true
management.endpoint.health.enabled=true
# 配置显示所有的监控详情
management.endpoint.health.show-details=always
# 开放所有端点
management.endpoints.web.exposure.include=*
# 设置系统的名称
spring.application.name=abc
```

#### 3.2.2.7. 测试

启动两个系统。访问路径`<http://localhost:9000/>`

![1583324031320](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583324031320-1710323726717-39.png)

我们简单认识下：并点击相关界面链接就能看到相关的图形化展示了。

![1583324107358](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583324107358-1710323726717-40.png)

### 【小结】

了解SpringBoot监控

# 4.SpringBoot部署项目【掌握】

### 【目标】

springboot部署项目

### 【路径】

1：掌握Jar包部署

2：了解war包部署

### 【讲解】

在springboot项目中，我们部署项目有两种方式：

+ jar包直接通过java命令运行执行
+ war包存储在tomcat等servlet容器中执行



## 4.1. jar包部署

### 4.1.1. 创建工程

引入 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>itheima-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    <build>
        <finalName>app.jar</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

### 4.1.2. 创建启动类

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
    @RestController
    class TestController{

        @RequestMapping("/hello")
        public String hello(){
            return "hello";
        }
    }
}
```

### 4.1.3. 打jar包

![1583325158207](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583325158207-1710323726717-41.png)

### 4.1.4. 启动工程

copy jar包到任意目录，可以直接执行java命令执行系统

![1583325211768](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583325211768-1710323726717-42.png) 

执行命令：如下图

![1583325273569](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583325273569-1710323726717-43.png)



```
nohup java -jar itheima-demo-1.0-SNAPSHOT.jar
```

执行效果如下：

![1583325424494](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583325424494-1710323726717-44.png)

### 4.1.5. 测试

浏览器输入地址测试即可：

![1583326360780](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583326360780-1710323726717-45.png) 

## 4.2 war包部署

### 4.2.1. 创建工程

首先修改打包方式和修改相关配置依赖

![1583325459873](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583325459873-1710323726717-46.png) 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>itheima-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-tomcat</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
    <build>
        <finalName>demo</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

### 4.2.2. 创建启动类

修改启动类配置 需要继承SpringBootServletInitializer

```java
@SpringBootApplication
public class DemoApplication extends SpringBootServletInitializer{
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @RestController
    class TestController{

        @RequestMapping("/hello")
        public String hello(){
            return "hello";
        }
    }
}
```

### 4.2.3. 打war包

执行命令 打包 之后变成一个war包

![1583326278301](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583326278301-1710323726717-47.png)

### 4.2.4. 启动工程

copy该war包到tomcat中

这个tomcat大家自己找一个自己熟悉的，最好是tomcat8.5以上。

![1583326312074](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583326312074-1710323726717-48.png)

### 4.2.5. 测试

浏览器输入地址测试即可：

![1583326360780](SpringBoot%E5%8E%9F%E7%90%86%E7%AF%87/1583326360780-1710323726717-45.png) 

### 【小结】

推荐使用jar ，特别在微服务领域中使用jar的方式简单许多。

1：掌握Jar包部署

2：了解war包部署

* 依赖
  * 排除内置的web服务器tomcat
  * 引入servlet-api
* 启动类继承SpringBootServletInitializer
* pom.xml修改packing为war

# 5 Springboot监听机制（了解）

### 【目标】

了解springboot监听机制

### 【路径】

1：springboot监听机制了解

2：springboot初始化的Run了解

### 【讲解】

## 5.1. springboot监听机制介绍

​	springboot事件监听机制，实际上是对java的事件的封装。

java中定义了以下几个角色：

+ 事件 Event
+ 事件源 Source
+ 监听器 Listener 实现EventListener接口的对象

Springboot在启动的时候，会对几个监听器进行回调，完成初始化的一些操作，我们可以实现这个监听器来实现相关的业务，比如缓存的一些处理。springboot 提供了这些接口，我们只需要实现这些接口就可以在启动的时候进行回调了。

```properties
ApplicationContextInitializer:在spring 在刷新之前 调用该接口的方法 
	作用：做些初始化工作  通常用于web环境，用于激活配置，web上下问的属性注册。 
	注意：需要配置META-INF/spring.factories 配置之后才能加载调用
	
SpringApplicationRunListener:SpringApplication run方法的监听器，当我们使用 SpringApplication调用Run方法的时候触发该监听器回调方法   ContextLoaderListener
     注意：也需要配置META-INF/spring.factories 配置之后才能加载调用
          需要有一个公共的构造函数，并且每一次RUN的时候都需要重新创建实例
	
CommandLineRunner:在容器准备好了之后可以回调   @componet修饰即可

ApplicationRunner:在容器准备好了之后可以回调   @componet修饰即可
```



