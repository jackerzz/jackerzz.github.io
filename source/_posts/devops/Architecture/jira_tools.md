---
title: 基于flask的Jira 操作公共类
tags:
  - python
categories:
  - 开发笔记 
date: 2024-06-11
---
# 依赖
```
Flask==3.0.3
jira==3.8.0
```
# 配置类
- config.py
```python
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    DEBUG = os.getenv('DEBUG') or False
    ################  CMDB #######################
    CMDB_TOKEN = os.getenv('CMDB_TOKEN') or "2rPVyt3M-51GAO1tAiC-pE7MEDnuwyhEqIIZM_0M"
    CMDB_URL = os.getenv('CMDB_URL') or "https://cmdb.net"
    
    ################  finops #######################
    AUTH_URL = os.getenv('AUTH_URL') or "https://finops.net/api/s/identity/v3" 
    ACCESS_KEY = os.getenv('ACCESS_KEY') or "1a28d7422e4d0c8f31"
    ACCESS_SECRET = os.getenv('ACCESS_SECRET') or "ZjJhbldYVW5VRE5UQ3RHg="
    ################  jira #######################
    JIRA_AUTH_USER = os.getenv('JIRA_AUTH_USER') or ""
    JIRA_AUTH_PASSWORD = os.getenv('JIRA_AUTH_PASSWORD') or ""
    JIRA_SERVER = os.getenv('JIRA_SERVER') or ""
    
    ################  loguru #######################
    # log 输入路径
    LOG_PATH =os.getenv("LOG_PATH") or basedir+'/logs/'
    # log 文件名称
    LOG_NAME = os.getenv("LOG_NAME") or "run.log"
    # log 格式
    LOG_FORMAT = os.getenv("LOG_FORMAT") or ""
    # log 翻转时间
    LOG_ROTATION = os.getenv("LOG_ROTATION") or  60 * 60
    # 是否异步
    LOG_ENQUEUE = os.getenv("LOG_ENQUEUE") or True
    # 是否序列化
    LOG_SERIALIZE = os.getenv("LOG_SERIALIZE") or True

    @staticmethod
    def init_app(app):
        pass
```

