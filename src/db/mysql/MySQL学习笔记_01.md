---
title: mysql学习笔记_01
date: 2021-02-07 19:52:19
tags: 
- mysql
categories:
- 数据库
- mysql

---

# mysql

## 1. Mysql的安装和下载

### 一、下载

点开下面的链接：https://dev.mysql.com/downloads/mysql/

![image-20221020012302873](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221020012302873.png) 

点击Download 就可以下载对应的安装包了, 安装包如下: ![image-20221020012428839](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221020012428839.png)  







### 二、解压

下载完成后我们得到的是一个压缩包，将其解压，我们就可以得到MySQL 8.0.31 的软件本体了(就是一个文件夹)，我们可以把它放在你想安装的位置 。

![image-20221020013011737](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221020013011737.png) 







### 三、配置

#### 1. 添加环境变量

> 环境变量里面有很多选项，这里我们只用到`Path`这个参数。为什么在初始化的开始要添加环境变量呢？
>
> 在黑框(即CMD)中输入一个可执行程序的名字，Windows会先在环境变量中的`Path`所指的路径中寻找一遍，如果找到了就直接执行，没找到就在当前工作目录找，如果还没找到，就报错。我们添加环境变量的目的就是能够在任意一个黑框直接调用MySQL中的相关程序而不用总是修改工作目录，大大简化了操作。



右键`此电脑`→`属性`，点击`高级系统设置`

![img](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/1556823-20181220220242472-524708778.png) 



点击`环境变量`

![img](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/1556823-20181220220359609-736422950.png) 



在`系统变量`中新建MYSQL_HOME

![image-20221020013128323](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221020013128323.png)  



在`系统变量`中找到并**双击**`Path`

![img](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/1556823-20181220220551145-1198958872.png) 



点击`新建`

![image-20201109135248104](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20201109135248104.png) 

最后点击确定。





**如何验证是否添加成功？**

右键开始菜单(就是屏幕左下角)，选择`命令提示符(管理员)`，打开黑框，敲入`mysql`，回车。

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221020013302450.png" alt="image-20221020013302450" style="zoom:67%;" /> 



如果提示`Can't connect to MySQL server on 'localhost'`则证明添加成功；

 <img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221020013335596.png" alt="image-20221020013335596" style="zoom:80%;" /> 



如果提示`mysql不是内部或外部命令，也不是可运行的程序或批处理文件`则表示添加添加失败，请重新检查步骤并重试。









#### 2. 初始化MySQL

==以管理员身份，运行命令行窗口：==

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20220518172922780.png" alt="image-20220518172922780" style="zoom: 80%;" />



在刚才的命令行中，输入如下的指令： 

```
mysqld --initialize-insecure
```

![image-20201109140955772](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20201109140955772.png) 

稍微等待一会，如果出现没有出现报错信息，则证明data目录初始化没有问题，此时再查看MySQL目录下已经有data目录生成。





tips：如果出现如下错误

![image-20201109135848054](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20201109135848054.png) 

是由于权限不足导致的，以管理员方式运行 cmd

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20220518172922780.png" alt="image-20220518172922780" style="zoom: 80%;" /> 









#### 3. 注册MySQL服务

命令行（注意必须以管理员身份启动）中，输入如下的指令，回车执行： 

```
mysqld -install
```



![image-20201109141325810](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20201109141325810.png) 

现在你的计算机上已经安装好了MySQL服务了。









#### 4. 启动MySQL服务

在黑框里敲入`net start mysql`，回车。

```java
net start mysql  // 启动mysql服务
    
net stop mysql  // 停止mysql服务
```

![image-20220518183747072](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20220518183747072.png) 









#### 5. 修改默认账户密码

在黑框里敲入`mysqladmin -u root password 1234`，这里的`1234`就是指默认管理员(即root账户)的密码，可以自行修改成你喜欢的。

```
mysqladmin -u root password 1234
```

![img](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/1556823-20181221093251250-819416425.png) 









### 四、登录MySQL

右键开始菜单，选择`命令提示符`，打开黑框。
在黑框中输入，`mysql -uroot -p1234`，回车，出现下图且左下角为`mysql>`，则登录成功。

