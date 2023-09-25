---
title: app-自动化测试
tags:
  - 自动化测试
categories:
  - 自动化测试 
date: 2022-07-25 22:30:34
---

# 参考资料
- [Android-uiautomator2-web-editor](https://github.com/alibaba/web-editor)
- [使用facebook-wda进行iOS APP自动化测试](https://blog.csdn.net/u010698107/article/details/120396046)
- [tabulate-Python 中的漂亮打印表格数据、一个库和一个命令行实用程序](https://pypi.org/project/tabulate/)
- [retry-重试装饰器](https://pypi.org/project/retry/)
- [logzero- Python 日志记录变得简单](https://logzero.readthedocs.io/en/latest/)
- [taobao-iphone-device-该工具能够用于与iOS设备进行通信, 提供以下功能](https://github.com/alibaba/taobao-iphone-device)
- [uiautomator2-](https://github.com/openatx/uiautomator2)
- [uiautomator](https://github.com/xiaocong/uiautomator)
- [android-emulator-m1-preview](https://github.com/google/android-emulator-m1-preview)
- [aritet-Poco](https://github.com/AirtestProject/Poco)
# taobao-iphone-device
```
该工具能够用于与iOS设备进行通信, 提供以下功能

截图
获取手机信息
ipa包的安装和卸载
根据bundleID 启动和停止应用
列出安装应用信息
模拟Xcode运行XCTest，常用的如启动WebDriverAgent测试（此方法不依赖xcodebuild)
获取指定应用性能(CPU,MEM,FPS)
获取指定应用功耗(CPU,GPU,network,display,location)
文件操作
Crash日志操作
其他
```

# Python+selenium点击网页上指定坐标
```python
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains

def click_locxy(dr, x, y, left_click=True):
    '''
    dr:浏览器
    x:页面x坐标
    y:页面y坐标
    left_click:True为鼠标左键点击，否则为右键点击
    '''
    if left_click:
        ActionChains(dr).move_by_offset(x, y).click().perform()
    else:
        ActionChains(dr).move_by_offset(x, y).context_click().perform()
    ActionChains(dr).move_by_offset(-x, -y).perform()  # 将鼠标位置恢复到移动前

if __name__ == "__main__":
    dr = webdriver.Chrome()
    dr.get('http://www.baidu.com')
    click_locxy(dr, 100, 0) # 左键点击
    click_locxy(dr, 100, 100, left_click=False) # 右键点击

```
# 环境搭建
- [下载APK并手动安装](https://github.com/jiankehtt/uiautomator/tree/master/uiautomator/libs)
- [uiautomator环境搭建所遇问题汇总](https://www.cnblogs.com/xmmc/p/8849249.html)