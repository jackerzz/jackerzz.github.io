---
title: Cisco ACL 配置解析
tags:
  - python
categories:
  - 开发笔记 
date: 2024-03-27
---

# 一、关键汇总
## 1、标准访问列表
```
   access-list access-list-number [permit | deny ] [sourceaddress][wildcard-mask]
```

- access-list-number: 这是指定ACL编号的部分，对于标准ACL，编号范围通常是1-99和1300-1999。
- permit | deny: 这部分指定规则是允许（permit）还是拒绝（deny）匹配到的流量。
- source-address: 指定源IP地址。可以是单个IP地址、网络地址或特殊关键字any（代表任何地址）。
- wildcard-mask: 通配符掩码，用于指定source-address中哪些位需要匹配。它与子网掩码相反：在通配符掩码中，0表示该位必须精确匹配，1表示该位可以是任意值。

## 2、扩展访问控制列表
标准扩展ACL
```
access-list number {permit/deny} protocol   operan（It小于，gt大于，eq等于，neq不等于。具体可？）+端口号
```
- 扩展访问控制列表号的范围是100-199或者2000-2699
- 因为默认情况下，每个访问控制列表的末尾隐含deny all,所以在每个扩展访问控制列表里面必须有：
```
access-list 110 permit ip any any
access-list 101 deny tcp any host 192.168.1.1 eq www 
# 将所有主机访问192.168.1.1这个地址网页服务（WWW）TCP连接的数据包丢弃。
```
- 不同的服务要使用不同的协议，比如TFTP使用的是UDP协议。
示例：
```
access-list 101 permit tcp any 172.16.4.13 0.0.0.0 eq www  
```

| 配置名称     | 可选参数  | 参数解释         | 配置解释                               | 案例          |
|--------------|----------|------------------|----------------------------------------|--------------|
| access-list  | 101      | ACL编号          | 标识为编号101的访问控制列表            | access-list 101 |
| {permit/deny} | permit   | 允许             | 允许匹配此规则的流量                   | permit       |
| protocol     | tcp      | 传输控制协议      | 指定流量使用TCP协议                   | tcp          |
| 源地址       | any      | 任何源地址        | 允许来自任何IP地址的流量              | any          |
| 目标地址     | 172.16.4.13 | 单个IP地址      | 指定目标IP地址为172.16.4.13           | 172.16.4.13  |
| 反码         | 0.0.0.0  | 指定单个IP地址    | 此处反码为0.0.0.0，表示只匹配该特定的IP地址 | 0.0.0.0      |
| operator     | eq       | 等于             | 指定端口匹配规则为“等于”               | eq           |
| 端口号       | www 或 80 | 超文本传输协议(HTTP)的默认端口 | 指定需要匹配的端口号为HTTP协议的标准端口，即端口80 | www 或 80    |

### 扩展ACL 类型
#### IP
```
access-list access-list-number 
     [dynamic dynamic-name [timeout minutes]]
     {deny|permit} protocol source source-wildcard destination destination-wildcard [precedence precedence]
     [tos tos] [log|log-input] [time-range time-range-name]
```

#### ICMP
```
access-list access-list-number 
     [dynamic dynamic-name [timeout minutes]]
     {deny|permit} icmp source source-wildcard destination destination-wildcard 
     [icmp-type [icmp-code] |icmp-message]
     [precedence precedence] [tos tos] [log|log-input]
     [time-range time-range-name]
```
#### TCP
```
access-list access-list-number 
     [dynamic dynamic-name [timeout minutes]]
     {deny|permit} tcp source source-wildcard [operator [port]]destination destination-wildcard [operator [port]]
     [established] [precedence precedence] [tos tos]
     [log|log-input] [time-range time-range-name]
```
#### UDP
```
access-list access-list-number 
     [dynamic dynamic-name [timeout minutes]]
     {deny|permit} udp source source-wildcard [operator [port]] destination destination-wildcard [operator [port]]
     [precedence precedence] [tos tos] [log|log-input]
     [time-range time-range-name]
```
#### 命名 IP ACL
```
ip access-list {extended|standard} name
interface Ethernet0/0 
 ip address 10.1.1.1 255.255.255.0 
 ip access-group in_to_out in
!
ip access-list extended in_to_out 
 permit tcp host 10.1.1.2 host 172.16.1.1 eq telnet 
ip access-list 11
  10 permit ip 10.126.113.55/32 any log 
  20 permit ip 10.126.113.56/32 any log 
  30 permit ip 10.126.113.57/32 any log 
  40 permit ip 10.126.113.58/32 any log 
```
> ip access-list 11：这个命令创建了一个名为 11 的IP访问列表。
> - 10 permit ip 10.126.113.55/32 any log：这条规则表示允许来自IP地址 10.126.113.55 的任何流量，并将允许的流量记录日志。
> - 20 permit ip 10.126.113.56/32 any log：这条规则表示允许来自IP地址 10.126.113.56 的任何流量，并将允许的流量记录日志。
> - 30 permit ip 10.126.113.57/32 any log：这条规则表示允许来自IP地址 10.126.113.57 的任何流量，并将允许的流量记录日志。
> - 40 permit ip 10.126.113.58/32 any log：这条规则表示允许来自IP地址 10.126.113.58 的任何流量，并将允许的流量记录日志。

