#!/bin/bash

# 设置变量
MYSQL_VERSION="5.7"
MYSQL_CONTAINER_NAME="mysql"
MYSQL_ROOT_PASSWORD="fanfan"
MYSQL_CONF_DIR="/docker/mysql/conf"
MYSQL_DATA_DIR="/docker/mysql/data"
MYSQL_LOG_DIR="/docker/mysql/log"
MY_CNF_FILE="$MYSQL_CONF_DIR/my.cnf"

# 拉取 MySQL 镜像
echo "Pulling MySQL $MYSQL_VERSION image..."
docker pull mysql:$MYSQL_VERSION

# 创建映射挂载目录
echo "Creating directories for MySQL..."
mkdir -p $MYSQL_CONF_DIR/conf.d
mkdir -p $MYSQL_CONF_DIR/mysql.conf.d
mkdir -p $MYSQL_DATA_DIR
mkdir -p $MYSQL_LOG_DIR

# 创建 MySQL 配置文件
echo "Creating my.cnf file..."
cat <<EOF > $MY_CNF_FILE
[client]
# 设置客户端的默认字符集为utf8
default-character-set=utf8

[mysql]
# 设置MySQL命令行工具的默认字符集为utf8
default-character-set=utf8

[mysqld]
# 个人设置
# 设置默认存储引擎为InnoDB
default_storage_engine = InnoDB
# 表名大小写不敏感
lower_case_table_names = 1

# 日志设置
# 错误日志文件路径
log-error = /var/log/mysql/error.log
# 启用慢查询日志
slow-query-log = 1
# 慢查询日志文件路径
slow-query-log-file = /var/log/mysql/slow.log
# 定义慢查询的时间阈值为10秒
long_query_time = 10

# 性能优化设置
# 设置关键缓冲区大小
key_buffer_size = 256M
# 禁用查询缓存（MySQL 8.0后移除查询缓存）
query_cache_type = 0
# 设置查询缓存的大小限制
query_cache_limit = 1M
# 设置线程缓存大小
thread_cache_size = 16
# 设置InnoDB缓冲池大小，根据可用内存调整，建议不超过总内存的70%
innodb_buffer_pool_size = 512M
# 设置InnoDB日志文件大小
innodb_log_file_size = 128M
# 平衡性能和数据安全性，生产环境可能需要设为1
innodb_flush_log_at_trx_commit = 2
# 为每个表使用单独的表空间文件
innodb_file_per_table = 1
# 设置最大连接数，根据实际需要调整
max_connections = 500

# Innodb 设置
# 使用直接I/O以减少操作系统的缓存冲突
innodb_flush_method = O_DIRECT
# 设置InnoDB的I/O容量，根据硬件性能调整
innodb_io_capacity = 2000
# 设置InnoDB的读I/O线程数
innodb_read_io_threads = 4
# 设置InnoDB的写I/O线程数
innodb_write_io_threads = 4

# 内存设置
# 设置表缓存大小，根据表数量调整
table_open_cache = 2000
# 调整排序缓冲区大小，避免排序操作过多使用临时文件
sort_buffer_size = 4M
# 调整连接缓冲区大小，优化连接操作
join_buffer_size = 4M

# 查询优化
# 调整临时表大小，避免使用磁盘临时表
tmp_table_size = 64M
# 设置最大堆表大小
max_heap_table_size = 64M
# 调整读缓冲区大小，优化全表扫描
read_buffer_size = 2M
# 调整随机读缓冲区大小
read_rnd_buffer_size = 4M

# 连接设置
# 设置连接超时时间，释放不活跃的连接
wait_timeout = 600
# 设置交互式连接超时时间
interactive_timeout = 600

# 主从复制设置
# 设置服务器唯一ID
server-id = 1
# 设置二进制日志过期时间
expire_logs_days = 10
# 启用二进制日志
log_bin = /var/log/mysql/mysql-bin.log
# 设置二进制日志格式
binlog_format = ROW
# 确保每次事务提交后同步二进制日志
sync_binlog = 1

# 安全设置
# 设置绑定地址为0.0.0.0，允许远程连接
bind-address = 0.0.0.0
# 禁止DNS解析，提升性能
skip-name-resolve
# 禁止符号链接，增加安全性
skip-symbolic-links
# 禁用本地文件加载，防止安全漏洞
local-infile = 0
EOF

# 运行 Docker 命令启动 MySQL 容器
echo "Starting MySQL container..."
docker run -p 3306:3306 --name $MYSQL_CONTAINER_NAME \
-v $MYSQL_LOG_DIR:/var/log/mysql \
-v $MYSQL_DATA_DIR:/var/lib/mysql \
-v $MYSQL_CONF_DIR:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
-d mysql:$MYSQL_VERSION

# 设置 MySQL 容器随 Docker 自启动
echo "Setting MySQL container to restart always..."
docker update $MYSQL_CONTAINER_NAME --restart=always

# 检查 MySQL 容器状态
echo "Checking MySQL container status..."
docker ps | grep $MYSQL_CONTAINER_NAME

echo "MySQL setup completed successfully."
