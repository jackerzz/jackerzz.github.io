---
title: 模拟真实环境的延迟给PGSQL进行测试
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2023-08-11 22:30:34
---
# 简介
# 目的
# 内容
## Linux网络流量控制工具—Netem
### 第一篇：概念篇         

Netem 是 Linux 2.6 及以上内核版本提供的一个网络模拟功能模块。该功能模块可以用来在性能良好的局域网中，模拟出复杂的互联网传输性能，诸如低带宽、传输延迟、丢包等等情况。使用 Linux 2.6 (或以上) 版本内核的很多发行版 Linux 都开启了该内核功能，比如Fedora、Ubuntu、Redhat、OpenSuse、CentOS、Debian等等。tc 是 Linux 系统中的一个工具，全名为traffic control（流量控制）。tc 可以用来控制 netem 的工作模式，也就是说，如果想使用 netem ，需要至少两个条件，一个是内核中的 netem 功能被包含，另一个是要有 tc 。

 

### 第二篇：原理

TC用于Linux内核的流量控制，主要是通过在输出端口处建立一个队列来实现流量控制。接收包从输入接口（Input Interface）进来后，经过流量限制（Ingress Policing）丢弃不符合规定的数据包，由输入多路分配器（Input De-Multiplexing）进行判断选择：如果接收包的目的是本主机，那么将该包送给上层处理；否则需要进行转发，将接收包交到转发块（Forwarding Block）处理。转发块同时也接收本主机上层（TCP、UDP等）产生的包。转发块通过查看路由表，决定所处理包的下一跳。然后，对包进行排列以便将它们传送到输出接口（Output Interface）。一般我们只能限制网卡发送的数据包，不能限制网卡接收的数据包，所以我们可以通过改变发送次序来控制传输速率。Linux流量控制主要是在输出接口排列时进行处理和实现的。

 

### 第三篇：应用篇

工具可完成如下功能：（故障模拟） 模拟时延，丢包，重复包，乱序。

#### 1、模拟延迟传输

　　# tc  qdisc  add  dev  eth0  root  netem  delay  100ms

　　该命令将 eth0 网卡的传输设置为延迟100毫秒发送。 
　　更真实的情况下，延迟值不会这么精确，会有一定的波动，我们可以用下面的情况来模拟出带有波动性的延迟值：
　　# tc  qdisc  add  dev  eth0  root  netem  delay  100ms  10ms
　　该命令将 eth0 网卡的传输设置为延迟 100ms ± 10ms （90 ~ 110 ms 之间的任意值）发送。 
　　还可以更进一步加强这种波动的随机性：
　　# tc  qdisc  add  dev  eth0  root  netem  delay  100ms  10ms  30%
　　该命令将 eth0 网卡的传输设置为 100ms ，同时，大约有 30% 的包会延迟 ± 10ms 发送。
#### 2、模拟网络丢包
　　# tc  qdisc  add  dev  eth0  root  netem  loss  1%
　　该命令将 eth0 网卡的传输设置为随机丢掉 1% 的数据包。
　　也可以设置丢包的成功率：
　　# tc  qdisc  add  dev  eth0  root  netem  loss  1%  30%
　　该命令将 eth0 网卡的传输设置为随机丢掉 1% 的数据包，成功率为 30% 。
#### 3、模拟包重复
　　# tc  qdisc  add  dev  eth0  root  netem  duplicate 1%
　　该命令将 eth0 网卡的传输设置为随机产生 1% 的重复数据包 。
#### 4、模拟包损坏
　　# tc  qdisc  add  dev  eth0  root  netem  corrupt  0.2% 
　　该命令将 eth0 网卡的传输设置为随机产生 0.2% 的损坏的数据包 。 (内核版本需在2.6.16以上）
#### 5、模拟包乱序
　　# tc  qdisc  change  dev  eth0  root  netem  delay  10ms   reorder  25%  50%
　　该命令将 eth0 网卡的传输设置为:有 25% 的数据包（50%相关）会被立即发送，其他的延迟 10 秒。  
　　新版本中，如下命令也会在一定程度上打乱发包的次序:  
　　# tc  qdisc  add  dev  eth0  root  netem  delay  100ms  10ms
## comcast
Comcast 是一个跨平台的网络模拟工具，旨在其他平台（OSX、Windows、BSD）也能提供类似网络模拟的功能。

```bash
comcast --device=enp0s5 --latency=250 \
    --target-bw=1000 \
    --default-bw=1000000 \
    --packet-loss=10% \
    --target-addr=8.8.8.8,10.0.0.0/24 \
    --target-proto=tcp,udp,icmp \
    --target-port=80,22,1000:2000
```
### 参数介绍
- device 说明要控制的网卡为 enp0s5。
- latency 指定 250ms 的延迟。
- target-bw指定目标带宽。
- default-bw 指定默认带宽。
- packet-loss 指定丢包率。
- target-addr、--target-proto、--target-port 参数指定在满足这些条件的报文上实施上面的配置。

# 实践测试
对PostgreSQL流复制进行网络延迟模拟,可以通过Linux网络工具实现。主要思路是在流复制的网络路径上添加一个虚拟网络设备,并配置该设备的延迟参数。

一种方法是使用Netem工具。Netem可以精确控制网络延迟、丢包、重复等参数。

1. 在主库和Standby库之间添加一对虚拟网络设备:

```bash
# 主库这端
ip link add name pgmain type veth peer name pgstandby

# Standby库那端
ip link add name pgstandby type veth peer name pgmain
```

2. 为pgmain配置IP地址,并设置为UP状态:

```
ip addr add 192.168.0.1/24 dev pgmain
ip link set pgmain up
```

3. 在pgmain设备上添加延迟,例如100ms:

```bash
tc qdisc add dev pgmain root netem delay 100ms
```

4. 配置Standby库使用pgstandby设备,而不是直接连接到主库网络。

这样pgmain和pgstandby之间就添加了100ms的网络延迟。可以调整delay参数来模拟不同网络延迟环境下的效果。

另一种方法是使用防火墙规则,通过限制流量带宽来模拟网络延迟。例如:

```
iptables -A FORWARD -i pgmain -o pgstandby -p tcp --match multiport --dports 5432 -m limit --limit 500/s
```

以上可以限制流复制网络流量,起到增加延迟的效果。

合理使用网络工具可以帮助模拟PostgreSQL不同的网络环境,测试流复制的稳定性。

# 结论
# 参考资料
- [Linux网络流量控制工具—Netem](https://www.cnblogs.com/fsw-blog/p/4788036.html)
- [comcast](https://github.com/tylertreat/comcast)
- [wondershaper](https://github.com/magnific0/wondershaper)