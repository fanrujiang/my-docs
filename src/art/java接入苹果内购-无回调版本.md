---
title: Java开发APP对接ios内购支付功能，可直接伸手党，简单修改即可使用
date: 2025-01-09 17:40:20
tags: 
- 技术分享
categories:
- 技术分享
---


# Java开发APP对接ios内购支付功能，可直接伸手党，简单修改即可使用

### 苹果支付流程介绍

①户在app端购买产品下发支付请求指令app;
②app获取用户购买的信息及指令请求苹果系统服务后台进行支付扣款;
③苹果系统服务器扣款成功后返回receipt_data加密数据和支付订单号order_id给app端;
④app端直接将返回的数据及订单号,请求java后台的验证接口;
⑤java后端直接通过HttpsURLConnection将app端携带来的参数以及验证地址url请求苹果系统服务器验证用户在app端支付的结果;(注:receipt_data加密数据不需要在java后台解密,直接传给苹果服务器)
⑥苹果系统服务器将验证的结果及订单产品信息返回给java后台服务器,java后台服务器根据返回的结果处理自己的业务;
⑦java后端处理后自己的业务后,将验证结果以及自己所要返回的内容返回给app端;
②app端在请求苹果系统服务器检查java服务端服务是否已经验证;
③苹果服务告知app端,java服务是否验证成功;
⑧app端根据苹果服务器返回的验证结果通知提示用户订单是否结束;
注:苹果支付内购,价格是以6的倍数定价,且产品订单是唯一的;

 

**java代码**

ApplePayUtil工具类，用于验证苹果返回的凭证

```java
import javax.net.ssl.*;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Locale;


public class ApplePayUtil {

    private static class TrustAnyTrustManager implements X509TrustManager {

        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[]{};
        }
    }

    private static class TrustAnyHostnameVerifier implements HostnameVerifier {
        @Override
        public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    }

    private static final String url_sandbox = "https://sandbox.itunes.apple.com/verifyReceipt";
    private static final String url_verify = "https://buy.itunes.apple.com/verifyReceipt";

    /**
     * 苹果服务器验证
     *
     * @param receipt 账单
     * @return null 或返回结果 沙盒 https://sandbox.itunes.apple.com/verifyReceipt
     * @url 要验证的地址
     */
    public static String buyAppVerify(String receipt, int type) throws Exception {
        //环境判断 线上/开发环境用不同的请求链接
        String url = "";
        if (type == 0) {
            url = url_sandbox; //沙盒测试
        } else {
            url = url_verify; //线上测试
        }
        SSLContext sc = SSLContext.getInstance("SSL");
        sc.init(null, new TrustManager[]{new TrustAnyTrustManager()}, new java.security.SecureRandom());
        URL console = new URL(url);
        HttpsURLConnection conn = (HttpsURLConnection) console.openConnection();
        conn.setSSLSocketFactory(sc.getSocketFactory());
        conn.setHostnameVerifier(new TrustAnyHostnameVerifier());
        conn.setRequestMethod("POST");
        conn.setRequestProperty("content-type", "text/json");
        conn.setRequestProperty("Proxy-Connection", "Keep-Alive");
        conn.setDoInput(true);
        conn.setDoOutput(true);
        BufferedOutputStream hurlBufOus = new BufferedOutputStream(conn.getOutputStream());
        //拼成固定的格式传给平台
        String str = String.format(Locale.CHINA, "{\"receipt-data\":\"" + receipt + "\"}");
        hurlBufOus.write(str.getBytes());
        hurlBufOus.flush();

        InputStream is = conn.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String line = null;
        StringBuffer sb = new StringBuffer();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        return sb.toString();
    }

}
```

 

**验证凭证的主要代码**

```
productId：此字段是用来配制ios固定充值选项的，因为不同的金额都需要在苹果商家平台中配置产品id（此id必须是绝对唯一值，用于匹配实际订单）
```

```java
package com.sports.user.controller.dto;


import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class IosPayVerifyReq {

    @ApiModelProperty(value = "商家订单id")
    private String orderId;

    @ApiModelProperty(value = "用户id")
    private String userId;

    @ApiModelProperty(value = "验证凭据")
    private String receiptDate;

    @ApiModelProperty(value = "ios选项值")
    private String productId;
}
```

