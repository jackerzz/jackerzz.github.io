---
title: 日志--工具模块
tags:
  - docker
categories:
  - 开发笔记 
date: 2021-08-12 21:50:34
---

## mysql 5.7
数据持久化管理工具

###  新建挂载文件(`当然这样并不合适`)
```bash
mkdir -p /home/docker/mysql/conf && mkdir -p /home/docker/mysql/data
```
### 部署容器
```bash
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root  -v /home/docker/mysql/conf/my.cnf:/etc/mysql/my.cnf  -v /home/docker/mysql/data:/var/lib/mysql  --restart=on-failure:3 -d mysql:5.7
# -d：后台运行
# -p：将容器内部端口向外映射
# --name：命名容器名称
# -v：将容器内数据文件夹或者日志、配置等文件夹挂载到宿主机指定目录
# -e：设置环境变量，此处指定root密码
```


## Portainer
Portainer 是一个强大的、基于 GUI 的容器即服务解决方案，可帮助组织轻松安全地管理和部署云原生应用程序。

### 新建挂载文件(`当然这样并不合适`)
```bash
mkdir -p /data/portainer/data /data/portainer/public
```

### 下载汉化包并解压到 `/data/portainer` 目录
```bash
cd /data/portainer
wget https://dl.quchao.net/Soft/Portainer-CN.zip
unzip Portainer-CN.zip -d public
```

### 部署容器
```bash
docker run -d --restart=always --name portainer -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v /data/portainer/data:/data -v /data/portainer/public:/public portainer/portainer
# -d：后台运行
# -p：将容器内部端口向外映射
# --name：命名容器名称
# -v：将容器内数据文件夹或者日志、配置等文件夹挂载到宿主机指定目录
```

## gitlab
GitLab是一个基于 Web 的 DevOps生命周期工具，它提供Git 存储库管理器，提供wiki、问题跟踪和持续集成和部署管道功能，使用由 GitLab Inc. 开发的开源许可证。

### 新建挂载文件(`当然这样并不合适`)
```bash
mkdir -p /home/gitlab/logs && mkdir -p /home/gitlab/config && mkdir -p /home/gitlab/data
```

### 部署容器
```bash
docker run -d  -p 443:443 -p 80:80 -p 21386:22 --name gitlab --restart always -v /home/gitlab/config:/etc/gitlab -v /home/gitlab/logs:/var/log/gitlab -v /home/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce:13.2.1-ce.0

# -d：后台运行
# -p：将容器内部端口向外映射
# --name：命名容器名称
# -v：将容器内数据文件夹或者日志、配置等文件夹挂载到宿主机指定目录
```

## KubeSphere
KubeSphere 愿景是打造一个以 Kubernetes 为内核的云原生分布式操作系统，它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用（plug-and-play）的集成，支持云原生应用在多云与多集群的统一分发和运维管理

### `部署参考资料`
[KubeSphere-v2.1](https://v2-1.docs.kubesphere.io/docs/zh-CN/introduction/what-is-kubesphere/)
[KubeSphere-v3.1.1](https://kubesphere.io/zh/docs/quick-start/all-in-one-on-linux/)


## 推荐
[Docker — 从入门到实践（v1.1）](https://www.bookstack.cn/books/docker_practice-v1.1.0)
[KubeSphere-v2.1](https://v2-1.docs.kubesphere.io/docs/zh-CN/introduction/what-is-kubesphere/)
[KubeSphere-v3.1.1](https://kubesphere.io/zh/docs/quick-start/all-in-one-on-linux/)