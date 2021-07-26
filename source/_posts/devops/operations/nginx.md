---
title: Nginx 介绍
tags:
  - Nginx
categories:
  - DevNote 
date: 2021-07-05 21:30:34
---

## Nginx 介绍

Nginx 是一个自由、开源、高性能及轻量级的 HTTP 服务器和反向代理服务器，它有很多功能，主要功能为：
1. 正向代理
2. 反向代理
3. 负载均衡
4. HTTP 服务器（包含动静分离）

本文使用 Nginx 反向代理和负载均衡的功能。

>Nginx 的更详细介绍可以参考 [nginx简易教程](https://www.cnblogs.com/jingmoxukong/p/5945200.html)。

## Nginx 反向代理功能

Nginx 最常用的功能之一是作为一个反向代理服务器。反向代理（Reverse Proxy）是指以代理服务器来接收 Internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 Internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器（摘自百度百科）。

为什么需要反向代理呢？在实际的生产环境中，服务部署的网络（内网）跟外部网络（外网）通常是不通的，需要通过一台既能够访问内网又能够访问外网的服务器来做中转，这种服务器就是反向代理服务器。Nginx 作为反向代理服务器，简单的配置如下：

```nginx
server {
    listen      80;
    server_name  Standard.com;
    client_max_body_size 1024M;

    location / {
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass  http://127.0.0.1:8080/;
        client_max_body_size 100m;
    }
}
```

Nginx 在做反向代理服务器时，能够根据不同的配置规则转发到后端不同的服务器上。

## Nginx 负载均衡功能

Nginx 另一个常用的功能是负载均衡，所谓的负载均衡就是指当 Nginx 收到一个 HTTP 请求后，会根据负载策略将请求转发到不同的后端服务器上。比如，apiserver 部署在两台服务器 A 和 B 上，当请求到达 Nginx 后，Nginx 会根据 A 和 B 服务器上的负载情况，将请求转发到负载较小的那台服务器上。这里要求 Standard 是无状态的服务。

## Nginx 常用命令

Nginx 常用命令如下（执行 which nginx 可以找到 Nginx 命令所在的路径）：

```
nginx -s stop       快速关闭 Nginx，可能不保存相关信息，并迅速终止 Web 服务
nginx -s quit       平稳关闭 Nginx，保存相关信息，有安排的结束 Web 服务
nginx -s reload     因改变了 Nginx 相关配置，需要重新加载配置而重载
nginx -s reopen     重新打开日志文件
nginx -c filename   为 Nginx 指定一个配置文件，来代替默认的
nginx -t            不运行，而仅仅测试配置文件。Nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件
nginx -v            显示 Nginx 的版本
nginx -V            显示 Nginx 的版本、编译器版本和配置参数
```

>Nginx 默认监听 80 端口，启动 Nginx 前要确保 80 端口没有被占用。当然你也可以通过修改 Nginx 配置文件 /etc/nginx/nginx.conf 改 Nginx 监听端口。


## 负载均衡调度算法：

- 1. weight轮询（默认）：
    接收到的请求按照顺序逐一分配到不同的后端服务器，即使在使用过程中，某一台后端服务器宕机，
    nginx会自动将该服务器剔除出队列，请求受理情况不会受到任何影响。 
    这种方式下，可以给不同的后端服务器设置一个权重值（weight），用于调整不同的服务器上请求的分配率；
    权重数据越大，被分配到请求的几率越大；该权重值，主要是针对实际工作环境中不同的后端服务器硬件配置进行调整的。

- 2. ip_hash：
    每个请求按照发起客户端的ip的hash结果进行匹配，
    这样的算法下一个固定ip地址的客户端总会访问到同一个后端服务器，这也在一定程度上解决了集群部署环境下session共享的问题。

- 3. fair：
    智能调整调度算法，动态的根据后端服务器的请求处理到响应的时间进行均衡分配，
    响应时间短处理效率高的服务器分配到请求的概率高，响应时间长处理效率低的服务器分配到的请求少；结合了前两者的优点的一种调度算法。
    但是需要注意的是nginx默认不支持fair算法，如果要使用这种调度算法，请安装upstream_fair模块

- 4. url_hash：
    按照访问的url的hash结果分配请求，每个请求的url会指向后端固定的某个服务器，
    可以在nginx作为静态服务器的情况下提高缓存效率。同样要注意nginx默认不支持这种调度算法，要使用的话需要安装nginx的hash软