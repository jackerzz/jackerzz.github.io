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
- [postgres-operator-examples](https://github.com/CrunchyData/postgres-operator-examples.git)
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

## docker-compose 容器编排
在每个数据中心内部署一个PostgreSQL主节点和多个从节点。
使用多主模式,在两个数据中心内都有一个可读写的主节点
配置流复制,使两个数据中心的PostgreSQL节点之间实现异步复制。
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
  - {name: master, address: 192.168.5.21, internalAddress: 192.168.5.21, user: root, password: "xxxxxx.net"}
  - {name: node1, address: 192.168.5.96, internalAddress: 192.168.5.96, user: root, password: "xxxxx.net"}
  - {name: node2, address: 192.168.5.82, internalAddress: 192.168.5.82, user: root, password: "xxxxx.net"}
  roleGroups:
    etcd:
    - master
    control-plane: 
    - master
    worker:
    - node1
    - node2
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    internalLoadbalancer: haproxy

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
- ./kk create cluster -f config-sample.yaml 
- yum install -y socat conntrack

### 添加节点

将新节点的信息添加到集群配置文件，然后应用更改。

```shell
./kk add nodes -f config-sample.yaml
```

### 删除节点

通过以下命令删除节点，nodename指需要删除的节点名。

```shell
./kk delete node <nodeName> -f config-sample.yaml
```

### 删除集群

您可以通过以下命令删除集群：

* 如果您以快速入门（all-in-one）开始：

```shell
./kk delete cluster
```

* 如果从高级安装开始（使用配置文件创建的集群）：

```shell
./kk delete cluster [-f config-sample.yaml]
```

### 集群升级

#### 单节点集群

升级集群到指定版本。

```shell
./kk upgrade [--with-kubernetes version] [--with-kubesphere version] 
```

* `--with-kubernetes` 指定kubernetes目标版本。
* `--with-kubesphere` 指定kubesphere目标版本。

#### 多节点集群

通过指定配置文件对集群进行升级。

```shell
./kk upgrade [--with-kubernetes version] [--with-kubesphere version] [(-f | --filename) path]
```

* `--with-kubernetes` 指定kubernetes目标版本。
* `--with-kubesphere` 指定kubesphere目标版本。
* `-f` 指定集群安装时创建的配置文件。

> 注意: 升级多节点集群需要指定配置文件. 如果集群非kubekey创建，或者创建集群时生成的配置文件丢失，需要重新生成配置文件，或使用以下方法生成。

Getting cluster info and generating kubekey's configuration file (optional).

```shell
./kk create config [--from-cluster] [(-f | --filename) path] [--kubeconfig path]
```

* `--from-cluster` 根据已存在集群信息生成配置文件.
* `-f` 指定生成配置文件路径.
* `--kubeconfig` 指定集群kubeconfig文件.
* 由于无法全面获取集群配置，生成配置文件后，请根据集群实际信息补全配置文件。

### 启用 kubectl 自动补全

KubeKey 不会启用 kubectl 自动补全功能。请参阅下面的指南并将其打开：

**先决条件**：确保已安装 `bash-autocompletion` 并可以正常工作。

```shell
# 安装 bash-completion
apt-get install bash-completion

# 将 completion 脚本添加到你的 ~/.bashrc 文件
echo 'source <(kubectl completion bash)' >>~/.bashrc

# 将 completion 脚本添加到 /etc/bash_completion.d 目录
kubectl completion bash >/etc/bash_completion.d/kubectl
```
