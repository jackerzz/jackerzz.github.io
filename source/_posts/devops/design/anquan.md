
---
title: ELK接收Paloalto日志并用钉钉告警
tags:
  - python
categories:
  - 开发笔记 
date: 2022-03-02 22:00
---

`一个人的安全部之ELK接收Paloalto日志并用钉钉告警 容器版`

# 起因
`观一篇文章，偶感写道`
`通报漏洞后，开发未能及时修复漏洞，导致被攻击，领导说我发现被攻击的时间晚了，由于一个人安全部精力有限未能及时看IPS告警，于是做了个钉钉告警`

# 环境

- ubuntu 14.04
- python 2.7
- kibana-5.5.2
- logstash-5.5.2
- elasticsearch-5.5.2
- paloalto软件版本7.1.14

## ubuntu 14.04
```shell
FROM       ubuntu:14.04
MAINTAINER Aleksandar Diklic "https://jackerzz.github.io/"

RUN apt-get update

RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd

RUN echo 'root:root' |chpasswd

RUN sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config

RUN mkdir /root/.ssh

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 22

CMD    ["/usr/sbin/sshd", "-D"]
```

# Elastic Search集群的方法---docker-compose

## 安装docker-compose
```
curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-Linux-x86_64 \
> /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

## elasticsearch/docker-compose.yml
```yml
version: '2'
services:
 elasticsearch1:
  image: docker.elastic.co/elasticsearch/elasticsearch:5.5.2
  container_name: elasticsearch1
  environment:
   - cluster.name=docker-cluster
   - bootstrap.memory_lock=true
   - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
  ulimits:
   memlock:
    soft: -1
    hard: -1
  mem_limit: 1g
  volumes:
   - esdata1:/usr/share/elasticsearch/data
  ports:
   - 9200:9200
  networks:
   - esnet
 elasticsearch2:
  image: docker.elastic.co/elasticsearch/elasticsearch:5.5.2
  environment:
   - cluster.name=docker-cluster
   - bootstrap.memory_lock=true
   - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
   - "discovery.zen.ping.unicast.hosts=elasticsearch1"
  ulimits:
   memlock:
    soft: -1
    hard: -1
  mem_limit: 1g
  volumes:
   - esdata2:/usr/share/elasticsearch/data
  networks:
   - esnet
 
volumes:
 esdata1:
  driver: local
 esdata2:
  driver: local
 
networks:
 esnet:
```

`备注`：`在/etc/sysctl.conf文件中追加一行`

## 执行命令应用变更：
```shell
sudo sysctl -p
```
## 在docker-compose.yml所在的目录执行以下命令，启动elastic search集群：
```shell
docker stop my-elastic && docker rm my-elastic
docker-compose up &
```

....待续待验证

# 参考链接
[paloalto 行业白皮书](https://www.paloaltonetworks.cn/resources)
[Palo Alto Networks and Elastic](https://www.elastic.co/cn/partners/palo-alto-networks/)
[详解如何使用Docker快速部署ELK环境(最新5.5.1版本)](https://www.zhangshengrong.com/p/3mNmm6rgNj/)
[【转载】一个人的安全部之ELK接收Paloalto日志并用钉钉告警 ](https://www.cnblogs.com/h2zZhou/p/8425205.html#!comments )