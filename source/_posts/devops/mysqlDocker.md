---
title: MySQL5.7 docker 容器化部署日志
tags:
  - docker
  - mysql
categories:
  - DevNote 
date: 2021-03-21
---

# MySQL5.7 docker 容器化部署日志
- 书推荐 [Docker — 从入门到实践（v1.1）](https://www.bookstack.cn/books/docker_practice-v1.1.0)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210323234134590.gif#pic_center)

- ### 拉取镜像
```shell 
docker pull mysql:5.7
```
- ###  新建本地挂载卷
```bash
mkdir -p /home/docker/mysql/conf && mkdir -p /home/docker/mysql/data
```
- ### 启动容器
```bash
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root  -v /home/docker/mysql/conf/my.cnf:/etc/mysql/my.cnf  -v /home/docker/mysql/data:/var/lib/mysql  --restart=on-failure:3 -d mysql:5.7
```
- ### 说明
```bash
--name：容器名
--p：映射宿主主机端口
-v：挂载宿主目录到容器目录
-e：设置环境变量，此处指定root密码
-d：后台运行容器
```
- ### 查看mysql 5.7 状态
```bash
docker ps

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
dad1985894f9        mysql:5.7           "docker-entrypoint.s…"   15 seconds ago      Up 14 seconds       33060/tcp, 0.0.0.0:3307->3306/tcp   mysql5.7
```
- ### 进入容器
```bash
docker start 容器ID
docker exec -it 容器名字 /bin/bash
```
- 示例
```bash
docker exec -it 96a49c6e7235 /bin/bash
```
- ### 重启容器
```bash
docker restart mysql5.7
```
- 表名区分大小写
```bash
表名区分大小写
在宿主机上该目录下：home/docker/mysql/conf 创建一个mysql.cnf
```

- mysql.cnf
```bash
	[mysqld]
	lower_case_table_names=1
```