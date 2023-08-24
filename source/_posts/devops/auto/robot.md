---
title: robot-robotframework
tags:
  - 自动化测试
categories:
  - 自动化测试 
date: 2022-07-30 22:30:34
---
## 依赖安装

```python
airtest==1.2.6
robotframework==5.0
robotframework-seleniumlibrary==5.1.3
selenium==3.141.0
```


# 进行测试

```python
# -*- coding:utf-8 -*-

__author__ = "zhouzhikai"

from robot.api import TestSuite
from robot.api import ResultWriter
from robot.model import keyword
from robot.api.deco import not_keyword,keyword
import sys
from robot.api import ExecutionResult, ResultVisitor


class ExecutionTimeChecker(ResultVisitor):
    '''
    对执行时间的控制
    '''

    def __init__(self, max_seconds):
        self.max_milliseconds = max_seconds * 1000

    def visit_test(self, test):
        if test.status == 'PASS' and test.elapsedtime > self.max_milliseconds:
            test.status = 'FAIL'
            test.message = 'Test execution took too long.'

# robot framwork 版本差别： https://github.com/robotframework/robotframework/issues/3868
# 百度搜索测试封装
class BaiduSearchTest:
    def __init__(self, name, librarys=["SeleniumLibrary"]):

        # 创建测试套件
        self.suite = TestSuite(name)

        # 导入支持库
        for lib in librarys:
            self.suite.resource.imports.library(lib)


    # 创建变量
    def create_variables(self):
        variables = {
            "${baidu}": "http://www.baidu.com",
            "${browser}": "Chrome",
            "${searchWord}": "搭建自动化测试平台",
            "${search_input}": "id=kw",
            "${search_btn}": "id=su"}

        for k, v in variables.items():
            self.suite.resource.variables.create(k, v)

    # 创建测试用例：启动浏览器
    def open_browsers(self):
        test_01 = self.suite.tests.create("启动浏览器")
        test_01.body.create_keyword("Open Browser", args=["${baidu}", "${browser}"])
        test_01.body.create_keyword("Title Should Be", args=["百度一下，你就知道"])

    # 创建测试用例：百度搜索测试
    def search_word(self):
        test_02 = self.suite.tests.create("百度搜索测试")
        test_02.body.create_keyword("Input Text", args=["${search_input}", "${searchWord}"])
        test_02.body.create_keyword("Click Button", args=["${search_btn}"])
        test_02.body.create_keyword("Sleep", args=["5s"])

    # 创建测试用例：断言验证搜索结果标题
    def assert_title(self):
        test_03 = self.suite.tests.create("断言验证搜索结果标题")
        test_03.body.create_keyword("Title Should Be", args=["百度搜索"])

    # 创建测试用例：关闭测试用例
    def close_browsers(self):
        test_04 = self.suite.tests.create("关闭浏览器")
        test_04.body.create_keyword("Close All Browsers")

    # 运行
    def run(self):
        self.create_variables()
        self.open_browsers()
        self.search_word()
        self.assert_title()
        self.close_browsers()

        # 运行套件
        result = self.suite.run(output="output.xml")
        # 生成日志、报告文件
        # ResultWriter(result).write_results(report="report.html", log="log.html")
        # 执行时间超时告警
        result.visit(ExecutionTimeChecker(float(10)))
        result.save()


if __name__ == "__main__":
    suite = BaiduSearchTest("百度搜索测试套件")
    suite.run()

```
