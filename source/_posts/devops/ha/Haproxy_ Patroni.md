---
title: Haproxy可以与Patroni配合
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2022-06-05 22:30:34
---

# Haproxy可以与Patroni配合
`通过Haproxy+Patroni可以实现PostgreSQL的读写分离、故障自动转移、流量代理等功能,从而提供一个高可用的PostgreSQL服务。`

## Haproxy可以与Patroni配合,提供高可用的PostgreSQL服务。主要步骤如下:

1. 配置Patroni管理PostgreSQL集群,让Patroni监控和管理PostgreSQL主备切换。

2. 配置Haproxy作为Proxy,通过定期查询Patroni的REST API获取PostgreSQL主节点信息。

3. Haproxy根据Patroni提供的主节点信息,自动调整后端PostgreSQL节点的权重,将读写请求转发到主节点。

4. 当Patroni进行主备切换时,会更新REST API中的主节点信息。Haproxy会自动获取新的主节点信息,调整后端权重,实现无感知的主备切换。

5. 可以配置多个Haproxy实例组成集群,提高代理层的高可用性。

6. 通过Keepalived配置Haproxy的虚IP漂移,隐藏后端拓扑结构变化。 

7. 另外,还可以配合监控系统监控Haproxy和PostgreSQL的运行状态。

