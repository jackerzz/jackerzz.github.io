---
title: Patroni+citus HA 验证
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2023-07-13 22:30:34
---

# Docker 镜像构建
- Dockerfile
```yaml
ARG PG_MAJOR=15

FROM postgres:$PG_MAJOR as builder

RUN set -ex \
    && export DEBIAN_FRONTEND=noninteractive \
    # 配置apt默认不安装推荐的包和建议的包
    && echo 'APT::Install-Recommends "0";\nAPT::Install-Suggests "0";' > /etc/apt/apt.conf.d/01norecommend \
    && apt update -y \
    # postgres:PG_MAJOR is based on debian, which has the patroni package. 
    # 安装patroni,pip,etcd,vip-manager,curl
    && apt install -y patroni python3-pip etcd-server vip-manager2 iproute2 curl \
    # install citus extension
    && curl https://install.citusdata.com/community/deb.sh | gosu root bash \
    && apt update -y \
    && apt install -y postgresql-$PG_MAJOR-citus-11.3

COPY patroni.yml entrypoint.sh /

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
```
## 构建本机Docker镜像
```bash
cd patroni-citus
docker build -t patroni-citus .
```

# 容器化分布式集群
- docker-compose.yml
```yaml
version: "3"

networks:
  demo:
    driver: bridge
    ipam: 
      driver: default
      config:
        - subnet: 172.30.0.0/16
          gateway: 172.30.0.1
      
services:
  etcd1: &etcd
    image: ${PATRONI_TEST_IMAGE:-patroni-citus}
    container_name: etcd1
    command: etcd -name etcd1 -initial-advertise-peer-urls http://etcd1:2380
    networks: 
      - demo
    environment:
      ETCDCTL_API: 3
      ETCD_LISTEN_PEER_URLS: http://0.0.0.0:2380
      ETCD_LISTEN_CLIENT_URLS: http://0.0.0.0:2379
      ETCD_INITIAL_CLUSTER: etcd1=http://etcd1:2380,etcd2=http://etcd2:2380,etcd3=http://etcd3:2380
      ETCD_INITIAL_CLUSTER_STATE: new
      ETCD_INITIAL_CLUSTER_TOKEN: tutorial
      ETCD_UNSUPPORTED_ARCH: arm64
  etcd2:
    <<: *etcd
    container_name: etcd2
    command: etcd -name etcd2 -initial-advertise-peer-urls http://etcd2:2380
  etcd3:
    <<: *etcd
    container_name: etcd3
    command: etcd -name etcd3 -initial-advertise-peer-urls http://etcd3:2380

  coord-1:
    image: ${PATRONI_TEST_IMAGE:-patroni-citus}
    container_name: coord1
    networks: 
      - demo
    cap_add:
      - NET_ADMIN # vip-manager要求容器具备该权限
    environment: &coord_env
      ## etcdctl
      ETCDCTL_API: 3
      ETCDCTL_ENDPOINTS: http://etcd1:2379,http://etcd2:2379,http://etcd3:2379
      ## Patroni
      PATRONI_NAMESPACE: /service
      PATRONI_SCOPE: citus
      PATRONI_NAME: coord1
      PATRONI_ETCD3_HOSTS: "'etcd1:2379','etcd2:2379','etcd3:2379'"
      PATRONI_CITUS_DATABASE: test
      PATRONI_CITUS_GROUP: 0
      ## VIP Manager https://github.com/cybertec-postgresql/vip-manager
      VIP_IP: 172.30.254.254
      VIP_NETMASK: 16
      VIP_INTERFACE: eth0
      VIP_TRIGGER_KEY: /service/citus/0/leader
      VIP_TRIGGER_VALUE: coord1 # 默认为本机的hostname
      VIP_MANAGER_TYPE: basic # 默认basic
      VIP_DCS_TYPE: etcd  # 默认etcd
      VIP_DCS_ENDPOINTS: http://etcd1:2379,http://etcd2:2379,http://etcd3:2379
      # VIP_ETCD_USER=patroni
      # VIP_ETCD_PASSWORD=123456
      # VIP_INTERVAL=1000
    command: vip-manager        # 只有coordinator节点需要vip
  coord-2:
    image: ${PATRONI_TEST_IMAGE:-patroni-citus}
    container_name: coord2
    networks:
      - demo
    cap_add:
      - NET_ADMIN # vip-manager要求容器具备该权限
    environment:
      <<: *coord_env
      VIP_TRIGGER_VALUE: coord2
      PATRONI_NAME: coord2
    command: vip-manager

  work1-1:
    image: ${PATRONI_TEST_IMAGE:-patroni-citus}
    container_name: work1-1
    networks: 
      - demo
    environment: &work1_env
      <<: *coord_env
      PATRONI_NAME: work1-1
      PATRONI_CITUS_GROUP: 1
  work1-2:
    image: ${PATRONI_TEST_IMAGE:-patroni-citus}
    container_name: work1-2
    networks: 
      - demo
    environment:
      <<: *work1_env
      PATRONI_NAME: work1-2

  work2-1:
    image: ${PATRONI_TEST_IMAGE:-patroni-citus}
    container_name: work2-1
    networks: 
      - demo
    environment: &work2_env
      <<: *coord_env
      PATRONI_NAME: work2-1
      PATRONI_CITUS_GROUP: 2
  work2-2:
    image: ${PATRONI_TEST_IMAGE:-patroni-citus}
    container_name: work2-2
    networks: 
      - demo
    environment:
      <<: *work2_env
      PATRONI_NAME: work2-2

  # 极简的sql管理器(可选的)
  adminer:
    image: adminer
    container_name: sql_adminer
    networks: 
      - demo
    ports:
      - 8080:8080
```
## 启动集群
```bash
docker-compose up -d
```