## Jira 操作类
```python
# coding: utf-8
from jira import JIRA
from flask import current_app
import requests

class JiraPublic:
    def __init__(self,issue_key):
        self.app = current_app._get_current_object()
        self.jira = JIRA(
            auth=(
                self.app.config['JIRA_AUTH_USER'], 
                self.app.config['JIRA_AUTH_PASSWORD']
            ), 
            options={'server':  self.app.config['JIRA_SERVER']}
        )
        self.cookies = self.jira._session.cookies
        self.headers = {
            "Accept": "application/json",
        }
        self.issue_key = issue_key

    def add_comment_to_issue(self, comment_text):
        # print(comment_text)
        issue = self.jira.issue(self.issue_key)
        comment = self.jira.add_comment(issue, comment_text)
        return comment
    
    def format_table_as_comment(self,table_data):
        header = "| " + " | ".join(table_data[0]) + " |"
        separator = "| " + " | ".join(['---'] * len(table_data[0])) + " |"
        rows = ''
        for table_row in table_data[1:]:
            for row in table_row:
                rows +=" | "+ str(row)
            rows +="|\n"
        rows = header +"\n"+separator+"\n"+rows
        return rows
    
    def get_issue_details(self, issue_key):
            issue = self.jira.issue(issue_key)
            for field in dir(issue.fields):
                if field.startswith('customfield_') and getattr(issue.fields, field) != None:
                    print(field,getattr(issue.fields, field))
                    pass
                elif getattr(issue.fields, field) != None:
                    # print(field,getattr(issue.fields, field))
                    pass
            issue_details = {
                'key': issue.key,
                'summary': issue.fields.summary,
                'description': issue.fields.description,
                'status': issue.fields.status.name,
                'reporter': issue.fields.reporter.displayName,
                'assignee': issue.fields.assignee.displayName if issue.fields.assignee else None,
                'created': issue.fields.created,
                'updated': issue.fields.updated,
                'priority': issue.fields.priority.name if issue.fields.priority else None,
                'labels': issue.fields.labels,
                'comments': [comment.body for comment in self.jira.comments(issue)],
                'custom_fields': {field: getattr(issue.fields, field) for field in dir(issue.fields) if field.startswith('customfield_')}
            }
            
            return issue_details
    
class JiraCustomfield:
    def __init__(self):
        self.app = current_app._get_current_object()
        self.jira_auth_user = self.app.config['JIRA_AUTH_USER']
        self.jira_auth_password = self.app.config['JIRA_AUTH_PASSWORD']
        self.jira_server = self.app.config['JIRA_SERVER']
        self.base_url = f"{self.jira_server}/rest/api/latest"

        # 设置请求头
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

        # 获取 JIRA 的会话 cookie
        self.session = requests.Session()
        self.session.auth = (self.jira_auth_user, self.jira_auth_password)
        self.session.headers.update(self.headers)

    def keys_load(self,issue_details):
        import random
        # 模拟关键字
        keys_1 = ["集群扩容","集群配置变更（HA、亲和性、DRS）","快照创建","快照删除","虚拟机配置调整"]
        # 模拟二级关键字
        keys_2 = ["加物理主机","主机扩容","·新建集群","加网卡","更改IP"]
        # 模拟集群名称
        cluster_name=[None,"cluster:/HedanVC-Data02/VxRail-Datacenter/VxRail-Virtual-SAN-Cluster-10fe5e32-272e-4f79-bc56-e4286f0e4098","cluster:/HedanVC-Prod/Datacenter/Prod_Hogan_Cluster","cluster:/HedanVC-Test/Datacenter/CNHD-TestCluster02"]
        # 模拟ip
        ip_list = [None,"10.126.154.52","10.126.151.61"]
        # 模拟ESXI机器
        esxi_list = ['10-126-154-97','shoypepiesxi20','shoypepiesxi18',None]
        # 模拟虚拟机名称
        vm_name = [None,]

        return random.choice(keys_1),random.choice(cluster_name),\
            random.choice(ip_list),random.choice(vm_name),random.choice(keys_2),\
            random.choice(esxi_list)

    def get_issue_details(self, issue_key):
        url = f"{self.base_url}jira/secure/AjaxIssueAction!default.jspa?issueKey={issue_key}"
        try:
            response = self.session.get(url)
            response.raise_for_status()  # 检查请求是否成功
            issue_details = response.json()  # 解析 JSON 响应
            result = self.keys_load(issue_details)
            return result
        except requests.exceptions.RequestException as e:
            print(f"Error fetching issue details for {issue_key}: {e}")
            return None
```

## 启动类
- manager.py
```python
import os
basedir = os.path.abspath(os.path.dirname(__file__))


from app import create_app
app = create_app(os.getenv('FLASK_CONFIG') or 'default')


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=os.getenv('DEBUG'))
```

## 启动脚本Liunx
```sh
CURRENT_DIR=$(pwd)
export PYTHONUNBUFFERED=1
export PYTHONPATH="$CURRENT_DIR/project_name"
export DEBUG="True"
export CMDB_URL="https://cmdb.net"
export AUTH_URL="https://finops.net/api/s/identity/v3" 
export JIRA_SERVER="https://pmo.com.cn/jira/"
export FLASK_CONFIG="project_name"
export CMDB_TOKEN=""
export JIRA_AUTH_USER=""
export JIRA_AUTH_PASSWORD=""
export ACCESS_KEY=""
export ACCESS_SECRET=""
python manager.py
# chmod +x setup_and_run.sh
# gunicorn -c gun.py manager:app
```

## 启动脚本Windows
```bat
@echo off
set "CURRENT_DIR=%cd%"
set "PYTHONPATH=%CURRENT_DIR%\project_name"
set JIRA_SERVER=https://pmo.com.cn/jira/
set CMDB_URL=https://cmdb.net
set AUTH_URL=https://finops.net/api/s/identity/v3
set DEBUG=True
set FLASK_CONFIG="project_name"
set JIRA_AUTH_USER=
set JIRA_AUTH_PASSWORD=
set CMDB_TOKEN=
set ACCESS_KEY=
set ACCESS_SECRET=
python manager.py

```