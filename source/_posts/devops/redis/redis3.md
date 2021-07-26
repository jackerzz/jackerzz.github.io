---
title: Redis 数据安全&性能保障
tags:
  - redis
categories:
  - DevNote 
date: 2021-07-19 23:30:34
---
## Redis 数据安全&性能保障
redis 提供两种方式将数据存储到硬盘,方便以后数据重用或者防止系统故障而将数据备份到一个远程位置。

- redis 持久化配置选项
```python
# 当60s 之内有10000 次写入 就自动触发一次 BGSAVE 命令
save 60 10000

stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb # 指定写入文件名称
# 以上是快照持久化配置

appendonly no
appendfilename "appendonly.aof"
appendfsync everysec 
'''
everysec：每秒执行一次同步(最多只会丢失1s内的数据); 
always:每个redis 命令都要同步写入硬盘(不建议使用,较为消耗性能,且受到硬盘的限制【机械：每秒大约200命令;ssd: 每秒大约几百万个命令】; )
no: 让操作性来决定何时同步(不建议使用)
'''
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100   # 重写后，当AOF文件变得更大之后才会执行重写操作，但是也会让redis 还原数据需要的时间变得更长
auto-aof-rewrite-min-size 64mb    # 当AOF 文件达到64mb后创建子进程移除AOF中沉余的命令实现重写并减小文件大小
dir ./              # 快照存储的路径
# 以上是AOF持久化选项配置
```

### 快照(snapshotting) 与 AOF
#### 快照使用方式：
  
  >1. 发送BGSAVE
      client 通过redis 发送BGSAVE 命令来创建一个快照,
      redis 会fork 创建一个子进程来执行备份,父进程继续接收命令处理业务。
  
  >2. 发送save 命令
      client 通过redis 发送save 命令来创建一个快照,
      接到命令后redis服务不再接收任何命令直至备份完成(不建议使用)
  
  >3. 发送SHUTDOWN命令 or term 信号时 会触发 2 中的流程

  >4. 当一个redis 服务连接到另一个redis 服务并向对方发送sync 命令
      主服务没有执行BGSAVE操作,或者主服务器不是gang       

#### AOF：
  >1. 短期来看AOF 是一个不错的选择,但是随着redis 不断的操作命令写入 AOF文件会越来越大,最终会越来越慢
  >2. 为了解决1遇到的问题, 可以通过客户端发送 BGREWRITEAOF 命令,通过移除AOF中沉余的命令来重写AOF 文件,

### 主从复制
  ---
     只需在从数据库的配置文件中加入 slaveof 主数据库地址  主数据库端口
     INFO [section]  查看db基本信息
     slaveof no one  将从db提升为主数据库

### sentinel
  ---
      sentinel 启动的时候会读取配置文件的内容，通过下列方式找到需要监控的主数据库
      sentinel monitor master-name ip redis-port quorum
            master-name 主数据库名称
            ip 表示当前系统中的主数据库的地址
            redis-prot 当前系统redis的端口
            quorum 表示执行故障恢复的操作前需要几个哨兵节点同意
### 集群
  ---
      1.配置修改(每一个数据库的配置文件)
         prot：6380
         cluster-enabled yes
      2.节点增加
         cluster meet ip prot
      3.插槽的分配
      4.获取插槽与之对应的节点
      5.故障恢复

### redis事务
  ---
      unwatch  命令在watch执行后、multi执行之前对数据进行rest
      watch    监视一个或多个key 
      discard  命令在multi命令执行之后、exec执行之前对之前的链接rest
      multi    开始一个新的事务、并将多个命令入队到队列之后  
      exec     结束
      --------------------------------------
      expire key increment  设置key的有效时间(1表示成功，0表示失败)
      ttl  key              查看key的有效时间(-2表示不存在key，-1表示永远即没有设置失效时间)
      
      ----------------------------------------
      sort key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
               key可以是集合、列表、有序集合  
               desc     倒排序
               limit    返回指定范围的值   
         by  srot不在对元素值进行排序，而是对每个元素使用元素的值替换参考键中的第一个 “*” 并获取值，然后对该值进行排序
         get 不影响排序，作用是使sort返回的值不在是元素自身的值，而是get参数中指定的值
         store 将sort排序的结果进行保存到11111111111指定的key中
         性能优化--时间复杂度----> O(n+mlog(m))
            1.尽可能减少待在排序键中的元素的数量(使n尽可能的小)
            2.使用limit参数只获取需要的数据(使m尽可能的小)
            3.如果要排序的数据据较大，尽可能使用store参数将结果缓存

### 性能测试
使用redis 自带 redis-benchmark 来做测试并优化性能

性能或错误     | 可能的原因 | 解决办法
-------- | ----- | -----
单个客户端的性能达到redis-benchmark的 50%~60%  | 这是不使用流水的性能预测|无
单个客户端的性能达到redis-benchmark的 25%~30%   | 对于每一个新的命令都创建新的连接|重用已有的连接
单个客户端返回错误 "cannot assign requested address"   | 对于每一个新的命令都创建新的连接|重用已有的连接

                                                     
                                                                                      
## 结语
1. 使用主从复制和AOF持久化可以极大的保障系统数据安全
2. 多个客户端同时处理数据时，可以使用 watch、multi、exec 等命令来防止数据出错