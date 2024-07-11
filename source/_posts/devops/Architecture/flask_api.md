---
title: flask 使用高并发下引发系统崩溃修复记录
tags:
  - python
categories:
  - 开发笔记 
date: 2024-05-27
---
# 优化目标一
## 1、`数据库连接池报错，连接被强制断开`
```
def get_db():
    # 通过是使用scoped_session 来为每一个线程都创建一个安全的线程
    db_session = scoped_session(SessionLocal)
    try:
        return db_session
    finally:
        db_session.close()
```

## 2、`http请求 被强制拒绝并断开`
```
在gunicorn 启动时sendfile 值设置为Flase
```

## 3、gunicorn 多线程导致请求拒绝
- [flask+Gunicorn(gevent)高并发的解决方法探究](https://blog.csdn.net/weixin_46072106/article/details/109708788)

# 优化目标二
- `针对 acl，负债均衡，安全组 部分数据获取进行查询性能优化`

## 一、问题定位

## 二、针对acl部分
### 1、排除sql响应慢
```sql
SELECT
  IPNetwork.file_path,
  IPNetwork.cidr,
  IPNetwork.ip,
  IPNetwork.cnf_type,
  IPNetwork.direction,
--   IPNetwork.mask AS "_mask",
  IPNetwork.`desc`,
  IPNetwork.port,
  IPNetwork.row_id
FROM
  IPNetwork
WHERE
  IPNetwork.cidr IN (`172.21.0.0/32', '172.21.0.0/31'`)
GROUP BY
  IPNetwork.file_path,
  IPNetwork.direction
ORDER BY
  IPNetwork.mask DESC
```
### 2、走查代码，判断是否有异常处理逻辑
```python
    def get_network(self, cidr) -> IPNetwork:
        result = None
        # ip_net = ipaddress.ip_network(cidr, strict=False)
        parents = get_cidr_parents(cidr)
        query = (
             self.db.query(network_repo.model)
             .filter(network_repo.model.cidr.in_(parents))
             .order_by(network_repo.model.mask.desc())
         )
        lis = network_repo.QueryList(query)
        if lis:
            result = lis[0]
        return result
```
- 备注： 此段代码逻辑，在查询返回时，对象未反按marshmallow 对数据库返回信息进行序列化，同时sql查询返回数量很大，却支取一条数据
- 结论： 针对这段内容进行sql查询逻辑优化，在保留原有查询逻辑基础下
```python
    def get_network(self, cidr) -> IPNetwork:
        result = None
        parents = get_cidr_parents(cidr)
        query = self.db.query(
            func.max(IPNetwork.mask).label('mask'),
            IPNetwork.cidr,
            IPNetwork.desc,
            IPNetwork.cnf_type
        )
        query = query.filter(IPNetwork.cidr.in_(parents))
        query = query.order_by(IPNetwork.mask.desc())
        result = query.all()
        return result
```

## 三、针对安全组的查询优化
### 1、排查后发现安全组部分，采用json的方式进行数据读取，且json配置比较大
```
由于json较为大同时，json在并发读取时，存在文件打开锁，限制了接口性能
```
### 2、优化方案
```
采用将整个安全组数据存储到数据库中，大约15w行数据，并为关键字段构建查询索引
```

## 四、针对LB（负债均衡）
### 问题
```
LB的数据量没有安全组大，但是依然会影响整个接口的响应效率，
```
### 优化方案
```
采用将整个安全组数据存储到数据库中,并为关键字段构建查询索引
```

## 五、接口中LB、SG、ACL、F5 几大类的线性查询返回改造
```
采用线程池的方式，进行并发异步查询每一个大类的数据
```


























