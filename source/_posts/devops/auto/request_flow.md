---
title: 流量录制回放工具
tags:
  - 自动化测试
categories:
  - 自动化测试 
date: 2022-07-20 22:30:34
---

- [sharingan-golang-的流量录制与回放](https://github.com/didi/sharingan)
- [goreplay ](https://github.com/buger/goreplay)
# ngx_http_mirror_module
```bash
location / {
    mirror /mirror;
    proxy_pass
}

location /mirror {
    internal;
    proxy_pass http://test_backend$request_uri;
}
```

## 示例配置
```bash
server {
    listen 8080;
    access_log /home/work/log/nginx/org.log;
    root html/org;
}

server {
    listen 8081;
    access_log /home/work/log/nginx/mir.log ;
    root html/mir;
}

upstream backend {
    server 127.0.0.1:8080;
}

upstream test_backend {
    server 127.0.0.1:8081;
}

server {
    listen       80;
    server_name  localhost;

    # original 配置
    location / {
        # mirror指定镜像uri为 /mirror
        mirror /mirror;
        # off|on 指定是否镜像请求body部分(开启为on，则请求自动缓存;)
        mirror_request_body off;
        # 指定上游server的地址
        proxy_pass http://backend;
    }
	
	 # mirror 配置
    location /mirror {
        # 指定此location只能被“内部的”请求调用
        internal;
        # 指定上游server的地址
        proxy_pass http://test_backend$request_uri;
        # 设置镜像流量的头部
        proxy_set_header X-Original-URI $request_uri;
    }

}
```

## 流量放大
```bash
location / {
   mirror /mirror;
   mirror /mirror;
   proxy_pass http://backend;
}
```

## 参考资料
- [Nginx 的实时流量复制模块](https://juejin.cn/post/6844903544659640328#id16)
- [Linux流量复制工具](https://dennisit.github.io/2015/09/11/%E5%BA%94%E7%94%A8%E5%AE%9E%E8%B7%B5/Linux%E6%B5%81%E9%87%8F%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7/)