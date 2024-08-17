---
title: 破解 Aspose 系列 jar包方法
date: 2024-08-17 18:30:20
tag: 
- 技术分享
category:
- 技术分享
---

## 破解Aspose系列jar包方法

> 授人以鱼 不如授人以渔

### 源码分析

### 1. 下载[Aspose.Words for Java21.11官方jar包](https://downloads.aspose.com/words/java)

### 2. 开始分析

调用授权方法

   ```java
   InputStream is = new FileInputStream("..license.xml");
   License license = new License();
   license.setLicense(is);
   ```

license.xml文件内容

   ```xml
   <License>
       <Data>
           <Products>
               <Product>Aspose.Total for Java</Product>
               <Product>Aspose.Words for Java</Product>
           </Products>
           <EditionType>Enterprise</EditionType>
           <SubscriptionExpiry>20991231</SubscriptionExpiry>
           <LicenseExpiry>20991231</LicenseExpiry>
           <SerialNumber>8bfe198c-7f0c-4ef8-8ff0-acc3237bf0d7</SerialNumber>
       </Data>
       <Signature>
           sNLLKGMUdF0r8O1kKilWAGdgfs2BvJb/2Xp8p5iuDVfZXmhppo+d0Ran1P9TKdjV4ABwAgKXxJ3jcQTqE/2IRfqwnPf8itN8aFZlV3TJPYeD3yWE7IT55Gz6EijUpC7aKeoohTb4w2fpox58wWoF3SNp6sK6jDfiAUGEHYJ9pjU=
       </Signature>
   </License>
   
   ```



分析License类的setLicense方法找到关键代码

   ```java
   public void setLicense(String licenseName) throws Exception {
       if (licenseName == null) {
           throw new NullPointerException(zzVu.zzIR().zzZ42(new byte[]{105, 108, 101, 99, 115, 110, 78, 101, 109, 97, 101}));
       } else {
           (new zzXDb()).zzY0J(licenseName, zzWJD.zzWIQ());
       }
   }
   
   public void setLicense(InputStream stream) throws Exception {
       if (stream == null) {
           throw new NullPointerException(zzVu.zzIR().zzZ42(new byte[]{116, 115, 101, 114, 109, 97}));
       } else {
           (new zzXDb()).zzY0J(stream);
       }
   }
   ```



 setLicense的两个重载方法最终都调用了`(new zzXDb()).zzY0J(stream);`中的zzY0J方法，进入zzY0J方法观察代码发现重点在于`void `zzY0J`方法下面的 (InputStream var1) throws Exception`这个重载方法里面，但是里面代码很多不太好找到关键代码，所以转头去寻找关于验证对外调用的静态方法，最终找到了在`zzY0J`方法下面的

   ```java
   static byte[] zzX8p() {
       boolean var0 = zzWiV == null || zzWiV.zzWSL == zzYeQ.zzX0q || (new Date()).after(zzWiV.zzZ3l) || zzYKk.zzWy3() == 4096;
       if (zzW5s == 0L) {
           zzW5s ^= zzVWj;
       }
   
       boolean var1 = false;
       if (zzZB8.zzxn() != null) {
           var1 = zzZB8.zzZ7p() == zzu3.zzX0q;
           byte[] var2 = var0 && var1 ? zzYeQ.zzX0q : zzYeQ.zzXgr;
           return var2;
       } else {
           return null;
       }
   }
   
   static byte[] zzWQR() {
       boolean var0 = zzWiV == null || zzWiV.zzWSL == zzYeQ.zzX0q || (new Date()).after(zzWiV.zzZ3l) || zzYKk.zzWy3() == 4096;
       boolean var1 = zzZB8.zzZ7p() == zzu3.zzX0q;
       byte[] var2 = var0 && var1 ? zzYeQ.zzX0q : zzYeQ.zzXgr;
       return var2;
   }
   ```

这两个方法主要在于对外返回了一个byte数组，返回值是`zzYeQ`中的静态常量，所以重点就在于上面的判断语句`boolean var0 = zzWiV == null || zzWiV.zzWSL == zzYeQ.zzX0q || (new Date()).after(zzWiV.zzZ3l) || zzYKk.zzWy3() == 4096;`让它返回什么数据。
 这里需要分析`zzWiV.zzWSL` `zzWiV.zzZ3l` `zzYKk.zzWy3()`这三个数据，在当前`zzXDb`class文件中搜索找到在`void zzY0J(InputStream var1) throws Exception`方法中关键的关键位置赋值了

