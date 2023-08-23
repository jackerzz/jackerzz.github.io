---
title: Haproxy可以与Patroni配合
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2022-06-05 22:30:34
---
# 背景
 需要给予k8s 对pgsql 实现在两地区双数据中心的数据库高可用

# 方案
- 1. 准备两个数据中心的Kubernetes集群,比如一个在上海,一个在万隆。
- 2. 在每个数据中心内部署一个PostgreSQL主节点和多个从节点。可以使用StatefulSet管理Pod。
- 3. 使用多主模式,在两个数据中心内都有一个可读写的主节点。
- 4. 配置流复制,使两个数据中心的PostgreSQL节点之间实现异步复制。
- 5. 使用读写分离,读请求路由到从节点,写请求路由到主节点。可以使用Kubernetes服务发现内置的DNS轮询策略。
- 6. 配置PodAntiAffinity,确保主备节点分布在不同节点上。
- 7. 设置节点优先级,如果当前数据中心不可用,优先提升另一个数据中心的主节点。
- 8. 监控节点状态,如果主节点不健康则 needs-repairs。
- 9. 合理设置资源请求和限制,防止节点压力过大。
- 10. 创建高可用PostgreSQL服务,对外统一入口。

## 如何配置PostgreSQL之间的异步流复制

1. 在每个PostgreSQL实例中配置streaming_replication参数为on,允许流复制。

- 在主节点使用如下SQL命令生成一个复制角色:
```sql
CREATE ROLE repluser WITH REPLICATION LOGIN PASSWORD 'replpass';
```

2. 在两个数据中心的主节点上都执行此命令,创建互相的复制账号。

- 修改postgresql.conf,添加以下参数:
```
wal_level = hot_standby
max_wal_senders = 5
```

3. 修改主节点的pg_hba.conf,添加以下规则:

```
host replication repluser 192.168.1.0/24 md5
```

4. 在备节点上配置recovery.conf:

```
standby_mode = on
primary_conninfo = 'host=192.168.1.23 port=5432 user=repluser password=replpass'  
trigger_file = '/tmp/postgresql.trigger'
```

5. 在备节点初始化数据库。

6. 在主节点使用pg_start_backup和pg_stop_backup进行一次基础备份。

7. 启动备节点数据库,开始接收流复制。

这样就可以实现两个数据中心PostgreSQL之间的流复制了。可以配置自动故障转移,如果主节点不可用,备节点可以快速接管成为新的主节点。

## k8s 快速部署
```bash
export KKZONE=cn. && curl -sfL https://get-kk.kubesphere.io | sh -
```
### 创建配置文件
- kubernetesVersion:指定要安装的 Kubernetes 版本。
- installBrokers:指定要安装的消息队列,可选 RabbitMQ、Kafka等。
- storageClass:定义要使用的存储类,如果是本地存储,需指定 localVolume 相关配置。
- controlPlaneEndpoint:控制平面节点的对外服务地址。
- apiServer:apiserver 的反亲和性,故障域等配置。
- controllerManager:controller-manager 的高可用配置。
- scheduler:scheduler 的高可用配置。
- etcd:etcd 集群的详细配置。
- workerMachines:工作节点定义,包括 IP,ssh 密钥等。
- addons:要安装的插件列表,如 Traefik、Dashboard 等。
- kubeProxy:kube-proxy 模式,如 ipvs 等。
- network:网络插件的选择,如 Calico,flannel 等。
- registry:私有镜像仓库配置。
- sshSecret: ssh 密钥配置。
```yml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: node1, address: 172.16.0.2, internalAddress: 172.16.0.2, user: ubuntu, password: "Qcloud@123"}
  - {name: node2, address: 172.16.0.3, internalAddress: 172.16.0.3, user: ubuntu, password: "Qcloud@123"}
  roleGroups:
    etcd:
    - node1
    control-plane: 
    - node1
    worker:
    - node1
    - node2
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    # internalLoadbalancer: haproxy

    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.23.10
    clusterName: cluster.local
    autoRenewCerts: true
    containerManager: docker
  etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  registry:
    privateRegistry: ""
    namespaceOverride: ""
    registryMirrors: []
    insecureRegistries: []
  addons: []
```