---
title: twemproxy
tags:
  - python
categories:
  - 开发笔记 
date: 2022-06-12 22:30:34
---


# RedisLive

- [RedisLive](https://github.com/nkrode/RedisLive)
- [网络工程师第三期 目录](https://blog.csdn.net/KW__jiaoq/article/details/119578867)
- [keepalived 1.3](https://www.keepalived.org/doc/introduction.html)
- [第六章 负载均衡及服务器集群（lvs）](http://www.keepalived.org/pdf/sery-lvs-cluster.pdf)
- [一篇文章了解CI/CD管道全流程](https://segmentfault.com/a/1190000039829057)


# 容器间通信
```yml
version: '2'
 
services:
    mysql:
        container_name: mysql
        restart: always
        image: docker.io/mysql:ninemax
        environment:
            MYSQL_ROOT_PASSWORD: ninemax
        volumes:
          - ./mysql/:/var/lib/mysql/
        ports:
          - "3308:3306"
        networks:       # 注册网络
          - mynet
    benti-images:
      build: .
      container_name: benti-images
      restart: always
      image: benti-images:11.0
      #links链接到其它服务中的容器，配置后benti-images容器就可以用mysql连接数据库，如：mysql:3306
      links: 
        - mysql
      ports:
        - "8080:7080"
      #tty: true 配置是为了容器保持后台运行，不退出。如果不加这个参数，benti-images容器会不断退出不断重启
      tty: true
      networks:   # 配置连接到注册的网络，保证在同一个网络域中
        - mynet
networks: 
    mynet: 
        driver: bridge                                  
```

# gitlab cicd docker-compose
- [Docker Compose 和 GitLab](https://medium.com/@vitalypanukhin/docker-compose-and-gitlab-b209d09210f6)

- .gitlab-ci.yml
```yml
image: creatiwww/docker-compose:latest

services:
  - docker:dind

variables:
  STAGE_SERVER_IP: 10.10.10.1
  PROD_SERVER_IP: 10.10.10.2
  STAGE_SERVER_USER: gitlab
  PROD_SERVER_USER: gitlab
  STAGE_IMAGE_APP_TAG: registry.my_organiation.org/development/amazing_app/app:stage
  PROD_IMAGE_APP_TAG: registry.my_organiation.org/development/amazing_app/app:prod
  EXTERNAL_SERVICE_STAGE_API_BASE_URL: https://test.some-service.com/
  EXTERNAL_SERVICE_PROD_API_BASE_URL: https://some-service.com/

stages:
  - build
  - staging
  - release
  - deploy

build:
  stage: build
  script:
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CI_REGISTRY_IMAGE
    - echo "IMAGE_APP_TAG=$STAGE_IMAGE_APP_TAG" >> .env
    - docker-compose build
    - docker-compose push
  only:
    - pre-prod
    - master

deploy-to-stage:
  stage: staging
  script:
    - eval $(ssh-agent -s)
    - echo "$SSH_STAGE_SERVER_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CI_REGISTRY_IMAGE
    - echo "EXTERNAL_SERVICE_KEY=$EXTERNAL_SERVICE_STAGE_KEY" >> .env
    - echo "IMAGE_APP_TAG=$STAGE_IMAGE_APP_TAG" >> .env
    - docker-compose -H "ssh://$STAGE_SERVER_USER@$STAGE_SERVER_IP" down --remove-orphans
    - docker-compose -H "ssh://$STAGE_SERVER_USER@$STAGE_SERVER_IP" pull
    - docker-compose -H "ssh://$STAGE_SERVER_USER@$STAGE_SERVER_IP" up -d
  only:
    - pre-prod
    - master

release:
  stage: release
  script:
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CI_REGISTRY_IMAGE
    - echo "IMAGE_APP_TAG=$PROD_IMAGE_APP_TAG" >> .env
    - docker-compose build
    - docker-compose push
  only:
    - master

deploy-to-prod:
  stage: deploy
  script:
    - eval $(ssh-agent -s)
    - echo "$SSH_PROD_SERVER_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CI_REGISTRY_IMAGE
    - echo "EXTERNAL_SERVICE_KEY=$EXTERNAL_SERVICE_PROD_KEY" >> .env
    - echo "IMAGE_APP_TAG=$PROD_IMAGE_APP_TAG" >> .env
    - docker-compose -H "ssh://$PROD_SERVER_USER@$PROD_SERVER_IP" down --remove-orphans
    - docker-compose -H "ssh://$PROD_SERVER_USER@$PROD_SERVER_IP" pull
    - docker-compose -H "ssh://$PROD_SERVER_USER@$PROD_SERVER_IP" up -d
  only:
    - master
  when: manual
```