```
mysql -uroot -p1234
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221020013540957.png" alt="image-20221020013540957" style="zoom:80%;" />  



 

**到这里你就可以开始你的MySQL之旅了！**

退出mysql：

```
exit
quit
```



登陆参数：

```
mysql -u用户名 -p密码 -h要连接的mysql服务器的ip地址(默认127.0.0.1) -P端口号(默认3306)
```





















### 五、卸载MySQL

如果你想卸载MySQL，也很简单。

点击开始菜单，输入cmd，选择 "命令提示符"，选择右侧的 "以管理员身份运行"。

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20220611083741275.png" alt="image-20220611083741275" style="zoom:80%;" /> 



1. 敲入`net stop mysql`，回车。

```
net stop mysql
```

![ ](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/1556823-20181220222924783-57600848.png) 





2. 再敲入`mysqld -remove mysql`，回车。

```
mysqld -remove mysql
```

![img](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/1556823-20181220223025128-587235464.png) 





3. 最后删除MySQL目录及相关的环境变量。

**至此，MySQL卸载完成！**



## 2.MySQL概述

### 介绍

MySQL是一个**关系型数据库管理系统**由瑞典**MySQL AB**公司开发，属于 [Oracle](https://baike.baidu.com/item/Oracle?fromModule=lemma_inlink) 旗下产品。MySQL 是最流行的[关系型数据库管理系统](https://baike.baidu.com/item/关系型数据库管理系统/696511?fromModule=lemma_inlink)之一，在 [WEB](https://baike.baidu.com/item/WEB/150564?fromModule=lemma_inlink) 应用方面，MySQL是最好的 [RDBMS](https://baike.baidu.com/item/RDBMS/1048260?fromModule=lemma_inlink) (Relational Database Management System，关系数据库管理系统) 应用软件之一。

MySQL是一种关系型数据库管理系统，关系数据库将数据保存在不同的表中，而不是将所有数据放在一个大仓库内，这样就增加了速度并提高了灵活性。

MySQL所使用的 SQL 语言是用于访问[数据库](https://baike.baidu.com/item/数据库/103728?fromModule=lemma_inlink)的最常用标准化语言。MySQL 软件采用了双授权政策，分为社区版和[商业版](https://baike.baidu.com/item/商业版/1817444?fromModule=lemma_inlink)，由于其体积小、速度快、总体拥有成本低，尤其是[开放源码](https://baike.baidu.com/item/开放源码/7176422?fromModule=lemma_inlink)这一特点，一般中小型和大型网站的开发都选择 MySQL 作为[网站数据库](https://baike.baidu.com/item/网站数据库/6399264?fromModule=lemma_inlink)。

### MySql数据模型

**关系型数据库（RDBMS):建立在关系模型基础上，由多张互相连接的二维表组成的数据库。**

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205091845658.png" alt="image-20230205091845658" style="zoom:80%;" />

- **使用表存储数据，格式统一，便于维护**
- **使用SQL语言操作，标准统一，使用方便，可用于复杂查询**



### SQL简介

sql：一门操作关系型数据库的编程语言，定义操作所有关系型数据库的统一标准

### SQL分类

SQL语句通常分为四大类：

| 分类 | 全称                       | 说明                                                   |
| ---- | -------------------------- | ------------------------------------------------------ |
| DDL  | Data Definition Language   | 数据定义语言，用来定义数据库对象(数据库，表，字段)     |
| DML  | Data Manipulation Language | 数据操作语言，用来对数据库表中的数据进行增删改         |
| DQL  | Data Query Language        | 数据查询语言，用来查询数据库中表的记录                 |
| DCL  | Data Control Language      | 数据控制语言，用来创建数据库用户、控制数据库的访问权限 |

### SQL通用语法

- **SQL语句可以单行/多行书写，以分号结束。**
- **SQL语句中可以增加缩进/空格来增强可读性。**
- **SQL语句中的关键字不区分大小写。**
- **SQL语句注释：单行注释（-- 注释），多行注释（/* 注释 */）**



### DDL（数据库操作）

#### 查询

查询所有数据库

```mysql
show databases;
```

![image-20230205094908137](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205094908137.png)

查询当前数据库

```mysql
select database();
```

![image-20230205095136562](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205095136562.png)

#### 创建

创建数据库

```mysql
create database fanfan;
```

![image-20230205095919779](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205095919779.png)

看看效果吧

![image-20230205100011944](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205100011944.png)

==注意：在同一个数据库服务器中，不能创建两个名称相同的数据库，否则将会报错。==

![image-20230205100304775](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205100304775.png)

- 可以使用if not exists来避免这个问题

```sql
-- 数据库不存在,则创建该数据库；如果存在则不创建
create database if not exists fanfan;
```

 命令行执行效果如下： 

![image-20230205100617631](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205100617631.png)

#### 使用

**语法：**

```mysql
use 数据库名 ;
```

> 我们要操作某一个数据库下的表时，就需要通过该指令，切换到对应的数据库下，否则不能操作。

案例：切换到itcast数据

```mysql
use itcast;
```

命令执行效果如下：

![image-20220829124929708](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20220829124929708.png) 



#### 删除

**语法：**

```mysql
drop database [ if exists ] 数据库名 ;
```

> 如果删除一个不存在的数据库，将会报错。
>
> 可以加上参数 if exists ，如果数据库存在，再执行删除，否则不执行删除。

案例：删除itcast数据库

~~~mysql
drop database if exists itcast; -- itcast数据库存在时删除
~~~

命令执行效果如下：

![image-20220829125006142](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20220829125006142.png) 

> 说明：上述语法中的database，也可以替换成 schema
>
> - 如：create schema db01;
> - 如：show schemas;
>
> ![image-20221205180608004](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221205180608004.png)





### DDL(表操作)

关于表结构的操作也是包含四个部分：创建表、查询表、修改表、删除表。

#### 创建表(create)

##### 语法

```mysql
create table  表名(
	字段1  字段1类型 [约束]  [comment  字段1注释 ],
	字段2  字段2类型 [约束]  [comment  字段2注释 ],
	......
	字段n  字段n类型 [约束]  [comment  字段n注释 ] 
) [ comment  表注释 ] ;
```

> 注意： [ ] 中的内容为可选参数； 最后一个字段后面没有逗号

```mysql
create table user(
    id int comment 'id',
    username varchar(20) comment '用户名',
    name varchar(10) comment '姓名',
    age int comment '年龄',
    gender char(1) comment '性别'
) comment  '用户表';
```

![image-20230205101521439](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205101521439.png)

##### 约束

概念：约束就是作用在表中的字段上的规则，限制储存在表中的数据。

作用：就是来保证数据库当中数据的正确性、有效性和完整性。

在MySQL数据库当中，有种约束：

| **约束**   | **描述**                                                     | **关键字**     |
| ---------- | ------------------------------------------------------------ | -------------- |
| 非空约束   | 限制该字段值不能为null                                       | not null       |
| 唯一约束   | 保证字段的所有数据都是唯一、不重复的                         | unique         |
| 主键约束   | 主键是一行数据的唯一标识，要求非空且唯一                     | primary key    |
| 默认约束   | 保存数据时，如果未指定该字段值，则采用默认值                 | default        |
| 外键约束   | 让两张表的数据建立连接，保证数据的一致性和完整性             | foreign key    |
| 自增约束   | 让数值类型自增                                               | auto_increment |
| 无负数倍增 | 用途1是起到约束数值的作用，2是可以增加数值范围（相当于把负数那部分加到正数上） | unsigned       |

> 约束是作用在表中的字段上的，可以在创建/修改表的时候添加约束。

##### 数据类型

- java有八种基本数据类型分为四类八种，四类分别为整型、浮点型、布尔型、字符型；分为四类（整型、浮点型、布尔型、字符型）八种分别为byte、short、int、long、float、double、boolean、char；

![img](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/2022040617132145.jpg)

**MySQL中的类型也有很多，主要分成三类：数值类型、字符串类型、日期时间类型。**

###### 数值类型

| 类型        | 大小   | 有符号(SIGNED)范围                                    | 无符号(UNSIGNED)范围                                       | 描述               |
| ----------- | ------ | ----------------------------------------------------- | ---------------------------------------------------------- | ------------------ |
| TINYINT     | 1byte  | (-128，127)                                           | (0，255)                                                   | 小整数值           |
| SMALLINT    | 2bytes | (-32768，32767)                                       | (0，65535)                                                 | 大整数值           |
| MEDIUMINT   | 3bytes | (-8388608，8388607)                                   | (0，16777215)                                              | 大整数值           |
| INT/INTEGER | 4bytes | (-2147483648，2147483647)                             | (0，4294967295)                                            | 大整数值           |
| BIGINT      | 8bytes | (-2^63，2^63-1)                                       | (0，2^64-1)                                                | 极大整数值         |
| FLOAT       | 4bytes | (-3.402823466 E+38，3.402823466351 E+38)              | 0 和 (1.175494351  E-38，3.402823466 E+38)                 | 单精度浮点数值     |
| DOUBLE      | 8bytes | (-1.7976931348623157 E+308，1.7976931348623157 E+308) | 0 和  (2.2250738585072014 E-308，1.7976931348623157 E+308) | 双精度浮点数值     |
| DECIMAL     |        | 依赖于M(精度)和D(标度)的值                            | 依赖于M(精度)和D(标度)的值                                 | 小数值(精确定点数) |

```
示例: 
    年龄字段 ---不会出现负数, 而且人的年龄不会太大
	age tinyint unsigned
	
	分数 ---总分100分, 最多出现一位小数
	score double(4,1)
