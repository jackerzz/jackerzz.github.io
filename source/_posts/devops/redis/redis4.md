---
title: Redis 开发笔记
tags:
  - redis
categories:
  - DevNote 
date: 2021-07-19 21:30:34
---

## Redis 开发笔记    

## [像db一样的操作redis](https://blog.csdn.net/w13528476101/article/details/70146064)
    
    全局索引：
        key值构建：idx:[表名]
        value值构建：主键set集合
        sadd idx:user:1....n
        sort idx:user get go:user:*
            缺陷：在redis分片集群中，如果data:student:x[1,2,3,4,5]与idx:student不完全在同一个集群，则不支持sort get 命令组合
            lua && Piplining

    分页查询：
        sort idx:user get go:user:* limit 0 4                  ===> sort key get key:* limit offset count

    条件查询：
        key值构建：idx:[表名]:[字段名]:[字段值]
        
        value值构建：主键set集合
        设置查询key：sadd idx:user:add 1 2 3 4 5 6 7 8 9        ===> sadd key member
                查询：
                    sort idx:user:addr get go:user:*           ===> sort key get key:*
                    
        设置查询key：sunionstore destination  key [key]         ---> select * from user where addr in("gaodi","shanghai") 
                查询：
                    sort key get key:*
                    
        构建区间条件索引（field >= ? and field < ?）
            key值构建：idx:[表名]:[字段名]
            value值构建：主键zset集合([value:[主键],score:[字段值]])
                idx:student:age -> [{value:4,score:15},{value:2,score:16},{value:1,score:17},{value:3,score:17},{value:5,score:17}]
        
        设置查询key：
                查询：
        
        构建索引记录
            key值构建：record:[表名]:[主键]
            value值构建：索引set集合
                srem key  member [member.....]
                zrem key member [memeber....]

## key 过期策略
    1.使用zset把主键，过期参照字段存储起来
    2.使用redis键空间通知（keyspace notification）


## 写删除并未支持事务一致性
    
     HDEL 每次只能删除单个域，如果你需要在一个原子时间内删除多个域，请将命令包含在 MULTI / EXEC 块内。
     DEL/SET/HSET  如果你需要在一个原子时间内删除多个域，请将命令包含在 MULTI / EXEC 块内。

## 监视器与慢查询日志

key     | 描述 | 对应的功能 
-------- | ----- | -----
monitor | [实时打印出 Redis 服务器接收到的命令,调试用](http://doc.redisfans.com/server/monitor.html) | 可以实现将客户端变成一个监视器 
showlog | [Slow log 是 Redis 用来记录查询执行时间的日志系统](http://doc.redisfans.com/server/slowlog.html) | 可以实现将客户端变成一个性能分析器

### monitor 源码实现
```python
import redis        

class Monitor():
    def __init__(self, connection_pool):
        self.connection_pool = connection_pool
        self.connection = None

    def __del__(self):
        try:
            self.reset()
        except:
            pass

    def reset(self):
        if self.connection:
            self.connection_pool.release(self.connection)
            self.connection = None

    def monitor(self):
        '''
            
        '''
        if self.connection is None:
            self.connection = self.connection_pool.get_connection(
                'monitor', None)
        self.connection.send_command("monitor")
        return self.listen()

    def parse_response(self):
        return self.connection.read_response()

    def listen(self):
        while True:
            yield self.parse_response()

if  __name__ == '__main__':
    pool = redis.ConnectionPool(host='localhost', port=6379, db=0)
    monitor = Monitor(pool)
    commands = monitor.monitor()

    for c in commands :
        print(c)
    
    # 实验结果
    '''
    b'OK'
    b'1627285732.869499 [0 127.0.0.1:59306] "COMMAND"'
    b'1627285745.409360 [0 127.0.0.1:59306] "KEYS" "*"'
    b'1627285757.745049 [0 127.0.0.1:59306] "get" "key"'
    b'1627285790.641467 [0 127.0.0.1:59306] "get" "privkey"'
    '''
```

## 参考资料
- [redis doc](http://doc.redisfans.com/)