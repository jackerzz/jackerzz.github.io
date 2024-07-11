---
title: 常用的工具资源
tags:
  - 书签
categories:
  - 书签 
date: 2021-12-26
---
# 开发工具
- [code-server](https://github.com/coder/code-server)
- [coder-vscode](https://github.com/coder/coder)
- [EasySpider 数据采集](https://github.com/NaiboWang/EasySpider/tree/master)
# 协同工具资源
> 协同办公
- [drawio](https://github.com/jgraph/drawio-desktop/releases/tag/v19.0.3)

>`社会公共资源下载站点`
- [pdfdrive](https://www.pdfdrive.com/)
- [libgen](http://libgen.rs/)
- [z-lib](https://z-lib.org/)

> `其他`
- [ping检测](http://ping.chinaz.com/)
- [临时邮箱](https://www.linshiyouxiang.net/)
- [大文件临时分享,非百度云](https://www.wenshushu.cn/)
- [在线工具](https://tool.lu/)


- [大数据导航](http://hao.bigdata.ren/)


- [Google SEO教程](https://blog.naibabiji.com/google-seo)

- [东方财富数据中心](http://data.eastmoney.com/cjsj/xfp.html)

- [消除图片背景工具](https://www.remove.bg/zh)

- [艺术字体生成](https://patorjk.com/software/taag/#p=testall&h=0&v=0&f=Graffiti&t=python)

- [免费域名获取](https://www.freenom.com/zh/index.html?lang=zh)

- [whois 检测](https://whois.freenom.com/en/whois.html)

- [pixabay 图片](https://pixabay.com/zh/images/search/)

- [yak-网络安全](https://yaklang.com/team/)

- [WordPress一键脚本](https://github.com/atrandys/wordpress)

- [一款支持 PDF 手写注释的笔记软件，支持 Linux、Windows、macOS 平台。看书的时候喜欢标注、做笔记，那这款工具肯定适合你](https://github.com/xournalpp/xournalpp)
- [Pentest-Docker 基于CasaOS容器云构建的渗透测试平台 ](https://github.com/arch3rPro/Pentest-Docker)
- [Rocket.Chat 私有化研发沟通平台](https://github.com/RocketChat/Rocket.Chat)
- [metasploit-framework 渗透测试框架](https://github.com/rapid7/metasploit-framework)
- [uptime-kuma docker 服务自动化监控](https://github.com/louislam/uptime-kuma)
- [基于Playwright的网页异常比对工具 ](https://github.com/dgtlmoon/changedetection.io)
- [hackingtool 红黑网络渗透工具](https://github.com/Z4nzu/hackingtool)
- [didi 开源sharingan 流量回放工具](https://github.com/didi/sharingan)
- [akshare](https://akshare.xyz/data/fund/fund_public.html#id28)
- [streamsync lowcode](https://github.com/streamsync-cloud/streamsync)
- [nightingale 夜莺监控](https://github.com/ccfos/nightingale)
- [wekan 研发看板](https://github.com/wekan/wekan)
- [plane 研发看板](https://github.com/makeplane/plane/tree/master)
- [plane-mobile 研发看板app端](https://github.com/makeplane/plane-mobile)
## 工具脚本
- [Pake](https://github.com/tw93/Pake)
- [QtScrcpy](https://github.com/barry-ran/QtScrcpy)

## 接口性能分析
### java 性能分析
- [`arthas 在线练习-使浏览器获取平台token`](https://killercoda.com/explore?search=arthas&type=profile)
- [`arthas 在线练习-中文化环境`](https://arthas.aliyun.com/doc/arthas-tutorials.html?language=cn&id=command-reset)
- [arthas](https://arthas.aliyun.com/doc/quick-start.html)
`Arthas 是一款线上监控诊断产品，通过全局视角实时查看应用 load、内存、gc、线程的状态信息，并能在不修改应用代码的情况下，对业务问题进行诊断，包括查看方法调用的出入参、异常，监测方法执行耗时，类加载信息等，大大提升线上问题排查效率。`
1. 启动 math-game
- math-game是一个简单的程序，每隔一秒生成一个随机数，再执行质因数分解，并打印出分解结果。
- [arthas-github](https://github.com/alibaba/arthas)
```bash
curl -O https://arthas.aliyun.com/math-game.jar
java -jar math-game.jar
```

### python 性能分析
#### [PySnooper](https://github.com/cool-RR/PySnooper)
- [memory_profiler](https://github.com/pythonprofilers/memory_profiler)
- [vprof](https://github.com/nvdv/vprof)

##### flask 案例
```python
from flask import Flask
import pysnooper

app = Flask(__name__)

@app.route('/double', methods=['POST']) 
@pysnooper.snoop()
def double_numbers():
    numbers = request.json['numbers']
    doubled_numbers = []

    for num in numbers:
        doubled_num = num * 2 
        doubled_numbers.append(doubled_num)

    return jsonify(doubled_numbers)
```
- 接口测试
```bash
curl -X POST -H "Content-Type: application/json" -d '{"numbers":[1,2,3]}' http://localhost:5000/double
```
- 结果
```bash
Starting var:.. numbers = [1, 2, 3] 
15:42:04.345209 call         8 @app.route('/double', methods=['POST'])
15:42:04.345385 line         9 @pysnooper.snoop()
15:42:04.345441 line        10 def double_numbers():
15:42:04.345500 line        11     numbers = request.json['numbers']
15:42:04.345543 line        12     doubled_numbers = []
New var:....... doubled_numbers = []
15:42:04.345595 line        14     for num in numbers:
Starting var:.. num = 1
# 省略部分输出
Ending var:.... doubled_numbers = [2, 4, 6]
15:42:04.345963 return      17     return jsonify(doubled_numbers)
```