```

###### 字符串类型

| 类型       | 大小                  | 描述                         |
| ---------- | --------------------- | ---------------------------- |
| CHAR       | 0-255 bytes           | 定长字符串(需要指定长度)     |
| VARCHAR    | 0-65535 bytes         | 变长字符串(需要指定长度)     |
| TINYBLOB   | 0-255 bytes           | 不超过255个字符的二进制数据  |
| TINYTEXT   | 0-255 bytes           | 短文本字符串                 |
| BLOB       | 0-65 535 bytes        | 二进制形式的长文本数据       |
| TEXT       | 0-65 535 bytes        | 长文本数据                   |
| MEDIUMBLOB | 0-16 777 215 bytes    | 二进制形式的中等长度文本数据 |
| MEDIUMTEXT | 0-16 777 215 bytes    | 中等长度文本数据             |
| LONGBLOB   | 0-4 294 967 295 bytes | 二进制形式的极大文本数据     |
| LONGTEXT   | 0-4 294 967 295 bytes | 极大文本数据                 |

char 与 varchar 都可以描述字符串，char是定长字符串，指定长度多长，就占用多少个字符，和字段值的长度无关 。而varchar是变长字符串，指定的长度为最大占用长度 。相对来说，char的性能会更高些。

```sql
示例： 
    用户名 username ---长度不定, 最长不会超过50
	username varchar(50)
	
	手机号 phone ---固定长度为11
	phone char(11)
