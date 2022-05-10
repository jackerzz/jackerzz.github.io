---
title:  ansible Api 开发技巧 1
tags:
  - ansible
categories:
  - 开发笔记 
date: 2022-05-10 19:20:23
---

# 参考连接
## celery 分布式
[celery + rabbitmq初步](https://cloud.tencent.com/developer/article/1444974)
[参数详解](https://www.cnblogs.com/traditional/p/11788756.html)
[消息队列 Kombu 之 基本架构](https://www.1024sou.com/article/1386.html)
[celery 多任务多队列](https://blog.51cto.com/u_14246112/3142160)

## flower-celery 监控可视化
```bash
celery flower\
     --broker=redis://192.168.95.120:6379/2 \   # 消息队列
     --address='0.0.0.0'\     # 绑定的ip 
     --port=5555              # 绑定端口
     --basic_auth=user1:password1  # 基础登录验证
     --persistent=True             # 
     --max_tasks=100 #这限制了将存储在数据库中的任务数量。一旦达到限制，它将丢弃旧任务。
     --db=logs/flowerdb -A monitor
     
```
[Flower-Celery 监控工具](https://flower-docs-cn.readthedocs.io/zh/latest/)
## Ansible

### Ansible 开发指南
[Ansible 总目录](https://lework.github.io/category/#Ansible)
[ansible 开发指南](https://docs.ansible.com/ansible/latest/dev_guide/index.html)
[ansible-2.7 开发指南](https://docs.ansible.com/ansible/2.7/dev_guide/index.html)
[ansible--配置--blag](http://bb.chaofml.cn/blog/2022/03/11/python/ansible/)
[Ansible的委托并发和任务超时](https://www.cnblogs.com/v394435982/p/5180933.html)
[ansible---开发示例](http://blog.65535.fun/article/2020/7/9/100.html)

### Ansible devops 项目
[KubeOperator--v2.6.23](https://github.com/KubeOperator/KubeOperator/releases/tag/v2.6.23)
[devops---ansible](https://github.com/leffss/devops/blob/master/util/ansible_api_test.py)

### Ansible 安全
[iptables设置](https://lework.github.io/2017/07/08/Ansible-an-quan-zhi-iptables-she-zhi/)
[加密主机清单](https://lework.github.io/2017/07/08/Ansible-an-quan-zhi-jia-mi-zhu-ji-qing-dan/)
[Ansible 安全 之【命令审计】](https://lework.github.io/2017/07/08/Ansible-an-quan-zhi-ming-ling-shen-ji/)

