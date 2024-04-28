
---
title: 100%开源版低代码
tags:
  - 书签 
categories:
  - 书签 
date: 2022-02-15
---
# 框架
- [gantt 开源Javascript Gantt 甘特图](https://github.com/frappe/gantt)
- [datatable 数据库Web的Javascript数据表](https://github.com/frappe/datatable)
- [charts 无依赖性的简单、响应迅速的现代SVG图表](https://github.com/frappe/charts)

- [insights Frappe应用程序的免费开源数据分析工具 ](https://github.com/frappe/insights)
- [frappe 用于现实世界应用程序的Python和Javascript低代码web框架 ](https://github.com/frappe/frappe)
- [hrms 开源人力资源和薪资软件](https://github.com/frappe/hrms)
- [books 免费会计软件](https://github.com/frappe/books)
- [gameplan 开源远程团队工作交流工具](https://github.com/frappe/gameplan/)
- [helpdesk 客户服务软件 ](https://github.com/frappe/helpdesk)
- [health 健康信息系统](https://github.com/frappe/health)
- [Wiki应用程序。它非常适合提供动态的、文本密集的内容，如文档和知识库。](https://github.com/frappe/wiki)
- [drive 文档共享和管理解决方案](https://github.com/frappe/drive)
- [builder 可视化网页编辑器](https://github.com/frappe/builder)
# 低代码框架ERP
- [erpnext](https://github.com/jackerzz/erpnext)
- [interact](https://github.com/taye/interact.js)
- [pdfjs-dist](https://github.com/mozilla/pdfjs-dist)
# 数据库配置
- [MySQL 安装及设置](https://iguoli.github.io/2018/03/18/MySQL.html)
- [Setup MariaDB Server](https://github.com/frappe/frappe/wiki/Setup-MariaDB-Server)

# 快速开始
## bench 用法
- [bench 用法介绍](https://github.com/frappe/bench)
## 前置条件
### 前端
- nvm install 18
- nvm use 18
- node 18
```
npm install -g yarn 
```
### 后端
#### 数据安装
```bash
docker run --name mariadb -p 53306:3306 -e MYSQL_ROOT_PASSWORD=root -v /data/mariadb/data:/var/lib/mysql -d mariadb:10.7
```
- --skip-redis-config-generation 这里跳过redis，因为我需要使用远端reids服务
```
bench init --skip-redis-config-generation frappe-bench   && cd frappe-bench
```
#### 指定redis 初始化
```
bench init --redis-host 47.97.182.182 --redis-port 20604 kdi   && cd kdi
bench init \
  --set-mariadb-host 47.97.182.182:53306 \
  --set-redis-cache-host redis://47.97.182.182:20604/8 \
  --set-redis-queue-host redis://47.97.182.182:20604/8 \
  --set-redis-socketio-host redis://47.97.182.182:20604/8 \
  kdi   && cd kdi
bench init set-redis-cache-host=redis://47.97.182.182:20604/8 set-redis-queue-host=redis://47.97.182.182:20604/8 set-redis-socketio-host=redis://47.97.182.182:20604/8 kdi   && cd kdi
```
#### 指定版本
- [使用 Docker 创建 Frappe 语言环境](https://devpress.csdn.net/cloudnative/62f90ff5c6770329307fcfd1.html)
```bash
bench init --skip-redis-config-generation --frappe-branch version-13 frappe-bench && cd frappe-bench
bench set-mariadb-host mariadb
bench set-redis-cache-host redis-cache:6379
bench set-redis-queue-host redis-queue:6379
bench set-redis-socketio-host redis-socketio:6379
```
### build redis
```
bench build
```

# 安装第三方app
- 获取app
```bash
bench get-app https://gitee.com/yuzelin/erpnext_oob.git
```
14版本 bench get-app --branch version-14 https://gitee.com/yuzelin/erpnext_oob.git

- 安装APP(有多个站点且未设默认站点的请加--site参数）
```bash
bench install-app erpnext_oob

bench clear-cache && bench clear-website-cache
```
sudo supervisorctl restart all 升级 2.1、bench update 命令
```bash
bench update --apps erpnext_oob --pull --reset
```
- 重新编译JS等资源文件
```bash
bench build --app erpnext_oob --force
```
- 通过本应用中的插件机制向打印格式单据类型中新增两个字段(同步，新安装时不需要这一步，也可运行标准的bench migrate 命令，会对所有app作升级后同步数据库表处理) bench console In [6]: from frappe.utils.fixtures import sync_fixtures

In [7]: sync_fixtures('erpnext_oob')

- 卸载 3.1 从站点卸载
```bash
bench uninstall-app erpnext_oob
```
- 从整个bench环境卸载,移除整个应用目录
```bash
bench remove-app erpnext_oob
```

# 备份
ERPNext带有系统自动备份数据功能，可利用此备份文件将系统数据恢复至之前备份时间。

备份文件下载：
系统登录后，点【设置】菜单后，在“报表与主数据”的数据窗口中点【下载备份】即可进入备份数据下载页面。
注：系统默认保存最近的3个备份，可在此页面右上角点击【设置备份数量】自行设置。

恢复数据方法：
1、将下载的备份文件（以.sql.gz结尾命名）上传至服务器ERPNext安装目录下；
2、bench --site yoursitename --force restore yoursitebackup.sql.gz；
注：例如我的ERPNext网站命名为erp，上传备份文件至Ubuntu服务器的/home/erp/erp/sites/erp/private/backups/20211118_120001-erp-database.sql.gz，我在此第2步骤运行的命令为bench --site erp --force restore /home/erp/erp/sites/erp/private/backups/20211118_120001-erp-database.sql.gz
3、bench migrate
注：不执行这步，访问系统会出现Internal Server Error
4、bench update --patch
