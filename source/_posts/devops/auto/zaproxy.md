---
title: 安全审查套件---zaproxy
tags:
  - 测试平台构建
categories:
  - 自动化测试 
date: 2022-06-30 22:30:34
---

# zaproxy

```
docker pull owasp/zap2docker-bare:latest
```

# ZAP Docker 用户指南 - 如果您不熟悉 ZAP 的 docker 映像，这是一个很好的起点
- [ZAP Docker 用户指南](https://www.zaproxy.org/docs/docker/about/)

# [ZAP - 基线扫描](https://www.zaproxy.org/docs/docker/baseline-scan/)
ZAP 基线扫描是 ZAP Docker映像中可用的脚本。

它针对指定目标运行 ZAP 蜘蛛（默认情况下）1 分钟，然后等待被动扫描完成，然后再报告结果。

这意味着脚本不会执行任何实际的“攻击”，并且会运行相对较短的时间（最多几分钟）。

默认情况下，它将所有警报报告为警告，但您可以指定一个配置文件，该文件可以将任何规则更改为 FAIL 或 IGNORE。

该脚本旨在非常适合在 CI/CD 环境中运行，甚至针对生产站点。


# [ZAP - API 扫描](https://www.zaproxy.org/docs/docker/api-scan/)
ZAP API 扫描是 ZAP Docker映像中可用的脚本。

它经过调整，可通过本地文件或 URL 对 OpenAPI、SOAP 或 GraphQL 定义的 API 执行扫描。

它会导入您指定的定义，然后针对找到的 URL 运行主动扫描。Active Scan 已针对 API 进行了调整，因此它不会费心寻找 XSS 之类的东西。

它还包括 2 个脚本：
  对任何 HTTP 服务器错误响应代码发出警报
  对返回通常不与 API 关联的内容类型的任何 URL 发出警报

- [使用 ZAP 扫描 API](https://www.zaproxy.org/blog/2017-06-19-scanning-apis-with-zap/)
- [ZAP - API 扫描](https://www.zaproxy.org/docs/docker/api-scan/)


# [ZAP - 全扫描](https://www.zaproxy.org/docs/docker/full-scan/)
ZAP 完整扫描是 ZAP Docker映像中可用的脚本。

它针对指定的目标运行 ZAP 蜘蛛（默认情况下没有时间限制），然后是可选的 ajax 蜘蛛扫描，然后是完整的主动扫描，然后再报告结果。

这意味着脚本确实会执行实际的“攻击”，并且可能会运行很长时间。

默认情况下，它将所有警报报告为警告，但您可以指定一个配置文件，该文件可以将任何规则更改为 FAIL 或 IGNORE。该配置的工作方式与基线扫描非常相似，因此请参阅基线页面了解更多详细信息。


# zaproxy 扩展
- [zaproxy--wiki](https://github.com/zaproxy/zap-extensions/wiki)
- [开发扩展](https://github.com/zaproxy/zaproxy/wiki/DevExtending)



# 参考连接

- [ZAP Docker 文档](https://www.zaproxy.org/docs/docker/)
- [zap-api-python ](https://github.com/zaproxy/zap-api-python)

- [zap-extensions](https://github.com/zaproxy/zap-api-python)