#### 自反 ACL
```
interface <interface-name>  
 ip access-group {number|name} {in|out} 
!
ip access-list extended <name>
 permit protocol any any reflect name [timeoutseconds] 
!
ip access-list extended <name>
 evaluate <name>
ip reflexive-list timeout 120 
!    
interface Ethernet0/1
 ip address 172.16.1.2 255.255.255.0
 ip access-group inboundfilters in
 ip access-group outboundfilters out 
!
ip access-list extended inboundfilters
 permit icmp 172.16.1.0 0.0.0.255 10.1.1.0 0.0.0.255
 evaluate tcptraffic !--- This ties the reflexive ACL part of the outboundfilters ACL, 
!--- called tcptraffic, to the inboundfilters ACL.
ip access-list extended outboundfilters
 permit icmp 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255 
 permit tcp 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255 reflect tcptraffic
```

#### 锁和密钥（动态 ACL）
```
username <user-name> password <password>
!
interface <interface-name> 
 ip access-group {number|name} {in|out}
 
 access-list access-list-number dynamic name {permit|deny} [protocol]
{source source-wildcard|any} {destination destination-wildcard|any}
[precedence precedence][tos tos][established] [log|log-input]
[operator destination-port|destination port] 
line vty <line_range> 
 login local
username test password 0 test 

!--- 10（分钟）是空闲超时。
username test autocommand access-enable host timeout 10 
!
interface Ethernet0/0 
  ip address 10.1.1.1 255.255.255.0 
  ip access-group 101 in 
!
access-list 101 permit tcp any host 10.1.1.1 eq telnet !--- 15（分钟）是空闲超时。

access-list 101 dynamic testlist timeout 15 permit ip 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255
!
line vty 0 4 
 login local
```

#### 基于上下文的访问控制
```
ip inspect name inspection-name protocol [timeoutseconds]
ip inspect name myfw ftp timeout 3600 
ip inspect name myfw http timeout 3600 
ip inspect name myfw tcp timeout 3600 
ip inspect name myfw udp timeout 3600 
ip inspect name myfw tftp timeout 3600
!      
interface Ethernet0/1 
 ip address 172.16.1.2 255.255.255.0 !-- 用于配置网络接口的IP地址和子网掩码
 ip access-group 111 in  !-- 将编号为111的访问控制列表（ACL）应用于接口上的入站流量
 ip inspect myfw out     !-- 将一个名为 myfw 的防火墙检查规则集应用于出站流量 
!
access-list 111 deny icmp any 10.1.1.0 0.0.0.255 echo 
access-list 111 permit icmp any 10.1.1.0 0.0.0.255 
```

#### IP Inspect 名称配置
| 配置名称              | 可选参数           | 参数解释           | 配置解释                                                                 | 案例                                   |
|-----------------------|-------------------|--------------------|--------------------------------------------------------------------------|----------------------------------------|
| ip inspect name myfw  | ftp timeout 3600  | FTP协议检测，超时时间3600秒 | 为FTP流量设置状态检测，以防止未授权访问，同时允许有效会话在3600秒内保持活动状态。 | ip inspect name myfw ftp timeout 3600  |
| ip inspect name myfw  | http timeout 3600 | HTTP协议检测，超时时间3600秒 | 为HTTP流量设置状态检测，提高网络安全性，允许HTTP会话在3600秒内保持活动。         | ip inspect name myfw http timeout 3600 |
| ip inspect name myfw  | tcp timeout 3600  | TCP通用检测，超时时间3600秒 | 对所有TCP流量进行检测，确保长时间未活动的会话被关闭，减少资源占用。            | ip inspect name myfw tcp timeout 3600  |
| ip inspect name myfw  | udp timeout 3600  | UDP通用检测，超时时间3600秒 | 对UDP流量进行状态检测，以便管理UDP连接状态并在3600秒后关闭闲置连接。        | ip inspect name myfw udp timeout 3600  |
| ip inspect name myfw  | tftp timeout 3600 | TFTP协议检测，超时时间3600秒 | 为TFTP协议设置状态检测，防止滥用，同时允许合法TFTP传输在3600秒内完成。        | ip inspect name myfw tftp timeout 3600 |