# 优化
根据该方案的潜在缺点,我对docker-compose.yml文件做了以下优化:

使用稳定版本的etcd集群
使用官方的etcd镜像,并指定版本号,避免不稳定的问题。

etcd集群多实例部署
使用3个etcd实例来构建集群,避免单点故障。

指定网络与服务端口
明确定义网络与服务端口,避免端口冲突。

增加监控和日志
使用cadvisor进行资源监控,fluentd收集日志。

使用外部卷持久化关键数据
对etcd和postgres数据使用外部卷进行持久化
## 部署yml
```yaml
# 指定docker compose版本 
version: "3.8"  

# 定义docker网络,指定子网范围
networks:
  backend:
    driver: bridge 
    ipam:
      config:
        - subnet: 172.20.0.0/16

# 定义数据卷,用于数据持久化
volumes:
  etcd_data:
  pg_data:

# 服务定义
services:

# etcd集群
  etcd:
    image: quay.io/coreos/etcd:v3.5.0 # 指定镜像版本
    container_name: etcd # 指定容器名称
    networks:
      - backend # 加入backend网络
    environment:  
      - ETCDCTL_API=3 # etcdctl客户端版本
    volumes:
      - etcd_data:/etcd_data # 数据目录挂载
    ports:
      - 2379:2379 # 客户端端口
      - 2380:2380 # 集群通信端口
    deploy: 
      mode: replicated # 复制模式部署
      replicas: 3 # 复制数量

# postgres服务 
  postgres:
    image: postgres:14 # postgres镜像版本
    container_name: postgres # 容器名称 
    volumes:
      - pg_data:/var/lib/postgresql/data # 数据目录挂载
    networks:
      - backend
    ports:  
      - 5432:5432 # 服务端口
    healthcheck: # 健康检查
      test: ["CMD-SHELL", "pg_isready"] 

# patroni 服务
  patroni: 
    image: patroni/patroni:latest
    container_name: patroni 
    depends_on: # 依赖etcd和postgres
      - etcd
      - postgres
    networks:  
      - backend 
    environment: # 配置参数
      ETCD_HOST: etcd
      PATRONI_SCOPE: test_cluster
      PATRONI_NAMESPACE: /service/test_cluster  
      PATRONI_NAME: ${HOSTNAME} 
    healthcheck: # 健康检查
      test: pg_isready -U postgres

# 监控服务
  monitoring: 
    image: google/cadvisor # 镜像选择
    container_name: cadvisor
    volumes:  
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks:
      - backend  
    ports:
      - 8080:8080 # 服务端口

# 日志服务        
  logging:    
    image: fluent/fluentd 
    container_name: fluentd
    networks:
      - backend
    volumes:
      - ./fluentd/conf:/fluentd/etc # 配置文件挂载
    depends_on:
      - cadvisor
    environment:
      FLUENTD_CONF: fluentd.conf # 配置文件路径

# vip管理服务
  vip-manager:
    image: cluster-vip-manager 
    container_name: vip_manager
    cap_add: [NET_ADMIN] # 添加网卡权限 
    depends_on:
     - patroni
     - etcd
    environment: # 参数配置
     VIP_INTERFACE: eth0
     VIP_IP: 172.20.254.254 
     VIP_NETMASK: 16
     VIP_DCS_TYPE: etcd
     VIP_DCS_ENDPOINTS: http://etcd:2379
     VIP_TRIGGER_VALUE: ${HOSTNAME}
     VIP_TRIGGER_KEY: /service/test_cluster/leader 
    command:  
      - vip-manager # 执行命令
```