```

###### 日期时间类型



| 类型     | 大小(bytes) | 范围                                | 格式                | 描述                 |
| -------- | ----------- | ----------------------------------- | ------------------- | -------------------- |
| DATA     | 3           | 1000-01-01到 9999-12-31             | YYYY-MM-DD          | 日期                 |
| TIME     | 3           | -838:59:59 到 838:59:59             | HH:MM:SS            | 时间值或者持续的时间 |
| YEAR     | 1           | 1901 到 2155                        | YYYY                | 年份值               |
| DATETIME | 8           | 1000-01-01 到 9999-12-31 23:59:59   | YYYY-MM-DD HH:MM:SS | 混合日期的时间值     |
| TIMETAMP | 4           | 1970-01-01 到 2038-01-19 03:14 :07/ | YYYY-MM-DD HH:MM:SS | 混合日期和时间值     |

	示例: 
		生日字段  birthday ---生日只需要年月日  
		birthday date
	创建时间 createtime --- 需要精确到时分秒
	createtime  datetime

###### 案例

需求：根据产品原型/需求创建表((设计合理的数据类型、长度、约束) 

![image-20230205165156336](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205165156336.png)

**步骤：**

1. 阅读产品原型及需求文档，看看里面涉及到哪些字段。

2. 查看需求文档说明，确认各个字段的类型以及字段存储数据的长度限制。

3. 在页面原型中描述的基础字段的基础上，再增加额外的基础字段。

使用SQL创建表：

```mysql
create table tb_emp
(
    id          int(10) primary key auto_increment comment '主键',
    username    varchar(20) not null comment '用户名',
    password    varchar(12) default '123456' comment '密码',
    name        varchar(50) not null comment '员工姓名',
    gender      char(1)     not null comment '性别',
    image       varchar(50) comment '头像',
    job         tinyint unsigned comment '职位',
    entry_time  date comment '入职日期',
    create_time datetime comment '创建时间',
    update_time datetime comment '更新时间'
) comment '员工表';
```









#### 查询表(show)

> 关于表结构的查询操作，工作中一般都是直接基于**图形化界面操作**。 

**查询当前数据库所有表**

```mysql
show tables;
```

![image-20230205101649699](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205101649699.png)

**查看指定表结构**

```mysql
desc 表名 ;#可以查看指定表的字段、字段的类型、是否可以为NULL、是否存在默认值等信息
```

```mysql
desc user;
```

![image-20230205101806613](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205101806613.png)

**查找表数据**

```
select *from emp03;
```

![image-20230205170320136](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205170320136.png)

**查询指定表的建表语句**

```mysql
show create table 表 ;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205101921092.png" alt="image-20230205101921092" style="zoom:80%;" />



#### 修改表（alter）

**添加字段**

```sql
alter table 表名 add  字段名  类型(长度)  [comment 注释]  [约束];
```

案例： 为emp03表添加字段qq，字段类型为 varchar(10)

```mysql
alter table emp03 add qq varchar(10)  comment 'qq号';
```

**修改字段**

```mysql
alter table 表名 modify  字段名  新数据类型(长度);
```

```sql
alter table 表名 change  旧字段名  新字段名  类型(长度)  [comment 注释]  [约束];
```

案例：修改qq字段的字段类型，将其长度由10修改为11

```mysql
#修改字段长度
alter table emp03 modify qq varchar(11) comment 'qq号码';
```

案例：修改qq字段名为 qq_num，字段类型varchar(12)

```mysql
# 修改字段名称,修改字段长度
alter table emp03  change qq qq_num varchar(12) comment 'qq号码';
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205172433415.png" alt="image-20230205172433415" style="zoom:80%;" />

**删除字段**

```sql
alter table 表名 drop 字段名;
```

案例：删除tb_emp表中的qq_num字段

```mysql
alter table emp03 drop qq_num;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205172810863.png" alt="image-20230205172810863" style="zoom:80%;" />

**修改表名**

```mysql
rename table 表名 to 新表名;
```

案例：将emp03表名修改为emp04

```mysql
rename table emp03 to emp04;
```

![image-20230205173136873](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205173136873.png)

#### 删除表（drop）

删除表语法

```
drop table if exists 表名;
```

> if exists ：只有表名存在时才会删除该表，表名不存在，则不执行删除操作(如果不加该参数项，删除一张不存在的表，执行将会报错)。

案例：如果emp02表存在，则删除emp02表

```mysql
drop table if exists emp02;
```

![image-20230205173637529](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205173637529.png)

### DML(数据库操作)

DML是用来对数据库中的数据记录进行增删改查操作的。

- 添加数据(INSERT)
- 修改数据(UPDATE)
- 删除数据(DELETE)

#### 增加(insert)

insert语法：

- 向指定字段添加数据

  ~~~mysql
  insert into 表名 (字段名1, 字段名2) values (值1, 值2);
  ~~~

- 全部字段添加数据

  ~~~mysql
  insert into 表名 values (值1, 值2, ...);
  ~~~

- 批量添加数据（指定字段）

  ~~~mysql
  insert into 表名 (字段名1, 字段名2) values (值1, 值2), (值1, 值2);
  ~~~

- 批量添加数据（全部字段）

  ~~~mysql
  insert into 表名 values (值1, 值2, ...), (值1, 值2, ...);
  ~~~

**案例**

**向emp04表的所有字段添加数据**

```mysql
# 添加数据
insert into emp04(id, username, password, name, gender, image, job, entrydate, create_time, update_time)
values (null, 'zhirou', '123', '周芷若', 2, '1.jpg', 1, '2010-01-01', now(), now());
```

![image-20230205174732481](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205174732481.png)