接口配置
> 对于Ethernet0/1接口，配置了IP地址、绑定了一个入站访问控制列表（ACL 111），并启用了出站流量的IP检查（myfw）。
#### 配置详情
| 配置名称          | 可选参数                  | 参数解释                              | 配置解释                                             | 案例                                        |
|-------------------|--------------------------|---------------------------------------|------------------------------------------------------|---------------------------------------------|
| access-list 111   | deny icmp any 10.1.1.0 0.0.0.255 echo | 拒绝来自任何地方对10.1.1.0/24网络的ICMP回显请求 | 阻止对指定网络的ping请求，提高网络安全性。          | access-list 111 deny icmp any 10.1.1.0 0.0.0.255 echo |
| access-list 111   | permit icmp any 10.1.1.0 0.0.0.255 | 允许除echo以外的所有ICMP类型流量       | 允许ICMP流量进入网络，但不包括ping请求，这有助于网络诊断而不暴露于常见的网络扫描技术。 | access-list 111 permit icmp any 10.1.1.0 0.0.0.255 |

#### Turbo ACL
```
access-list 101 permit tcp host 10.1.1.2 host 172.16.1.1 eq telnet        
access-list 101 permit tcp host 10.1.1.2 host 172.16.1.1 eq ftp 
access-list 101 permit udp host 10.1.1.2 host 172.16.1.1 eq syslog        
access-list 101 permit udp host 10.1.1.2 host 172.16.1.1 eq tftp        
access-list 101 permit udp host 10.1.1.2 host 172.16.1.1 eq ntp
```

#### 带有注释的 IP ACL 条目
```
ip access-list {standard|extended} <access-list-name> 
 remark remark
 
access-list <access-list-number> remark remark
interface Ethernet0/0 
 ip address 10.1.1.1 255.255.255.0 
 ip access-group 101 in
!
access-list 101 remark permit_telnet 
access-list 101 permit tcp host 10.1.1.2 host 172.16.1.1 eq telnet 
```

### 3、命名访问控制列表
```
access-list [ACL 名称] extended {permit | deny} [协议] [源地址] [源地址通配符] [目的地址] [目的地址通配符] [eq 目的端口]
```
- ACL 名称：自定义的访问控制列表名称。
- permit/deny：决定是允许（permit）还是拒绝（deny）匹配到的流量。
- 协议：指定流量的协议类型，如tcp、udp、icmp等。
- 源地址和目的地址：指流量的源和目标IP地址。可以是单个IP地址、网络地址或任意地址（使用any关键字）。
- 源地址通配符和目的地址通配符：定义了与源地址和目的地址匹配的灵活性，其中0.0.0.0表示完全匹配，而255.255.255.255表示任意地址。
- eq 目的端口：（可选）指定目的端口号。eq后面跟具体的端口号或已知端口名称（如www代表80端口）。
案例：
```
access-list outside extended permit tcp object-group ITO-14252-SOUR host 10.122.45.88 eq www log notifications 
```
#### 配置详情
| 配置名称       | 可选参数                    | 参数解释             | 配置解释                                             | 案例                                     |
|----------------|----------------------------|----------------------|------------------------------------------------------|------------------------------------------|
| access-list    | outside                    | ACL名称              | 指定ACL的名称为outside，通常用于界定这个ACL应用于外部接口上 | access-list outside                      |
| extended       | -                          | 扩展ACL               | 表示使用扩展访问控制列表，允许基于协议、源地址、目的地址等详细规则进行流量控制 | extended                                 |
| {permit/deny}  | permit                     | 允许                 | 表示允许匹配此规则的流量通过                           | permit                                   |
| protocol       | tcp                        | 传输控制协议          | 指定流量使用TCP协议                                  | tcp                                      |
| 源地址         | object-group ITO-14252-SOUR | 源地址对象组         | 使用名为ITO-14252-SOUR的对象组作为源地址条件            | object-group ITO-14252-SOUR              |
| 目标地址       | host 10.122.45.88          | 单个主机的IP地址      | 指定目标IP地址为10.122.45.88                        | host 10.122.45.88                        |
| operator       | eq                         | 等于                 | 指定端口匹配规则为“等于”                             | eq                                       |
| 端口号         | www 或 80                  | 超文本传输协议(HTTP)的默认端口 | 指定需要匹配的端口号为HTTP协议的标准端口，即端口80   | www 或 80                                |
| 附加操作       | log notifications          | 记录日志并通知        | 当匹配到该规则时，会记录日志并可能触发配置的通知       | log notifications                       |

