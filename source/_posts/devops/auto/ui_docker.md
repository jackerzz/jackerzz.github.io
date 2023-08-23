---
title: 容器化运行-自动化脚本
tags:
  - auto
categories:
  - 自动化测试 
date: 2023-08-10 22:30:34
---
seleium 容器化
# vnc
https://serverok.in/start-x11vnc-with-supervisord
https://omar2cloud.github.io/rasp/x11vnc/

# 部署文档
```shell script
    docker run -d -p 4444:4444 -p 7900:7900 --shm-size="2g" selenium/standalone-chrome:4.3.0-20220726
```
## 文件拷贝
```
docker cp ./src/build 34b8ae6b5c0b:/usr/share/nginx/html
```

## 进入容器
```
 docker exec -it 775c7c9ee1e1 /bin/bash
```

## 密码
```shell script
secret
```
## 
```shell script
http://47.97.182.182:4444/ui#
```
- [vnc-客户端](https://www.realvnc.com/en/connect/download/viewer/#)

# pip 
 apt update  
 apt install python3-pip
pip3 install -r requirements.txt -i https://pypi.doubanio.com/simple/  

# 镜像打包
docker commit 17e12664d5f5 selenium-chrome:1.0
docker save -o selenium-chrome.tar selenium-chrome:1.0
