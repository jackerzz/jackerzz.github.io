---
title: ui自动化测试2
tags:
  - 自动化测试
categories:
  - 自动化测试 
date: 2022-07-23 22:30:34
---


# 资源来源地址	

[chromedriver](https://chromedriver.storage.googleapis.com/index.html?path=103.0.5060.53/)
[geckodriver 火狐](https://github.com/mozilla/geckodriver/releases)
[无界面浏览器  phantomjs](https://phantomjs.org/download.html)
[Airtest的图像脚本介绍](https://airtest.doc.io.netease.com/IDEdocs/airtest_framework/3_airtest_image/)

# pynput 控制鼠标键盘动作

- [pynput-github](https://github.com/moses-palmer/pynput)
- [pynput-docs](https://pynput.readthedocs.io/en/latest/)
- [pynput-操作系统限制](https://pynput.readthedocs.io/en/latest/limitations.html#linux)
- [pynput-使用示例](https://blog.csdn.net/weixin_42750611/article/details/123341340)

# cv2使用方式

- [OpenCV图像处理](https://www.heywhale.com/mw/project/616e1e9b1e11c300178e0d42)

# 滚动条操作

- [scrollTo(0,100000)](https://www.runoob.com/try/try.php?filename=try_dom_window_scrollto)
- [selenium 控制内嵌table滚动条的方法](https://blog.csdn.net/nicole415/article/details/122237908)

# robotframework

- [robotframework——命令行运行测试脚本](https://blog.csdn.net/sun_977759/article/details/107983972)
- [argument-files](http://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#argument-files)
- [Python-Pandas之两个Dataframe的差异比较](https://blog.csdn.net/sinat_28371057/article/details/114829201)
- [Python-Pandas之两个Dataframe的差异比较2](https://www.geeksforgeeks.org/compare-pandas-dataframes-using-datacompy/)
- [selenium-grid-implementation-with-robot-framework](https://stackoverflow.com/questions/37035047/selenium-grid-implementation-with-robot-framework)
- [jinja2快速实现自定义的robotframework的测试报告 ](https://www.cnblogs.com/fulu/p/13625585.html)

## robotframework python 代码启动

```python
#!/usr/bin/env python
import sys
from robot import run_cli, rebot_cli

common = ['--log', 'none', '--report', 'none'] + sys.argv[1:] + ['login']
run_cli(['--name', 'Firefox', '--variable', 'BROWSER:Firefox', '--output', 'out/fx.xml'] + common, exit=False)
run_cli(['--name', 'IE', '--variable', 'BROWSER:IE', '--output', 'out/ie.xml'] + common, exit=False)
rebot_cli(['--name', 'Login', '--outputdir', 'out', 'out/fx.xml', 'out/ie.xml'])
```

# pip 源地址设置

pip config set global.index-url https://mirrors.ustc.edu.cn/pypi/web/simple
pip config set global.index-url https://pypi.douban.com/simple/