### 4、反向访问控制列表
```
 access-list 101 permit tcp 172.16.3.0 0.0.0.255 172.16.4.0 0.0.0.255 established
```
#### 配置详情

| 配置名称         | 可选参数     | 参数解释        | 配置解释                            | 案例                 |
|------------------|--------------|-----------------|-------------------------------------|----------------------|
| access-list      | 101          | ACL编号         | 指定ACL的编号为101。                 | access-list 101      |
| {permit/deny}    | permit       | 允许            | 表示允许匹配此规则的流量。           | permit               |
| protocol         | tcp          | 传输控制协议     | 指定流量使用TCP协议。                | tcp                  |
| 源地址           | 172.16.3.0   | 网络地址        | 指定源IP地址范围为172.16.3.0到172.16.3.255的任何地址。 | 172.16.3.0           |
| 反码             | 0.0.0.255    | 子网掩码的反码   | 反码用于匹配源地址的子网。           | 0.0.0.255            |
| 目的地址         | 172.16.4.0   | 网络地址        | 指定目标IP地址范围为172.16.4.0到172.16.4.255的任何地址。 | 172.16.4.0           |
| 反码             | 0.0.0.255    | 子网掩码的反码   | 反码用于匹配目的地址的子网。         | 0.0.0.255            |
| established      | -            | 已建立连接      | 允许已建立的TCP连接的数据包通过。    | established          |

命令分解
- access-list 101: 指定了ACL的编号为101。扩展ACL的编号范围通常是100-199和2000-2699。
- permit: 表示允许匹配到的流量。
- tcp: 指定了要匹配的协议类型为TCP。这意味着此规则仅适用于TCP流量。
- 172.16.3.0 0.0.0.255: 这是源IP地址和通配符掩码的组合，表示源地址范围为172.16.3.0到172.16.3.255的任何地址。
- 172.16.4.0 0.0.0.255: 这是目的IP地址和通配符掩码的组合，表示目的地址范围为172.16.4.0到172.16.4.255的任何地址。
- established: 这是一个特定于TCP协议的选项，它允许那些已经建立的（即，已经开始数据传输阶段的）TCP连接的数据包。"Established"连接是指TCP连接中，ACK标志位被设置的数据包，这通常意味着回应数据流，而非初始的设置连接请求。
命令的意义
这条ACL规则的意义是允许从172.16.3.0/24网段到172.16.4.0/24网段的已建立的TCP连接流量。这样的规则通常用于确保只有响应流量能够通过设备，例如，在一个方向上初始化的连接请求（如从172.16.4.0/24到172.16.3.0/24）不会被此规则允许，但是一旦连接建立，来自172.16.3.0/24的响应流量则被允许穿过。

# 二、技术材料
![object-group.png](/images/devops/object-group.png)
![access-list.png](/images/devops/access-list.png)

# 三、其他配置
## 1、服务对象组
```
object-group service sdwan-ports tcp
 port-object eq www
 port-object eq https
 port-object eq 8080
 port-object eq 8089
```
暂时无法在飞书文档外展示此内容
配置解释:
这个配置定义了一个名为sdwan-ports的TCP端口服务对象组，其中包含了HTTP（端口80）、HTTPS（端口443）、8080和8089这四种TCP端口。通过将这些端口组合到一个对象组中，可以方便地在防火墙策略中重复使用，并简化配置。

