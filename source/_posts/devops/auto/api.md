---
title: 接口测试
tags:
  - auto
categories:
  - 自动化测试 
date: 2022-07-24 22:30:34
---

# 接口自动化测试

## [httprunner-3.3k start](https://github.com/httprunner/httprunner)

> `golang` `python`

![image-20200924081614472](https://camo.githubusercontent.com/678fe668e23a584ee22d9bd8af7326482080778d66204a5209ebfcc70ec8acbb/68747470733a2f2f6874747072756e6e65722e636f6d2f696d6167652f6872702d666c6f772e6a7067)


- 网络协议：完整支持 HTTP(S)/HTTP2/WebSocket，可扩展支持 TCP/UDP/RPC 等更多协议
- 多格式可选：测试用例支持 YAML/JSON/go test/pytest 格式，并且支持格式互相转换
- 双执行引擎：同时支持 golang/python 两个执行引擎，兼具 go 的高性能和 pytest 的丰富生态
- 录制 & 生成：可使用 HAR/Postman/Swagger/curl 等生成测试用例；基于链式调用的方法提示也可快速编写测试用例
- 复杂场景：基于 variables/extract/validate/hooks 机制可以方便地创建任意复杂的测试场景
- 插件化机制：内置丰富的函数库，同时可以基于主流编程语言（go/python/java）编写自定义函数轻松实现更多能力
- 性能测试：无需额外工作即可实现压力测试；单机可轻松支撑 1w+ VUM，结合分布式负载能力可实现海量发压
- 网络性能采集：在场景化接口测试的基础上，可额外采集网络链路性能指标（DNS 解析、TCP 连接、SSL 握手、网络传输等）
- 一键部署：采用二进制命令行工具分发，无需环境依赖，一条命令即可在 macOS/Linux/Windows 快速完成安装部署

##  api测试示例
> [DemoAPI python3+selenium3+unittest测试框架及ddt数据驱动](https://github.com/yingoja/DemoAPI)
> [python_接口自动化测试框架原文](https://www.cnblogs.com/yinjia/p/9503408.html#4614912)

- 测试数据不可控制。比如接口返回数据不可控，就无法自动断言接口返回的数据，不能断定是接口程序引起，还是测试数据变化引起的错误，所以需要做一些初始化测试数据。接口工具没有具备初始化测试数据功能，无法做到真正的接口测试自动化。
- 无法测试加密接口。实际项目中，多数接口不是可以随便调用，一般情况无法摸拟和生成加密算法。如时间戳和MDB加密算法，一般接口工具无法摸拟。
- 扩展能力不足。开源的接口测试工具无法实现扩展功能。比如，我们想生成不同格式的测试报告，想将测试报告发送到指定邮箱，又想让接口测试集成到CI中，做持续集成定时任务。

# Robot Framework 博客园介绍
- [Robot Framework](https://www.cnblogs.com/yinjia/category/1598575.html)

# 参考连接
- [ddt 数据驱动](https://github.com/datadriventests/ddt)
- [httprunner 官网](https://httprunner.com/quickrunner/overview/)
- [httprunner 灵感来自](https://www.cnblogs.com/yinjia/p/10415920.html#4665362)