**向tb_emp表的username、password，name、gender字段插入数据**

```mysql
# 向emp04表的username、name、gender,password字段插入数据
#因为设计表时create_time, update_time两个字段不能为NULL，所以也做为要插入的字段
insert into emp04(username,password, name, gender,create_time,update_time)
values ('zhangsanfeng','123456','张三丰',1,now(),now());
```

![image-20230205175414398](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205175414398.png)

**批量向emp04表的username、password、name、gender字段插入数据**

```mysql
insert into emp04(username, password, name, gender, create_time, update_time)
values ('laodie', '123456', '老爹', 1, now(), now()),
       ('xiaoyu', '123456', '小玉', 1, now(), now());
```

![image-20230205175914736](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205175914736.png)

#### 修改(update)

update语法：

```
update 表名 set 字段名1 =值1 ,字段名2 =值2 ,.... where 条件;
```

案例1：将emp04表中id为1的员工，姓名name字段更新为'张三'

```mysql
update emp04 set name='张三',update_time=now() where id =1;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205201425543.png" alt="image-20230205201425543" style="zoom:67%;" />

案例2：将emp04表的所有员工入职日期更新为'2010-01-01'

```mysql
update emp04 set entrydate = '2010-01-01',update_time=now();
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205201713698.png" alt="image-20230205201713698" style="zoom:67%;" />

> **注意：1.不带where的修改语句会修改整张表的所有数据**
>
> ​			**2.在修改数据的时候，一般要修改公共字段update_time ,将其修改为 now() 当前操作时间 。**





#### 删除（delete）

delete语法

```mysql
delete from 表名 where 条件
```

案例1：删除emp04表中id为1的员工

```mysql
delete from emp04 where id=1;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205202612653.png" alt="image-20230205202612653" style="zoom:67%;" />

案例2：删除emp04表中所有员工

```mysql
delete from emp04;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205202936977.png" alt="image-20230205202936977" style="zoom:50%;" />

不小心删除的数据在mysql中可以恢复，在mysql中delete支持事务回滚，但是事先要开启事务

```mysql
# 1. 开启事务
start transaction;
# 2. 删除表所有内容
delete from emp04;
# 3. 查询表中数据
select * from emp04;
# 4. 使用事务回滚
rollback;
# 5. 查询表中数据
select * from emp04;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230205205438585.png" alt="image-20230205205438585" style="zoom:67%;" />







### 数据库操作-DQL

- DQL英文全称是Data Query Language(数据查询语言)，用来查询数据库表中的记录。

- 查询关键字：SELECT

  语法

```mysql
SELECT
	字段列表
FROM
	表名列表
WHERE
	条件列表
GROUP  BY
	分组字段列表
HAVING
	分组后条件列表
ORDER BY
	排序字段列表
LIMIT
	分页参数
```

#### DQL-基本查询

- 查询多个字段

  ```MYSQL
  select 字段1, 字段2, 字段3 from  表名;
  ```

- 查询所有字段（使用通配符）

  ```mysql
  select * from 表名;
  ```

- 设置别名

  ```mysql
  select 字段1 as '别名1',字段2 as '别名2' from 表名;
  ```

- 去除重复记录

  ```mysql
  select distinct 字段列表 from  表名;
  ```

  

##### DQL案例1

导入建表SQL

```mysql
-- 员工管理(带约束)
create table tb_emp (
    id int unsigned primary key auto_increment comment 'ID',
    username varchar(20) not null unique comment '用户名',
    password varchar(32) default '123456' comment '密码',
    name varchar(10) not null comment '姓名',
    gender tinyint unsigned not null comment '性别, 说明: 1 男, 2 女',
    image varchar(300) comment '图像',
    job tinyint unsigned comment '职位, 说明: 1 班主任,2 讲师, 3 学工主管, 4 教研主管',
    entrydate date comment '入职时间',
    create_time datetime not null comment '创建时间',
    update_time datetime not null comment '修改时间'
) comment '员工表';

-- 准备测试数据
INSERT INTO tb_emp (id, username, password, name, gender, image, job, entrydate, create_time, update_time) VALUES
    (1, 'jinyong', '123456', '金庸', 1, '1.jpg', 4, '2000-01-01', '2022-10-27 16:35:33', '2022-10-27 16:35:35'),
    (2, 'zhangwuji', '123456', '张无忌', 1, '2.jpg', 2, '2015-01-01', '2022-10-27 16:35:33', '2022-10-27 16:35:37'),
    (3, 'yangxiao', '123456', '杨逍', 1, '3.jpg', 2, '2008-05-01', '2022-10-27 16:35:33', '2022-10-27 16:35:39'),
    (4, 'weiyixiao', '123456', '韦一笑', 1, '4.jpg', 2, '2007-01-01', '2022-10-27 16:35:33', '2022-10-27 16:35:41');
```

**1.查询所有员工的 name,entrydate，并起别名(姓名、入职日期)**

```mysql
select name as '姓名', entrydate as '入职日期' from tb_emp;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206154018304.png" alt="image-20230206154018304" style="zoom:67%;" />

**2.查询所有员工的职位**