## 2、网络对象组
```
object-group network dmvpn_subnet
 network-object 10.52.128.0 255.255.128.0
 network-object 10.201.128.0 255.255.128.0
 network-object 10.10.64.0 255.255.192.0
```
暂时无法在飞书文档外展示此内容
配置解释:
这个配置定义了一个名为dmvpn_subnet的网络对象组，其中包含了三个网络地址或子网：10.52.128.0/17、10.201.128.0/17和10.10.64.0/18。通过将这些网络地址或子网组合到一个对象组中，可以方便地在防火墙策略中重复使用，并简化配置。

## 3、单主机组配置
```
object-group network Test-dev&uat&test
 network-object host 10.122.158.11
```
暂时无法在飞书文档外展示此内容
 Test-dev&uat&test 的网络对象组，其中包含了一个主机 10.122.158.11。通过将主机加入到对象组中，可以方便地在防火墙策略中重复使用，并简化配置
## 4、组策略案例

### 组配置
```
object-group network NDC_PROD
 network-object host 100.84.99.21
 network-object host 100.84.99.22
 network-object host 100.84.99.23
 network-object host 100.84.99.24
```

### 墙策略
```
access-list outside extended permit ip 10.77.156.0 255.255.252.0 object-group NDC_PROD
```
组配置 (object-group network NDC_PROD)：
在这部分配置中，一个名为 NDC_PROD 的网络对象组被定义，并且四个主机地址被添加到该组中。
配置解释：
- object-group network NDC_PROD: 定义了一个网络对象组，名为 NDC_PROD。
- network-object host <IP>: 将指定的IP地址添加到网络对象组中。

防火墙策略 (access-list outside extended): 
在这部分配置中，一个名为 outside 的ACL被扩展，允许来自于子网 10.77.156.0/22 的IP流量与组 NDC_PROD 中的主机进行通信。
配置解释：
- access-list outside extended: 定义了一个扩展的访问列表，名为 outside。
- permit ip <source> <destination>: 允许指定源和目标地址范围的IP流量通过。
- 10.77.156.0 255.255.252.0: 源地址为 10.77.156.0/22 子网。
- object-group NDC_PROD: 目标地址为 NDC_PROD 组中的主机。
策略目的：策略允许来自于子网 10.77.156.0/22 的IP流量与组 NDC_PROD 中的所有主机进行通信

## 4、网络组的range 
```
object-group service ITO-6391_PORT-1 tcp
 port-object eq 8888
 port-object eq 8848
 port-object range 5901 5920
```

暂时无法在飞书文档外展示此内容
配置解释:
这个配置定义了一个名为 ITO-6391_PORT-1 的服务对象组，其中包含了三个TCP端口：8888、8848和5901到5920的端口范围。通过将这些端口组合到一个对象组中，可以方便地在防火墙策略中重复使用，并简化配置。

## 5、网络组中的 subnet
```
object network obj_any
 subnet 0.0.0.0 0.0.0.0
```

暂时无法在飞书文档外展示此内容
配置解释:
这个配置定义了一个名为 obj_any 的网络对象，表示整个IPv4地址空间，即所有可能的IP地址。通常情况下，这个对象会被用作一些通用规则中的匹配对象，允许来自任何源地址或到任何目的地址的流量通过。

## 6、ACL 统一接口 access-group 配置内外网络控制
```
access-group outside in interface outside
access-group inside in interface inside
```

暂时无法在飞书文档外展示此内容
配置解释:
- access-group outside in interface outside：这个配置指定了应用于外部接口的进入方向的ACL，ACL的名称是 outside。
- access-group inside in interface inside：这个配置指定了应用于内部接口的进入方向的ACL，ACL的名称是 inside。
```
router ospf 100
 router-id 172.17.0.6
 network 172.17.254.0 255.255.255.248 area 21
 network 172.17.255.72 255.255.255.248 area 0
 area 0 authentication message-digest
 area 21 authentication message-digest
 log-adj-changes
```
暂时无法在飞书文档外展示此内容
配置解释:
- 这个配置指定了一个 OSPF 进程，进程号为 100。
- 路由器的 OSPF 路由器 ID 被指定为 172.17.0.6。
- 两个网络地址被分配到 OSPF 进程中，分别位于不同的区域。
- 两个区域分别指定了消息摘要认证。
- 启用了记录邻居状态变化的日志消息。

