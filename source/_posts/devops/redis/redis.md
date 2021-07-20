---
title: Redis 基本数据结构使用
tags:
  - redis
categories:
  - DevNote 
date: 2021-07-19 20:30:34
---

# Redis 基本数据结构使用

1. 切换数据库
  ---
     select 1 

2. 字符串(string) 
 ---
    GET       获取存储在给定key中的值
    SET       设置存储在给定key中的值
    DEL       删除存储在给定key中的值
    incr key  递增数字
       场景：
            视频/文章访问量统计  incr post:video:page.view
            实现关系db中的唯一id自增
    incr key increment    增加指定的整数
    decr key              递减数字
    decr key increment    减少指定的整数
    append key value      向尾部追加值
    strlen key            获取string 的长度
    mget key [key ...]    批量获取key的值
    mset key value [key value ...] 批量设置key - value
      
3. 列表(linked-list)
  ---
    rpush   将给定的值推入list 的右端
    lpush   将给定的值推入list 的左端 
    lpop    从列表的左端弹出一个值，并返回被弹出的值
    rpop    从列表的右端端弹出一个值，并返回被弹出的值
    ------------------------------------------------
    llen                      获取列表中的元素的个数
    lrange key start stop     返回索引start - stop间的all 元素 
    lrem   key  count value   
          count > 0     删除左边开始前 count 个值
          count < 0     删除右边开始前 |count| 个值  
          count = 0     删除all的值
    -------------------------------------------------
    lindex  key index   返回指定索引的元素
    ltrim key start end 只保留list指定的片段
    linsert key before|after pivot value  
          ===>在pivot 点before|after 插入 value
    rpoplpush source destination 
          ===>先从source列表右边rpop一个元素，然后加入到destination列表的左边  
          --->网站监控系统；循环的检查网站的可用性

4. 散列(hash)
 ---
     hset key field value         在hash中关联器给定的键值对
     hget key field               获取指定的hash key 的值
     hdel key field [field ...]   存在则移除给定的key
     hgetall key                  获取给定的key 返回的field
     hmset key field value [field value ...]  
     hmget key field [field ...]
     hexists key field            判断key的字段是否存在
     hsetnx key field value       当前字段不存在时赋值(如果不存在则不执行)
     hincrby key field increment  增加指定的数字(if 不存在 则默认初始值为0然后自增 increment) 
     -------------------------------------------------------
     hkeys key    获取key中的散列所有field 
     hvals key    获取key中的散列所有value
     -------------------------------------------------------
     
5. 集合(set)
  ---
      sadd key member [member ...]         将给定元素添加到集合
      srem key member [member ...]         如果给定元素存在则执行删除
      smembers key                         返回集合包含的all元素
      sismember key member                 检查给定元素是否存在集合中
      
      -------------------------集合运算---------------------------
      sdiff key [key ...]       差集运算
      sinter key [key ...]      交集运算
      sunion key [key ...]      补集运算

      --------------------------other-----------------------------
      scard key 获取集合key中的元素个数
      sdiffstore destination key [key ...]
      sinterstore destination key [key ...]
      sunionstore destination key [key ...]
      spop key   从集合中弹出一个元素

6. 有序集合(zset)
  ---
       key      ---> 成员(member)
       value    ---> 分值(score)
       -----------------------------------
       zadd key score member [score member ...]    将给定member的score 设置到zset里
       zscore key member    获取元素的score

       ---------------------获得排名在某个范围的元素列表(member)---------------------------------
       zrange key start stop [withscores]            注： withscores 会返回 member score [member score...]
       zrevrange key start stop [withscores]

       ----------------------获取指定score范围的元素--------------------------------------------
       zrangebyscores key min max [withscores] [limit offset count]
                ===> 按照元素的score从小到大排列member
       
       zrem                 如果member 在zset中则移除这个成员
       zincrby key increment member   增加member的score

       ------------------------获得member的排名---------------------------------------
       zrank key member
       zrevrank key member 
       
       ------------------------计算有序集合的交集-----------------------------------------
       zinterstore destination numkeys key [key ...] [weights wight [weight ...]] [aggregate sum|min|max]   
       ------------------------其他--------------------------------------
       zcard key              获取集合元素中的数量
       zcount key min max     获取指定 score范围的member 个数
       zrem                   如果member 在zset中则移除这个成员
       zremrangebyrank key start stop 按照rank范围删除元素
       zremrangebyscore key start stop 按照score范围删除元素 


## 其他命令
1. keys pattern
```text
   ? 匹配一个字符串
   * 匹配任意
   [] 匹配[]里面的一个字符
   -  表示范围 eg： a[a-b] ==> ab、ac、ad
   \x 匹配字符x，用于转义符号
```

2. exists key ==> 判断key是否存在
```bash
     del key [key ...]
     type key  #获取key类型 
```