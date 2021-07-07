---
title: nginx配置
tags:
  - Nginx
categories:
  - DevNote 
date: 2021-07-05 22:30:34
---
# nginx配置

nginx是一个功能非常强大的web服务器加反向代理服务器，同时又是邮件服务器等等

在项目使用中，使用最多的三个核心功能是反向代理、负载均衡和静态服务器

这三个不同的功能的使用，都跟nginx的配置密切相关，nginx服务器的配置信息主要集中在nginx.conf这个配置文件中，并且所有的可配置选项大致分为以下几个部

```nginx
ain                                # 全局配置

events {                            # nginx工作模式配置

}

http {                                # http设置
    ....

    server {                        # 服务器主机配置
        ....
        location {                    # 路由配置
            ....
        }

        location path {
            ....
        }

        location otherpath {
            ....
        }
    }

    server {
        ....

        location {
            ....
        }
    }

    upstream name {                    # 负载均衡配置
        ....
    }
}
```

## 参考资料
- [Nginx源码安装](https://blog.csdn.net/xyang81/article/details/51476293)
- [Nginx负载均衡配置](https://blog.csdn.net/xyang81/article/details/51702900)
- [Keepalived安装与配置](https://blog.csdn.net/xyang81/article/details/52554398)
- [Keepalived+Nginx实现高可用（HA）](https://blog.csdn.net/xyang81/article/details/52556886)