```java
this.zzWSL = zzYeQ.zzXgr;
zzWiV = this;
```

观察它上下位置代码发现看起来都是做验证错误的处理，所以可以尝试去掉上下的验证。
再来看`zzWiV.zzZ3l`变量属性为Date应该是时间什么的可以直接给个最大值。
然后是`zzYKk.zzWy3()`进入看到

```java
static int zzWy3() {
    return zzYU8 == 128 && !zzyS ? 256 : 4096;
}
```

那么返回值就是256和4096二选一，尝试后选择返回256。

### 3. 分析结果

- 修改`void zzY0J(InputStream var1)`方法体为

```java
this.zzZ3l = new java.util.Date(Long.MAX_VALUE);//Date赋值最大值
this.zzWSL = zzYeQ.zzXgr;//直接返回验证成功的执行
zzWiV = this;//直接返回验证成功的执行
```

- 修改`zzYKk`类下的`static int zzWy3()`方法体为

```java
return 256;
```

### 4. 破解jar包

#### 1. 添加Javassist修改class字节码文件的依赖

```xml
<dependency>
    <groupId>org.javassist</groupId>
    <artifactId>javassist</artifactId>
    <version>3.28.0-GA</version>
</dependency>
```

#### 2. 添加修改方法

```java
package top.fanliu;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;

public class Pojie {

    public static void main(String[] args) {
        modifyPptJar();
    }

    /**
     * 修改slides.jar包里面的校验
     */
    public static void modifyPptJar() {
        try {
            //这一步是完整的jar包路径,选择自己解压的jar目录
            ClassPool.getDefault().insertClassPath("C:\\Users\\53094\\Downloads\\aspose-slides-22.11-jdk16.jar");
            CtClass zzZJJClass = ClassPool.getDefault().getCtClass("com.aspose.slides.internal.of.public");
            CtMethod[] methodA = zzZJJClass.getDeclaredMethods();
            for (CtMethod ctMethod : methodA) {
                CtClass[] ps = ctMethod.getParameterTypes();
                if (ps.length == 3 && ctMethod.getName().equals("do")) {
                    System.out.println("ps[0].getName==" + ps[0].getName());
                    ctMethod.setBody("{}");
                }
            }
            //这一步就是将破译完的代码放在桌面上
            zzZJJClass.writeFile("C:\\Users\\53094\\Desktop\\");
        } catch (Exception e) {
            System.out.println("错误==" + e);
        }
    }

}
```

运行修改方法后会在桌面生成 com 修改后的文件夹

#### 3. 修改jar包里面的数据

1. 打开jar包将桌面com文件夹覆盖到jar包com文件夹

   ![image-20240817184041346](%E7%A0%B4%E8%A7%A3Aspose%E7%B3%BB%E5%88%97jar%E5%8C%85%E6%96%B9%E6%B3%95/image-20240817184041346.png)

#### 4. 重新导入修改后的jar包进行测试

1. maven 移除旧的 jar包，导入修改后的 jar包
2. 调用测试方法进行测试转换后的文件是否去除水印和数量限制成功

```java
String sourceFile = "D:\\b.doc";//输入的文件
String targetFile = "D:\\转换后.pdf";//输出的文件
/**
 * Word转PDF操作
 *
 * @param sourceFile 源文件
 * @param targetFile 目标文件
 */
public static void doc2pdf(String sourceFile, String targetFile) {
    try {
        long old = System.currentTimeMillis();
        FileOutputStream os = new FileOutputStream(targetFile);
        com.aspose.words.Document doc = new com.aspose.words.Document(sourceFile);
        doc.save(os, com.aspose.words.SaveFormat.PDF);
        os.close();
        long now = System.currentTimeMillis();
        System.out.println("共耗时：" + ((now - old) / 1000.0) + "秒");  //转化用时
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### 5. 尾言

博主将破解 Aspose 系列的代码放在 github 上面，你也可以克隆到本地进行破解

源码地址：[pojieAspose](https://github.com/fanrujiang/pojieAspose)

