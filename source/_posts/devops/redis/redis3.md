---
title: Redis 数据安全&性能保障
tags:
  - redis
categories:
  - DevNote 
date: 2021-07-19 23:30:34
---
## Redis 数据安全&性能保障
1. 持久化
  ---
    方式：
        快照
        只追加文件

2. 主从复制
  ---
     只需在从数据库的配置文件中加入 slaveof 主数据库地址  主数据库端口
     INFO [section]  查看db基本信息
     slaveof no one  将从db提升为主数据库

3. sentinel
  ---
      sentinel 启动的时候会读取配置文件的内容，通过下列方式找到需要监控的主数据库
      sentinel monitor master-name ip redis-port quorum
            master-name 主数据库名称
            ip 表示当前系统中的主数据库的地址
            redis-prot 当前系统redis的端口
            quorum 表示执行故障恢复的操作前需要几个哨兵节点同意
4. 集群
  ---
      1.配置修改(每一个数据库的配置文件)
         prot：6380
         cluster-enabled yes
      2.节点增加
         cluster meet ip prot
      3.插槽的分配
      4.获取插槽与之对应的节点
      5.故障恢复

5. redis事务
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
