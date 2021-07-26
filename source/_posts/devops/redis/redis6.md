---
title: 降低Redis内存占用率 
tags:
  - redis
categories:
  - DevNote 
date: 2021-07-33 24:30:34
---

# 降低Redis内存占用率 
降低redis 内存占用率有助于减少创建快照和加载快照所需的时间、
提升载入AOF文件和重写AOF文件时的效率、
缩短从服务器同步所需要的的时间，并且让redis可以存储更多的数据而无需添加额外的硬件。

## 短结构
redis 为列表、集合、散列、有序集合提供了组配置选项即短结构；

配置项|     
--------|
list-max-ziplist-entries 128 
list-max-ziplist-value 64 
zset-max-ziplist-entries 128 
zset-max-ziplist-value 64 
hash-max-ziplist-entries 512 
hash-max-ziplist-value 64 

>-max-ziplist-entries 选项说明列表、散列、有序集合在被编码情况下允许的最大元素数量
>-max-ziplist-value 选项则说明压缩列表每个节点的最大体积的多少个字节。
>当以上这些选项被突破时redis 就会将对应的类型压缩列表编码转换为其他结构，从而导致内存占用增加。
>即使后面key 的体积减少了且满足了设置值，但是也不会将结构重新压缩转换为压缩列表

调试方式判断一个结构是否为压缩列表 
```python
conn.rpush('testKey', 'a', 'b', 'c', 'd')
conn.debug_object('testKey') # 'encoding': 'ziplist'
'''
{'encoding': 'ziplist', 'refcount': 1, 'lru_seconds_idle': 0,  
'lru': 274846, 'at': '0xb6c9f120', 'serializedlength': 36,  
'type': 'Value'}
'''
# 增加列表体积使其突破限制
conn.rpush('testKey', 65*'a')
conn.debug_object('testKey')# 'encoding': 'linkedlist' 
'''
{'encoding': 'linkedlist', 'refcount': 1, 'lru_seconds_idle': 10,   
'lru': 274851, 'at': '0xb6c9f120', 'serializedlength': 30,          
'type': 'Value'}
'''
```

## 分片结构

### 分片散列

### 分片集合

## 打包存储二进制后字节