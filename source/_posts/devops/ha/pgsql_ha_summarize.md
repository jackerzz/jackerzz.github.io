---
title: Pg sql 数据库高可用总结
tags:
  - PostgreSQL
categories:
  - 开发笔记 
date: 2027-07-14 22:30:34
---
# Pg sql 数据库高可用总结

# 高可用涉及组件
- [vip-manager](https://github.com/cybertec-postgresql/vip-manager/blob/master/vipconfig/vip-manager.yml)
- [pgbouncer](https://github.com/pgbouncer/pgbouncer.git)
- [citus](https://docs.citusdata.com/en/stable/sharding/data_modeling.html#colocation)
- [patroni](https://github.com/zalando/patroni)

##  vip-manager 配置翻译
```yml
# vip-manager 配置

# vip-manager 醒来检查是否需要注册或释放 IP 地址的时间间隔(毫秒)
interval: 1000

# vip-manager 定期轮询的 etcd 或 consul 密钥
trigger-key: "/service/pgcluster/leader"

# 如果上述密钥的值与 trigger-value 匹配(通常是这台主机的主机名),vip-manager 将尝试将虚拟 IP 地址添加到 Iface 指定的接口
trigger-value: "pgcluster_member1"  

# 要管理的虚拟 IP 地址
ip: 192.168.0.123

# 虚拟 IP 的网络掩码    
netmask: 24

# 将添加虚拟 IP 的接口
interface: enp0s3

# 虚拟 IP 的管理方式。我们目前支持通过 shell 命令或 Hetzner API 的 "ip addr add/remove"
hosting-type: basic # 可能的值:basic 或 hetzner

# 分布式协调存储类型:etcd 或 consul
dcs-type: etcd 

# 包含 vip-manager 可以连接到的所有 DCS 端点的列表
dcs-endpoints:
  - http://127.0.0.1:2379
  - https://192.168.0.42:2379
  
# 对于 consul,您显然需要将端口更改为 8500,除非您使用不同的端口。

# etcd 认证的用户名和密码  
etcd-user: "patroni"
etcd-password: "Julian's secret password"

# 当指定 etcd-ca-file 时,将使用 TLS 连接到 etcd 端点
etcd-ca-file: "/path/to/etcd/trusted/ca/file"

# 当指定 etcd-cert-file 和 etcd-key-file 时,我们将使用此证书和密钥在 etcd 端点进行认证
etcd-cert-file: "/path/to/etcd/client/cert/file"
etcd-key-file: "/path/to/etcd/client/key/file"

# 不要担心与端点类型不匹配的前缀参数。您可以在那里写入任何内容,我甚至不会看它。
consul-token: "Julian's secret token"

# 重试次数和重试间隔时间(毫秒)(当前仅影响 arpClient)  
retry-num: 2
retry-after: 250  

# 详细日志(当前仅支持 hetzner)
verbose: false
```
## patroni 配置翻译
```yml
scope: batman
#namespace: /service/
name: postgresql0

restapi:
  listen: 127.0.0.1:8008
  connect_address: 127.0.0.1:8008
#  cafile: /etc/ssl/certs/ssl-cacert-snakeoil.pem
#  certfile: /etc/ssl/certs/ssl-cert-snakeoil.pem
#  keyfile: /etc/ssl/private/ssl-cert-snakeoil.key
#  authentication:
#    username: username
#    password: password

#ctl:
#  insecure: false # Allow connections to Patroni REST API without verifying certificates
#  certfile: /etc/ssl/certs/ssl-cert-snakeoil.pem
#  keyfile: /etc/ssl/private/ssl-cert-snakeoil.key
#  cacert: /etc/ssl/certs/ssl-cacert-snakeoil.pem

#citus:
#  database: citus
#  group: 0  # coordinator

etcd:
  #Provide host to do the initial discovery of the cluster topology:
  host: 127.0.0.1:2379
  #Or use "hosts" to provide multiple endpoints
  #Could be a comma separated string:
  #hosts: host1:port1,host2:port2
  #or an actual yaml list:
  #hosts:
  #- host1:port1
  #- host2:port2
  #Once discovery is complete Patroni will use the list of advertised clientURLs
  #It is possible to change this behavior through by setting:
  #use_proxies: true

#raft:
#  data_dir: .
#  self_addr: 127.0.0.1:2222
#  partner_addrs:
#  - 127.0.0.1:2223
#  - 127.0.0.1:2224

bootstrap:
  # this section will be written into Etcd:/<namespace>/<scope>/config after initializing new cluster
  # and all other cluster members will use it as a `global configuration`
  dcs:
    ttl: 30
    loop_wait: 10
    retry_timeout: 10
    maximum_lag_on_failover: 1048576
#    primary_start_timeout: 300
#    synchronous_mode: false
    #standby_cluster:
      #host: 127.0.0.1
      #port: 1111
      #primary_slot_name: patroni
    postgresql:
      use_pg_rewind: true
      pg_hba:
      # For kerberos gss based connectivity (discard @.*$)
      #- host replication replicator 127.0.0.1/32 gss include_realm=0
      #- host all all 0.0.0.0/0 gss include_realm=0
      - host replication replicator 127.0.0.1/32 md5
      - host all all 0.0.0.0/0 md5
      #  - hostssl all all 0.0.0.0/0 md5
#      use_slots: true
      parameters:
#        wal_level: hot_standby
#        hot_standby: "on"
#        max_connections: 100
#        max_worker_processes: 8
#        wal_keep_segments: 8
#        max_wal_senders: 10
#        max_replication_slots: 10
#        max_prepared_transactions: 0
#        max_locks_per_transaction: 64
#        wal_log_hints: "on"
#        track_commit_timestamp: "off"
#        archive_mode: "on"
#        archive_timeout: 1800s
#        archive_command: mkdir -p ../wal_archive && test ! -f ../wal_archive/%f && cp %p ../wal_archive/%f
#      recovery_conf:
#        restore_command: cp ../wal_archive/%f %p

  # some desired options for 'initdb'
  initdb:  # Note: It needs to be a list (some options need values, others are switches)
  - encoding: UTF8
  - data-checksums

  # Additional script to be launched after initial cluster creation (will be passed the connection URL as parameter)
# post_init: /usr/local/bin/setup_cluster.sh

  # Some additional users which needs to be created after initializing new cluster
  users:
    admin:
      password: admin%
      options:
        - createrole
        - createdb

postgresql:
  listen: 127.0.0.1:5432
  connect_address: 127.0.0.1:5432

#  proxy_address: 127.0.0.1:5433  # The address of connection pool (e.g., pgbouncer) running next to Patroni/Postgres. Only for service discovery.
  data_dir: data/postgresql0
#  bin_dir:
#  config_dir:
  pgpass: /tmp/pgpass0
  authentication:
    replication:
      username: replicator
      password: rep-pass
    superuser:
      username: postgres
      password: zalando
    rewind:  # Has no effect on postgres 10 and lower
      username: rewind_user
      password: rewind_password
  # Server side kerberos spn
#  krbsrvname: postgres
  parameters:
    # Fully qualified kerberos ticket file for the running user
    # same as KRB5CCNAME used by the GSS
#   krb_server_keyfile: /var/spool/keytabs/postgres
    unix_socket_directories: '..'  # parent directory of data_dir
  # Additional fencing script executed after acquiring the leader lock but before promoting the replica
  #pre_promote: /path/to/pre_promote.sh

#watchdog:
#  mode: automatic # Allowed values: off, automatic, required
#  device: /dev/watchdog
#  safety_margin: 5

tags:
    nofailover: false
    noloadbalance: false
    clonefrom: false
    nosync: false
```

## citus 配置翻译

## pgbouncer 配置翻译

# 参考资料
- [Patroni 3.0 & Citus: Scalable, Highly Available Postgres](https://www.citusdata.com/blog/2023/03/06/patroni-3-0-and-citus-scalable-ha-postgres/)


我想在haproxy 中进行挂在本地文件
```yml
version: "2"

networks:
    demo:

services:
    etcd1: &etcd
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        environment:
            ETCDCTL_API: 3
            ETCD_LISTEN_PEER_URLS: http://0.0.0.0:2380
            ETCD_LISTEN_CLIENT_URLS: http://0.0.0.0:2379
            ETCD_INITIAL_CLUSTER: etcd1=http://etcd1:2380,etcd2=http://etcd2:2380,etcd3=http://etcd3:2380
            ETCD_INITIAL_CLUSTER_STATE: new
            ETCD_INITIAL_CLUSTER_TOKEN: tutorial
            ETCD_UNSUPPORTED_ARCH: arm64
        container_name: demo-etcd1
        hostname: etcd1
        command: etcd -name etcd1 -initial-advertise-peer-urls http://etcd1:2380

    etcd2:
        <<: *etcd
        container_name: demo-etcd2
        hostname: etcd2
        command: etcd -name etcd2 -initial-advertise-peer-urls http://etcd2:2380

    etcd3:
        <<: *etcd
        container_name: demo-etcd3
        hostname: etcd3
        command: etcd -name etcd3 -initial-advertise-peer-urls http://etcd3:2380

    haproxy:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: haproxy
        container_name: demo-haproxy
        ports:
            - "5000:5000"  # Access to the coorinator primary
            - "5001:5001"  # Load-balancing across workers primaries
        command: haproxy
        environment: &haproxy_env
            ETCDCTL_API: 3
            ETCDCTL_ENDPOINTS: http://etcd1:2379,http://etcd2:2379,http://etcd3:2379
            PATRONI_ETCD3_HOSTS: "'etcd1:2379','etcd2:2379','etcd3:2379'"
            PATRONI_SCOPE: demo
            PATRONI_CITUS_GROUP: 0
            PATRONI_CITUS_DATABASE: citus
            PGSSLMODE: verify-ca
            PGSSLKEY: /etc/ssl/private/ssl-cert-snakeoil.key
            PGSSLCERT: /etc/ssl/certs/ssl-cert-snakeoil.pem
            PGSSLROOTCERT: /etc/ssl/certs/ssl-cert-snakeoil.pem

    coord1:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: coord1
        container_name: demo-coord1
        environment: &coord_env
            <<: *haproxy_env
            PATRONI_NAME: coord1
            PATRONI_CITUS_GROUP: 0

    coord2:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: coord2
        container_name: demo-coord2
        environment:
            <<: *coord_env
            PATRONI_NAME: coord2

    coord3:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: coord3
        container_name: demo-coord3
        environment:
            <<: *coord_env
            PATRONI_NAME: coord3


    work1-1:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: work1-1
        container_name: demo-work1-1
        environment: &work1_env
            <<: *haproxy_env
            PATRONI_NAME: work1-1
            PATRONI_CITUS_GROUP: 1

    work1-2:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: work1-2
        container_name: demo-work1-2
        environment:
            <<: *work1_env
            PATRONI_NAME: work1-2


    work2-1:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: work2-1
        container_name: demo-work2-1
        environment: &work2_env
            <<: *haproxy_env
            PATRONI_NAME: work2-1
            PATRONI_CITUS_GROUP: 2

    work2-2:
        image: ${PATRONI_TEST_IMAGE:-patroni-citus}
        networks: [ demo ]
        env_file: docker/patroni.env
        hostname: work2-2
        container_name: demo-work2-2
        environment:
            <<: *work2_env
            PATRONI_NAME: work2-2

```