```mysql
select distinct job as '职位' from tb_emp;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206155230902.png" alt="image-20230206155230902" style="zoom:67%;" />



#### 条件查询

**语法:**

```mysql
select 字段名称 from 表名 where 条件 ;
```

学习条件查询就是学习条件的构建方式，而在SQL语句当中构造条件的运算符分为两类：

- 比较运算符
- 逻辑运算符

常用的比较运算符如下: 

| **比较运算符**       | **功能**                                 |
| -------------------- | ---------------------------------------- |
| >                    | 大于                                     |
| >=                   | 大于等于                                 |
| <                    | 小于                                     |
| <=                   | 小于等于                                 |
| =                    | 等于                                     |
| <> 或 !=             | 不等于                                   |
| between ...  and ... | 在某个范围之内(含最小、最大值)           |
| in(...)              | 在in之后的列表中的值，多选一             |
| like 占位符          | 模糊匹配(_匹配单个字符, %匹配任意个字符) |
| is null              | 是null                                   |

常用的逻辑运算符如下:

| **逻辑运算符** | **功能**                    |
| -------------- | --------------------------- |
| and 或 &&      | 并且 (多个条件同时成立)     |
| or 或 \|\|     | 或者 (多个条件任意一个成立) |
| not 或 !       | 非 , 不是                   |



##### 案例

1. **查询 姓名 为 杨逍 的员工**

```mysql
select * from tb_emp where name = '杨逍';
```

![image-20230206155654039](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206155654039.png)

2. **查询 id 小于等于 5 的员工信息**

```mysql
select * from tb_emp where id <= 5 ;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206160027308.png" alt="image-20230206160027308" style="zoom:67%;" />

3. **查询 没有分配职位 的员工信息**

```mysql
select * from tb_emp where job is null ;
#注意查询没有数据的字段要使用 is null 条件 ，而不是 = null 
```

![image-20230206160456181](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206160456181.png)

4. **查询 有职位 的员工信息**

```mysql
select *from tb_emp where job not null;
```

5. **查询 密码不等于 '123456' 的员工信息**

```
select * from tb_emp where password != '123456'; 
```

![image-20230206160819059](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206160819059.png)

6. **查询入职日期 在 '2000-01-01' (包含) 到 '2010-01-01'(包含) 之间的员工信息**

```mysql
select * from tb_emp where entrydate between '2000-01-01' and '2010-01-01';
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206161314502.png" alt="image-20230206161314502" style="zoom:67%;" />

7. **查询入职日期 不在 '2000-01-01' (包含) 到 '2010-01-01'(包含) 之间的员工信息**

```mysql
select * from tb_emp where entrydate not between '2000-01-01' and '2010-01-01';
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206161505511.png" alt="image-20230206161505511" style="zoom:67%;" />

8. **查询 入职时间 在 '2000-01-01' (包含) 到 '2010-01-01'(包含) 之间 且 性别为女 的员工信息**

```mysql
select * from tb_emp where entrydate between '2000-01-01'and '2010-01-01' and gender = '2';
```

![image-20230206162022595](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206162022595.png)

9. **查询 职位是 2 (讲师), 3 (学工主管), 4 (教研主管) 的员工信息**

```mysql
select * from tb_emp where job = 2 or job = 3 or job = 4;
#或者
select * from tb_emp where job in (2,3,4);
```

10. **查询 姓名 为两个字的员工信息**

```mysql
select * from tb_emp where name like '__';
# 通配符 "_" 代表任意1个字符
```

11. **查询 姓 '张' 的员工信息**

```mysql
select * from tb_emp where name like '张%';
# 通配符 "%" 代表任意个字符（0个 ~ 多个）
```

#### 聚合函数

聚合函数查询就是纵向查询，它是对一列的值进行计算，然后返回一个结果值。

语法：

~~~mysql
select  聚合函数(字段列表)  from  表名 ;
~~~

> 注意 : 聚合函数会忽略空值，对NULL值不作为统计。

常用聚合函数：

| **函数** | **功能** |
| -------- | -------- |
| count    | 统计数量 |
| max      | 最大值   |
| min      | 最小值   |
| avg      | 平均值   |
| sum      | 求和     |

> count ：按照列去统计有多少行数据。
>
> - 在根据指定的列统计的时候，如果这一列中有null的行，该行不会被统计在其中。
>
> sum ：计算指定列的数值和，如果不是数值类型，那么计算结果为0
>
> max ：计算指定列的最大值
>
> min ：计算指定列的最小值
>
> avg ：计算指定列的平均值

语法

```mysql
select 聚合函数(字段名) from 表名;
```

##### 案例

1. **统计该企业员工数量**

   ```
   select count(id) from tb_emp;
   ```

   ![image-20230206170843214](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206170843214.png)

2. **统计该企业员工 ID 的平均值**

```
select avg(id) from tb_emp;
```

![image-20230206171343676](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206171343676.png)

3. **统计该企业最早入职的员工**

```
select min(entrydate) from tb_emp;
```

![image-20230206172226146](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206172226146.png)

4. **统计该企业最迟入职的员工**

```
select max(entrydate) from tb_emp;
```

![image-20230206172314816](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206172314816.png)

5. **统计该企业员工的 ID 之和**

```
select sum(id) from tb_emp;
```

![image-20230206172405499](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206172405499.png)

#### 分组查询

分组： 按照某一列或者某几列，把相同的数据进行合并输出。