验证凭证的接口方法

```java
   @ApiOperation("IOS内购凭证校验")
    public @ResponseBody
    UsrPayDO iosPay(@RequestBody IosPayVerifyReq req) {
        UsrPayDO usrPayDO = usrPayService.getById(req.getOrderId());
        try {
            //校验用户信息
            if (StrUtil.isBlank(req.getUserId())) {
                throw new SportsException(ResultCodeEnum.FAIL, "用户id不能为空");
            }

            //此步骤防止用户支付完成后立马退出APP，此时充值步骤未完成做的二次校验。具体思路是等用户再次登录APP后，前端查询最后一条充值信息并调用后端接口，完成充值流程。if (StringUtils.isBlank(req.getOrderId())) {
            UsrPayDO usrPayNew = usrPayService.getOne(new LambdaQueryWrapper<UsrPayDO>()
                    .eq(UsrPayDO::getUserId, req.getUserId())
                    .orderByDesc(UsrPayDO::getCreateTime)
                    .last("limit 1"));
            //payId：正常充值完成后会收到ios的订单id，此步骤判断是否是未完成的订单以及订单的状态是否是初始状态
            if (StringUtils.isBlank(usrPayNew.getPayId()) && usrPayNew.getStatus().equals(PayStatusEnum.TYPE_0.code)) {
                if (usrPayNew != null) {
                    req.setQxbOrderId(usrPayNew.getId());
                    if (StrUtil.isBlank(usrPayNew.getOtherId())) {
                        usrPayNew.setOtherId(req.getReceiptDate());
                    }
                    usrPayService.updateById(usrPayNew);
                } else {
                    throw new SportsException(ResultCodeEnum.FAIL, "未找到历史支付订单");
                }
            }
            
            if (usrPayDO == null) {
                throw new SportsException(ResultCodeEnum.FAIL, "未找到支付订单");
            }
            if (usrPayDO.getStatus().intValue() != PayStatusEnum.TYPE_0.code) {
                throw new SportsException(ResultCodeEnum.FAIL, "支付订单不是初始状态");
            }

            String verifyResult = ApplePayUtil.buyAppVerify(req.getReceiptDate(), 1);
            if (verifyResult == null) {
                throw new SportsException(ResultCodeEnum.FAIL, "网络遇到故障了，请稍后查询订单更新信息");
            }
            log.info("苹果平台返回JSON:" + verifyResult);
            JSONObject jsonObject = JSONObject.parseObject(verifyResult);

            String status = jsonObject.getString("status");
            if ("21002".equals(status)) {
                throw new SportsException(ResultCodeEnum.FAIL, "当前凭证有误,暂未查询到数据!");
            }

            if ("21007".equals(status)) {
                //在沙盒测试  发送平台验证
                verifyResult = ApplePayUtil.buyAppVerify(req.getReceiptDate(), 0);
                log.info("沙盒环境，苹果平台返回JSON:" + verifyResult);
                jsonObject = JSONObject.parseObject(verifyResult);
                status = jsonObject.getString("status");
            }
            log.info("苹果平台返回值param:{}" + jsonObject);


            if (com.sports.core.utils.StringUtils.equals(status, "0")) {
                String r_receipt = jsonObject.getString("receipt");
                JSONObject returnJson = JSONObject.parseObject(r_receipt);
                JSONArray inApp = (JSONArray) JSONPath.eval(returnJson, "in_app");
                for (Object inAppStr : inApp) {
                    String transactionId = String.valueOf(JSONPath.eval(inAppStr, "transaction_id"));
                    String productId = String.valueOf(JSONPath.eval(inAppStr, "product_id"));

                    if (com.sports.core.utils.StringUtils.equals(productId, req.getProductId())) {
                        //自己的业务逻辑，订单存库，更新状态等...
                    }
                }
            }
           
        } catch (Exception e) {
            e.printStackTrace();
        }
       return usrPayDO;
    }
```
