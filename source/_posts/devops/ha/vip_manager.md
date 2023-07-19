---
title: vip-manager
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2027-07-14 22:30:34
---

# vip-manager模块在优化后的方案中主要具有以下作用:
`vip-manager是连接patroni集群和客户端的重要模块,可以实现虚拟IP的灵活漂移,屏蔽后端复杂性,简化客户端访问。它与patroni集成可以提供一个高可用的分布式方案。`

1. 提供虚拟IP漂移能力

vip-manager可以检测patroni集群的leader变化,并将指定的虚拟IP绑定到当前的leader节点上。

2. 实现客户端无感知访问

通过vip-manager将虚拟IP漂移到当前leader节点,客户端只需要访问不变的虚拟IP即可,不需要感知后端leader的变化。

3. 与patroni集成

vip-manager可以监听patroni的leader选举信息,进行虚拟IP的自动漂移,与patroni无缝集成。

4. 防止网络分区场景下的脑裂

如果在网络分区场景下,出现双master情况,vip-manager只会将vip绑定到全局的leader上,可防止客户端访问到脑裂的节点。

5. 提高可用性

leader发生故障时,可通过vip-manager自动漂移vip完成快速故障转移,提高系统可用性。

6. 简化客户端配置

客户端只需要配置一个访问vip的地址,不需要关心后端leader变化,简化配置。

7. 支持多种分布式协调服务

vip-manager支持etcd/consul等多种分布式协调服务,提高兼容性。


## vip-manager主要通过环境变量来进行配置,关键的参数及其作用如下:


- VIP_INTERFACE: 指定虚拟IP所在网络接口,如eth0。

- VIP_IP: 虚拟IP地址。

- VIP_NETMASK: 虚拟IP网络掩码。 

- VIP_DCS_TYPE: 使用的分布式协调服务类型,如etcd,consul。

- VIP_DCS_ENDPOINTS: 分布式协调服务的地址,如etcd集群地址。

- VIP_TRIGGER_KEY: 在分布式协调服务中Leader信息的键,如/service/mycluster/leader。

- VIP_TRIGGER_VALUE: 触发绑定虚拟IP的节点值,如当前主节点的hostname。

- VIP_MANAGER_TYPE: vip-manager运行模式,一般为basic。

以etcd为例,示例配置:

```bash
VIP_INTERFACE=eth0
VIP_IP=192.168.0.100 
VIP_NETMASK=24
VIP_DCS_TYPE=etcd
VIP_DCS_ENDPOINTS=http://etcd1:2379,http://etcd2:2379
VIP_TRIGGER_KEY=/service/mycluster/leader
VIP_TRIGGER_VALUE=node1
VIP_MANAGER_TYPE=basic
```

此外,可以设置定时查找Leader的时间间隔,日志级别等参数进行调优。

vip-manager会根据这些参数,实现虚拟IP与服务Leader的动态绑定和漂移。

## vip-manager 通过以下参数进行更详细的调优
`通过调整以上参数,可以实现快速响应Leader切换,同时避免VIP抢占冲突、减少资源消耗等效果。需要根据实际环境测试得到最佳参数配置。`

1. 定时查找Leader时间间隔

- VIP_INTERVAL:定时检查Leader的时间间隔,单位为毫秒,默认是1000。

间隔时间可以设置更短一些,比如500ms,这样可以更快速地响应Leader切换,但间隔时间太短会增加抢占VIP时的冲突概率。

2. 日志级别

- VIP_LOGLEVEL:日志级别,可选DEBUG, INFO, WARNING, ERROR。

默认是INFO级别,根据实际需要可以调整。比如在调试时可以临时设置为DEBUG打印更详细日志。

3. 抢占VIP超时时间 

- VIP_TAKEOVER_TIMEOUT:抢占VIP的超时时间,单位秒,默认5秒。 

如果在此时间内抢占VIP失败,会中止当前尝试。可以设置略大于默认值,比如10秒。

4. 重试超时时间

- VIP_RETRY_TIMEOUT: 抢占VIP失败后的重试超时,默认3秒。

失败后可以更快重试,比如设置为1秒。但重试间隔不能太短,否则可能重复抢占VIP。

5. keepalive检测时间

- VIP_KEEPALIVE_PERIOD: 检测已拥有VIP的主机失效的间隔,默认1秒。

可以设置稍大一点的值,比如3秒,减少keepalive带来的性能开销。