> 分组其实就是按列进行分类(指定列下相同的数据归为一类)，然后可以对分类完的数据进行合并计算。
>
> 分组查询通常会使用聚合函数进行计算。

语法：

~~~mysql
select  字段列表  from  表名  [where 条件]  group by 分组字段名  [having 分组后过滤条件];
~~~

##### 案例

1. **根据性别分组 , 统计男性和女性员工的数量**

```
select gender , count(*) from tb_emp group by gender;
```

![image-20230206174334518](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206174334518.png)

2. **先查询入职时间在 '2015-01-01' (包含) 以前的员工 , 并对结果根据职位分组 , 获取员工数量大于等于2的职位**

1.先查入职时间在 '2015-01-01' (包含) 以前的员工 , 并对结果根据职位分组 , 获取员工数量

```
select job , count(*) from tb_emp where entrydate <= '2015-01-01' group by job;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206174208822.png" alt="image-20230206174208822" style="zoom: 80%;" />

2.获取员工数量大于等于2的职位

```
select job , count(*) from tb_emp where entrydate <= '2015-01-01' group by job having count(*) >= 2;
```

![image-20230206174747276](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206174747276.png)





#### 排序查询

排序在日常开发中是非常常见的一个操作，有升序排序，也有降序排序。

语法：

```mysql
select  字段列表  
from   表名   
[where  条件列表] 
[group by  分组字段 ] 
order  by  字段1  排序方式1 , 字段2  排序方式2 … ;
```

- 排序方式：

  - ASC ：升序（默认值）

  - DESC：降序

##### 案例

1.  根据入职时间, 对员工进行升序排序

```
select * from tb_emp order by entrydate asc;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206175312349.png" alt="image-20230206175312349" style="zoom: 67%;" />

2. 根据入职时间, 对员工进行降序排序

```
select * from tb_emp order by entrydate desc;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206175416603.png" alt="image-20230206175416603" style="zoom:67%;" />

3. 根据 入职时间 对公司的员工进行 升序排序 ， 入职时间相同 , 再按照 更新时间 进行降序排序

```
select * from tb_emp order by entrydate , update_time desc;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206175756054.png" alt="image-20230206175756054" style="zoom:67%;" />





#### 分页查询

语法

```mysql
select * from 表名 limit 跳过前面的多少条数据， 每页显示多少条数据
```

##### 案例


1. 从起始索引0开始查询员工数据, 每页展示5条记录

```
select * from tb_emp limit 0,5 ;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206180258199.png" alt="image-20230206180258199" style="zoom:67%;" />

2. 查询 第1页 员工数据, 每页展示5条记录

```
select * from tb_emp limit 5 ;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206180615339.png" alt="image-20230206180615339" style="zoom: 67%;" />

3. 查询 第2页 员工数据, 每页展示5条记录

```
select * from tb_emp limit 5,5;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206180840077.png" alt="image-20230206180840077" style="zoom:67%;" />

4. 查询 第3页 员工数据, 每页展示5条记录

```
select * from tb_emp limit 10,5;
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206180932347.png" alt="image-20230206180932347" style="zoom:67%;" />







### 多表设计

关于单表的操作(单表的设计、单表的增删改查)我们就已经学习完了。接下来我们就要来学习多表的操作，首先来学习多表的设计。

项目开发中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在着各种联系，基本上分为三种：

- 一对多(多对一)

- 多对多

- 一对一



##### 外键约束

语法

```mysql
-- 创建表时指定

create table 表名(

 字段名  数据类型,

 ...

 [constraint]  [外键名称] foreign key (外键字段名)  references  主表 (字段名) 

);

-- 建完表后，添加外键

alter table 表名 add constraint 外键名称 foreign key (外键字段名) references 主表(字段名);
```







#### 一对多

##### 案例

<img src="http://yun.fanliu.top/%E7%AC%94%E8%AE%B0/image-20230206202127411.png" alt="image-20230206202127411" style="zoom: 67%;" />

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206202225598.png" alt="image-20230206202225598" style="zoom:67%;" />

```mysql
#建表完成后添加约束
alter table tb_emp
    add constraint abc foreign key (dept_id) references tb_dept (id);
```

