---
title: APP一键登录-服务端集成
date: 2024-05-08 16:20:19
tags: 
- 技术分享
categories:
- 技术分享
head:
  - - meta
    - name: keywords
      content: 一键登录
---



## APP一键登录-服务端集成

该篇 blog 主要记录笔者实现 app手机号一键登录 功能，集成的是阿里云号码认证服务，主要简单记录一下实现的过程：

![一键登录.png](APP%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%9B%86%E6%88%90/p687611.png)

在记录一键登录实现逻辑之前，你应该了解一下阿里的`认证方案`、`一键登录`和`本机号校验`:

- [认证方案](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F405281.html)
- [GetMobile - 一键登录取号](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F405286.html)
- [VerifyMobile - 本机号码校验认证](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F405287.html)

## 前提条件

- 您已注册阿里云账号。更多信息，请参见 [阿里云账号注册流程](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F37195.html%23concept-gpr-axx-wdb)。
- 您的阿里云账号已通过企业实名认证或个人实名认证。更多信息，请参见 [企业实名认证](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F37172.html%23concept-gpr-3bx-wdb) 或 [个人实名认证](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F48263.html)。

## 整体实现流程

### 步骤一：开通号码认证服务

1. 访问[号码认证服务产品详情页](https://link.juejin.cn?target=https%3A%2F%2Fwww.aliyun.com%2Fproduct%2Fdypns%3Fspm%3Da2c4g.11186623.0.0.2d7b1071pn3g3K)。
2. 单击立即开通或访问产品控制台。
3. 进入控制台首页，勾选我已阅读并同意《号码认证服务协议》。
4. 单击立即开通，完成产品开通。![开通号码认证-框](APP%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%9B%86%E6%88%90/1fe4dc3162dc4877bc784cee8d37a8d7tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

### 步骤二：添加认证方案

具体操作，请参见 [认证方案管理](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F381012.htm%23task-2164806)。

**认证方案管理**：

认证方案用于标识`App`下的认证场景，一般`一个认证方案对应一个App包名/包签名或者BundleId`。系统调用过程中需要使用对应的方案Code。本文为您介绍如何添加认证方案、修改相关配置如认证方式，以及删除认证方案。

1. 登录[号码认证产品控制台](https://link.juejin.cn?target=https%3A%2F%2Fdypns.console.aliyun.com%2F%3Fspm%3D5176.20967111.J_5834642020.4.28e32fdazkYFYk%23%2Foverview)。

2. 在左侧导航栏上，选择号码认证服务 > 认证方案管理。

3. 根据相应功能填写信息，添加认证方案。

   - 一键登录和本机号码校验、活体认证、短信认证：

     1. 选择iOS或Android页签，再单击+添加认证方案。![认证方案管理](APP%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%9B%86%E6%88%90/a4eed8763a244cca8ff85088902d4d88tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

     2. 填写方案名称、App名称等信息。Android操作系统需要填写应用包名及包签名，iOS操作系统需要填写BundleID。

        短信认证功能还需在认证方式一栏勾选短信验证码，绑定对应签名。建议使用您的App名称作为签名，提高签名审核通过率。若需要添加新的签名，可单击创建签名。若没有可用的短信签名，可绑定赠送的签名进行测试，待正式签名审核通过后再修改绑定签名，详情请参见[修改方案配置](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F381012.htm%3Fspm%3Da2c4g.11186623.0.0.50061071yu38Zf%23section-86a-e3a-tgp)。

        **

        **说明** 方案名称和App名称建议输入实际上线的App名称。

        ![多个功能认证方案-框](APP%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%9B%86%E6%88%90/12bf8354ba8d4aff9057b58914b70a34tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

## 代码逻辑实现

### pom依赖

```xml
<dependency> 
    <groupId>com.aliyun</groupId> 
    <artifactId>dypnsapi20170525</artifactId> 
    <version>1.0.2</version> 
</dependency>
```

### 核心接口

```java
    /**
     * 调用GetMobile完成一键登录取号
     *
     * @param accessToken APP端SDK获取的登录token，必填
     * @param outId       外部流水号，非必填
     **/
    GetMobileResponse getMobile(String accessToken, String outId);

    /**
     * 调用verifyMobile完成本机号码校验认证
     *
     * @param accessCode  APP端SDK获取的登录token，必填
     * @param phoneNumber 手机号，必填
     * @param outId       外部流水号，非必填
     **/
    VerifyMobileResponse verifyMobile(String accessCode, String phoneNumber, String outId);
```

### 接口实现类

```java
    /**
     * 使用AK&SK初始化账号Client
     **/
    public static com.aliyun.dypnsapi20170525.Client createClient() throws Exception {
        StaticConfig staticConfig = new StaticConfig();
        Config config = new Config()
                .setAccessKeyId(staticConfig.getAccessKeyId())
                .setAccessKeySecret(staticConfig.getAccessKeySecret());
        // 访问的域名
        config.endpoint = "dypnsapi.aliyuncs.com";
        return new com.aliyun.dypnsapi20170525.Client(config);
    }


    /**
     * 调用GetMobile完成一键登录取号
     *
     * @param accessToken APP端SDK获取的登录token，必填
     * @param outId       外部流水号，非必填
     **/
    @Override
    public GetMobileResponse getMobile(String accessToken, String outId) {
        com.aliyun.dypnsapi20170525.Client client;
        GetMobileResponse response;
        try {
            client = createClient();
            GetMobileRequest mobileRequest = new GetMobileRequest();
            mobileRequest.setAccessToken(accessToken);
            mobileRequest.setOutId(outId);
            response = client.getMobile(mobileRequest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    /**
     * 调用verifyMobile完成本机号码校验认证
     *
     * @param accessCode  APP端SDK获取的登录token，必填
     * @param phoneNumber 手机号，必填
     * @param outId       外部流水号，非必填
     **/
    @Override
    public VerifyMobileResponse verifyMobile(String accessCode, String phoneNumber, String outId) {
        com.aliyun.dypnsapi20170525.Client client;
        VerifyMobileResponse verifyMobileResponse;
        try {
            client = createClient();
            VerifyMobileRequest verifyMobileRequest = new VerifyMobileRequest();
            verifyMobileRequest.setAccessCode(accessCode);
            verifyMobileRequest.setPhoneNumber(phoneNumber);
            verifyMobileRequest.setOutId(outId);
            verifyMobileResponse = client.verifyMobile(verifyMobileRequest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return verifyMobileResponse;
    }
```

### controller控制器

笔者在调用verifyMobile完成本机号码校验认证这个接口 做了修改 验证成功后走登录的逻辑给客户端返回token

```java
    /**
     * 阿里GetMobile - 一键登录取号
     * @param aliToken 阿里token信息
     */
    @PostMapping(value = "getMobile")
    public Result getMobile(@RequestBody @Valid AppUserDTO.aliToken aliToken){
        GetMobileResponse mobile = userService.getMobile(aliToken.getAccessToken(), aliToken.getOutId());
        return Result.ok(mobile.getBody());
    }

    /**
     * 阿里GetMobile - 一键登录
     * @param aliToken 阿里token信息
     */
    @PostMapping(value = "verifyMobile")
    public Result verifyMobile(@RequestBody @Valid AppUserDTO.aliToken aliToken){
        VerifyMobileResponse verifyMobileResponse = userService.verifyMobile(aliToken.getAccessToken(), aliToken.getPhoneNumber(), aliToken.getOutId());
        String code = verifyMobileResponse.getBody().code;
        if (Objects.equals(code, "OK")){
            AppUserDTO.appLoginByPhone appLoginByPhone = new AppUserDTO.appLoginByPhone();
            appLoginByPhone.setAccount(aliToken.getPhoneNumber());
            AppUserDTO.appLoginRes appLoginRes = userService.getAppLoginRes(appLoginByPhone);
            if(appLoginRes.getSuccess()){
                return Result.ok(appLoginRes);
            }
            return Result.error(appLoginRes.getMsg());
        }else {
            return Result.error(verifyMobileResponse.getBody().message);
        }

    }
```



## 总结

现如今 各大头部APP都已集成手机号一键登录 方便用户的同时 更节省成本，相比传统的手机短信验证码登录 成本节省巨大 ，这无疑是一种明智之举。

但我们也要考虑到一些不可忽视的问题 

1. 在用户未插入手机卡的使用环境下
2. 在用户连接 WiFi 的使用环境下

所以在登录这方面 一键登录只是锦上添花 并不可完全替代 传统的短信验证码登录 ，权宜之计是 “我全都要”

![我全都要表情包12-](APP%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%9B%86%E6%88%90/006mowZngy1ftqn2egk5kg30860604g2.gif)

就酱，有需要交流的小伙伴可以联系我或留言