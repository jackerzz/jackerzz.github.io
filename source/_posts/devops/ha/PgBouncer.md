---
title: pgbouncer & Haproxy
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2027-07-14 22:30:34
---
# pgbouncer 是什么
pgbouncer 是一个轻量级的连接池工具,主要用于为 PostgreSQL 数据库提供连接池功能。

pgbouncer 的主要概念包括:

- 连接池:pgbouncer 会维护一个数据库连接池,应用程序请求数据库连接时可以直接从连接池获取,而不需要每次都重新连接数据库。这可以显著提高数据库访问性能。

- 会话:pgbouncer 中的每个客户端连接称为一个会话(Session)。客户端首先连接到 pgbouncer,pgbouncer 然后从连接池获取一个数据库连接与客户端会话关联。 

- 事务池:为了提高性能,pgbouncer 会为每个数据库用户维护一个事务池(Transaction pool)。事务池包含一个或多个数据库连接,这些连接由 pgbouncer 重复使用,从而避免连接池和后端数据库之间的连接开销。

使用 pgbouncer 可能面临的一些技术风险包括:

`为了降低这些风险,需要合理配置 pgbouncer,做好监控,并与应用程序代码和数据库体系结构保持一致。`

- 连接泄露:应用程序忘记或无法正确关闭连接会导致连接池中连接的泄露和堆积。这会降低连接池的效率。

- 过载保护缺失:pgbouncer 自身缺乏对突发流量过载的保护,可能会导致性能问题。

- 单点故障:pgbouncer 自身可能成为单点故障。

- 降低可见性:pgbouncer 作为代理,将应用和数据库进行了隔离。这会隐藏后端数据库的很多信息,降低数据库性能和错误的可见性。

- 额外复杂性:pgbouncer 引入了额外的组件和连接层。这增加了系统复杂性,也增加了故障点。



# Haproxy 配合 pgbouncer 实现方式与技术风险

`HAProxy 可以与 PgBouncer 配合使用,以实现数据库连接的负载均衡。`

## 常见的实现方式是:
`这种方式可以实现数据库读写分离、连接池管理、故障转移等目的。`
- 在后端数据库服务器上部署多个 PgBouncer 实例,每个数据库一个 PgBouncer。

- 在前端使用 HAProxy 做流量分发,将应用请求分发到后端的 PgBouncer 节点。

- PgBouncer 再根据规则将连接请求分发到具体的数据库。



## 使用 HAProxy + PgBouncer 可能面临的技术风险包括:

- HAProxy 单点故障风险。HAProxy 若下线,将导致服务中断。

- 配置错误风险。HAProxy 和 PgBouncer 的配置如果不匹配,会导致连接问题。

- 过载问题。网络或 PgBouncer 过载可能导致连接问题。

- 日志和监控问题。由于多组件运维,日志和监控更为复杂。

- 额外系统复杂度。多组件联动带来的额外 debugging 和维护成本。


## 参考资料
- [pgbouncer](https://github.com/pgbouncer/pgbouncer)