```mysql
#在建表语句中添加约束
    constraint abc foreign key (dept_id) references tb_dept(id)
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206204111922.png" alt="建表后加约束" style="zoom:50%;" />

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206204819272.png" alt="建表前加约束" style="zoom:50%;" />

**物理外键和逻辑外键**

- 物理外键
  - 概念：使用foreign key定义外键关联另外一张表。
  - 缺点：
    - 影响增、删、改的效率（需要检查外键关系）。
    - 仅用于单节点数据库，不适用与分布式、集群场景。
    - 容易引发数据库的死锁问题，消耗性能。

- 逻辑外键
  - 概念：在业务层逻辑中，解决外键关联。
  - 通过逻辑外键，就可以很方便的解决上述问题。

> **在现在的企业开发中，很少会使用物理外键，都是使用逻辑外键。 甚至在一些数据库开发规范中，会明确指出禁止使用物理外键 foreign key **



#### 一对一

一对一关系表在实际开发中应用起来比较简单，通常是用来做单表的拆分，也就是将一张大表拆分成两张小表，将大表中的一些基础字段放在一张表当中，将其他的字段放在另外一张表当中，以此来提高数据的操作效率。

##### 案例

> 一对一的应用场景： 用户表(基本信息+身份信息)
>
> ![image-20221207104508080](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221207104508080.png)
>
> - 基本信息：用户的ID、姓名、性别、手机号、学历
> - 身份信息：民族、生日、身份证号、身份证签发机关，身份证的有效期(开始时间、结束时间)
>
> 如果在业务系统当中，对用户的基本信息查询频率特别的高，但是对于用户的身份信息查询频率很低，此时出于提高查询效率的考虑，我就可以将这张大表拆分成两张小表，第一张表存放的是用户的基本信息，而第二张表存放的就是用户的身份信息。他们两者之间一对一的关系，一个用户只能对应一个身份证，而一个身份证也只能关联一个用户。

那么在数据库层面怎么去体现上述两者之间是一对一的关系呢？

其实一对一我们可以看成一种特殊的一对多。一对多我们是怎么设计表关系的？是不是在多的一方添加外键。同样我们也可以通过外键来体现一对一之间的关系，我们只需要在任意一方来添加一个外键就可以了。

![image-20221207105632634](./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20221207105632634.png)

> 一对一 ：在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的(UNIQUE)

建表语句

```mysql
-- 用户基本信息表
create table tb_user(
                        id int unsigned  primary key auto_increment comment 'ID',
                        name varchar(10) not null comment '姓名',
                        gender tinyint unsigned not null comment '性别, 1 男  2 女',
                        phone char(11) comment '手机号',
                        degree varchar(10) comment '学历'
) comment '用户基本信息表';
-- 测试数据
insert into tb_user values (1,'白眉鹰王',1,'18812340001','初中'),
                           (2,'青翼蝠王',1,'18812340002','大专'),
                           (3,'金毛狮王',1,'18812340003','初中'),
                           (4,'紫衫龙王',2,'18812340004','硕士');

-- 用户身份信息表
create table tb_user_card(
                             id int unsigned  primary key auto_increment comment 'ID',
                             nationality varchar(10) not null comment '民族',
                             birthday date not null comment '生日',
                             idcard char(18) not null comment '身份证号',
                             issued varchar(20) not null comment '签发机关',
                             expire_begin date not null comment '有效期限-开始',
                             expire_end date comment '有效期限-结束',
                             user_id int unsigned not null unique comment '用户ID'
                             
) comment '用户身份信息表';
-- 测试数据
insert into tb_user_card values (1,'汉','1960-11-06','100000100000100001','朝阳区公安局','2000-06-10',null,1),
                                (2,'汉','1971-11-06','100000100000100002','静安区公安局','2005-06-10','2025-06-10',2),
                                (3,'汉','1963-11-06','100000100000100003','昌平区公安局','2006-06-10',null,3),
                                (4,'回','1980-11-06','100000100000100004','海淀区公安局','2008-06-10','2028-06-10',4);
```

添加外键约束

```mysql
--建表前
constraint cba foreign key (user_id) references tb_user(id)
--建表后
alter table tb_user_card add constraint cba foreign key (user_id) references tb_user(id);
```

<img src="./MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0_01/image-20230206210924956.png" alt="image-20230206210924956" style="zoom:67%;" />

#### 多对多

多对多的关系在开发中属于也比较常见的。比如：学生和老师的关系，一个学生可以有多个授课老师，一个授课老师也可以有多个学生。在比如：学生和课程的关系，一个学生可以选修多门课程，一个课程也可以供多个学生选修。

##### 案例

学生与课程的关系

- 关系：一个学生可以选修多门课程，一门课程也可以供多个学生选择

- 实现关系：建立第三张中间表，中间表至少包含两个外键，分别关联两方主键

SQL脚本：

```mysql
--  ======================================多对多=============================
create table tb_student
(
    id   int auto_increment primary key comment '主键ID',
    name varchar(10) comment '姓名',
    no   varchar(10) comment '学号'
) comment '学生表';
insert into tb_student(name, no)
values ('黛绮丝', '2000100101'),
       ('谢逊', '2000100102'),
       ('殷天正', '2000100103'),
       ('韦一笑', '2000100104');


create table tb_course
(
    id   int auto_increment primary key comment '主键ID',
    name varchar(10) comment '课程名称'
) comment '课程表';
insert into tb_course (name)
values ('Java'),
       ('PHP'),
       ('MySQL'),
       ('Hadoop');


create table tb_student_course
(
    id         int auto_increment comment '主键' primary key,
    student_id int not null comment '学生ID',
    course_id  int not null comment '课程ID',
) comment '学生课程中间表';

insert into tb_student_course(student_id, course_id)
values (1, 1),
       (1, 2),
       (1, 3),
       (2, 2),
       (2, 3),
       (3, 4);
```

添加约束（建表完成后）

```mysql
alter table  tb_student_course add constraint  stu_sc_fk foreign key (student_id) references tb_student(id);
alter table  tb_student_course add constraint  course_sc_fk foreign key (course_id) references tb_course(id);
```

添加约束（建表完成前）

```mysql
constraint fk_courseid foreign key (course_id) references tb_course (id),
constraint fk_studentid foreign key (student_id) references tb_student (id)
```

