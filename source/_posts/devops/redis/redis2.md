---
title: Redis 命令详细介绍
tags:
  - redis
categories:
  - 开发笔记 
date: 2021-07-19 21:30:34
---

## Redis 命令

### 字符串

key使用方式 | 功能描述
-------- | ----- 
incr key-name | key 的存储的值加1
decr key-name | key 的存储的值减1 
incrby key-name amount |key 存储的值加上整数amount
decr key-name amount |  key 存储的值减去整数amount
incrbyfloat key-name amount |  key 存储的值加上浮点数amount
append key-name value | 
getrange key-name start end |
setrange key-name offset |
getbit key-name offset |
setbit key-name offset value |
bitcount |
bitop operation dest-key key-name [key-name...]|

### 列表

key使用方式 | 功能描述
-------- | ----- 
rpush key-name value [value...]  |
lpush key-name value [value...] |
rpop  key-name |
lpop  key-name |
lindex key-name offset |  返回列表中偏移量为offset 的元素
lrange key-name start end |
阻塞式和移动的列表弹出   | dest-key => 目标key source-key => 原始key
blpop  key-name [key-name...] timeout  |
brpop  key-name [key-name...] timeout |
rpoplpush  source-key dest-key |
brpoplpush source-key dest-key timeout |

### 集合

key使用方式 | 功能描述
-------- | ----- 
sadd key-name item [item...] |   添加并返回新加入元素数量
srem key-name item [item...] |   删除并返回删除被删除数量
sismember key-name item |   检查item是否存在于key-name里 
scard key-name |  返回key-name 数量
smembers key-name  |   返回key-name 包含的all元素值
srandmember key-name [count] |   随机返回一个或多个元素
spop key-name |   随机删除并返回被删除元素
smove source-key dest-key item  | 移动元素成功1失败0
组合和多集合处理 |
sdiff key-name [key-name...]  |   差集运算
sdiffstore dest-key key-name [dest-name...]  | 差集运算
sinter key-name [key-name....] | 交集计算
sinterstore dest-key key-name [key-name...] |  交集计算  
sunion key-name [key-name...] |   并集计算
sunionstore dest-key key-name [key-name...] |   并集计算

### 散列

key使用方式 | 功能描述
-------- | ----- 
 hmget   key-name [key...] |
 hmset   key-name key value [key value ...] |
 hdel key-name key [key ...] |
 hlen key-name |
 hexists key-name key | 检查给定key是否存在
 hkeys key-name | 获取散列包含的所有key
 hvals key-name | 获取散列包含的所有value
 hgetall key-name | 获取散列包含的所有的k-v值对
 hincrbyfloat key-name key increment | 将key 存储的值加上浮点数increment

### 有序集合

key使用方式 | 功能描述
-------- | ----- 
 zadd key-name score member [score member ...] | 将给定的socre的member加到有序集合里
 zrem key-name member [member ...] |  移除member 并返回 移除的数量
 zcard key-name | 返回有序集合包含的member 数量
 zincrby key-name increment member | 将member的score 加上increment
 zcount key-name min max |   返回介于min和max间的成员数量
 zrank key-name member |返回member 在有序集合中的排名
 zrange key-name start stop [withsocres] |  返回介于start 和 stop 的成员、若带有withsocres 参数则一并返回 socre
 
 范围型数据处理、交并集命令 |
 zrevrank key-name member | 返回有序集合里成员member的排名，按照sorce 排名
 zrevrange key-name start stop [withscores] | 返回有序集合排名范围内的member、按照score排名
 zrangebyscore key min max [withscores] [limit offset count] | 返回score 介于min max 之间的所有成员
 zrevrangebyscore key min max [withscores] [limt offset count] | 返回有序集合中score 介于min max之间的member，按照score进行排序
 zremrangebyrank  key-name start stop | 移除score排名介于start stop 之间的所有member
 zunionstore dest-key key-count key [key ...] [weights weight [weight...]]  |


### 发布订阅

key使用方式 | 功能描述
-------- | ----- 
subscribe channel [channel ...] |   订阅给定的一个或多个频道
unsubscribe [channel [channel ...]]  | 退订给定的一个或多个频道，如果执行时没有给定任何频道，那么退订所有频道
publish channel message | 向给定频道发送消息 
psubscribe pattern [pattern ...] |  订阅与给定模式相匹配的所有频道
punsubscribe [pattern [pattern ...]] |  退订给定的模式，如果执行时没有给定任何模式，那么退订所有模式

### 其他命令

根据根底的选项，对于输入列表、集合或者有序集合，然后返回或者存储排序结果
```bash
sort source-key [by patern] [limit offset count] [get pattern [get pattern ...]] [asc|desc] [alpha] [store dest-key]
```

对给定的有序集合执行类似的交集运算
```bash
zinterstore dest-key key-count key [key...] [weights weight [weight...]] [aggregate sum|min|max]
```