## 7、日志记录配置
```
logging enable
logging timestamp
logging buffer-size 1000000
logging console debugging
logging buffered informational
logging trap informational
logging host inside 172.18.1.206 17/1514
logging host inside 172.20.135.206 17/10514
logging host inside 10.126.116.152 17/10514
logging host inside 10.126.157.223
mtu outside 1500
mtu inside 1500
monitor-interface outside
monitor-interface inside
icmp unreachable rate-limit 1 burst-size 1
no asdm history enable
arp timeout 14400
```
暂时无法在飞书文档外展示此内容
配置解释:
- 启用了设备的日志记录功能，并设置了时间戳以及日志缓冲区大小。
- 控制台日志级别被设置为调试（Debugging），以记录所有日志消息，用于故障排除。
- 缓冲日志级别被设置为信息（Informational），记录普通信息性日志消息，但不包括调试级别的消息。
- Syslog陷阱级别被设置为信息（Informational），指定了在发送Syslog消息时记录的最低日志级别。
- 日志消息将发送到指定的四个Syslog服务器IP地址。
- 设置了接口的MTU大小为1500字节，并将外部和内部接口设置为监视接口。
- 设置了对 ICMP 不可达消息的速率限制，并设置了 ARP 表项的超时时间为 14400 秒
## 8. ACL 扩展控制内外网ping
interface <interface-name> 
 ip access-group {number|name} {in|out} 
此扩展ACL用于允许10.1.1.x网络（内部）上的流量并接收来自外部的ping响应，同时阻止来自外部人员的未经请求的ping，这允许所有其他流量。
- 示例
```
interface Vlan801
  no shutdown
  no ip redirects
  ip address 172.16.21.14/24
  no ipv6 redirects
```
暂时无法在飞书文档外展示此内容

## 9. 基础配置
```
！
ftp mode passive
dns domain-lookup management
dns server-group DefaultDNS
 name-server 201.96.209.133 
 domain-name mcd.com
object network obj_any
 subnet 0.0.0.0 0.0.0.0
object network SNMPAcc
 range 11.126.112.1 11.126.112.254
object network SNMPAcc_02
 range 11.126.112.1 11.126.112.254
！
```

暂时无法在飞书文档外展示此内容
这段配置主要用于设定网络的基础服务，如FTP的传输模式、DNS的解析设置，以及定义网络对象用于特定的网络配置目的，比如安全规则的应用或流量的控制。
10. Vpn 通道分裂
暂时无法在飞书文档外展示此内容

# 四、知识补充点
ip地址种类的划分及私有地址的范围
![](/images/devops/network.png)
## 1. A类IP地址 
一个A类IP地址由1字节的网络地址和3字节主机地址组成，网络地址的最高位必须是“0”， 地址范围从1.0.0.0 到126.0.0.0。可用的A类网络有126个，每个网络能容纳1亿多个主机。 
## 2. B类IP地址 
一个B类IP地址由2个字节的网络地址和2个字节的主机地址组成，网络地址的最高位必须是“10”，地址范围从128.0.0.0到191.255.255.255。可用的B类网络有16382个，每个网络能容纳6万多个主机 。 
## 3.  C类IP地址 
一个C类IP地址由3字节的网络地址和1字节的主机地址组成，网络地址的最高位必须是“110”。范围从192.0.0.0到223.255.255.255。C类网络可达209万余个，每个网络能容纳254个主机。 
## 4.  D类地址用于多点广播（Multicast）。 
D类IP地址第一个字节以“lll0”开始，它是一个专门保留的地址。它并不指向特定的网络，目前这一类地址被用在多点广播（Multicast）中。多点广播地址用来一次寻址一组计算机，它标识共享同一协议的一组计算机。 
## 5.  E类IP地址 
以“llll0”开始，为将来使用保留。 
全零（“0．0．0．0”）地址对应于当前主机。全“1”的IP地址（“255．255．255．255”）是当前子网的广播地址。 
## 6. 在IP地址3种主要类型里，各保留了3个区域作为私有地址，其地址范围如下：
    A类地址：10.0.0.0～10.255.255.255 即10.0.0.0/8
    B类地址：172.16.0.0～172.31.255.255 即172.16.0.0/12
    C类地址：192.168.0.0～192.168.255.255 即192.168.0.0/16
# 参考文献
[] ACL配置举例 - S1720, S2700, S5700, S6720 V200R011C10 配置指南-安全 - 华为
[] 思科CLI 配置指南918 版.pdf
[] 有关 Cisco IOS 软件支持的各类 ACL 以及如何配置和编辑 ACL 的详细信息
[] 访问控制列表使用包过滤技术
[] 配置常用 IP ACL
[] ACL构建企业网安全
