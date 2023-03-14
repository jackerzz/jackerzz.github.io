---
title: Android-容器化
tags:
  - auto
categories:
  - 自动化测试 
date: 2022-07-25 22:30:34
---

# 安卓模拟器容器化



# 安卓集成到cicd 中实现devops 能效优化---轻量级
- [AndroidSDK-使用](https://andresand.medium.com/android-emulator-on-docker-container-f20c49b129ef)
- [Android Meets Docker](https://www.youtube.com/watch?v=YwBAqMDYFCU)
- [AndroidSDK](https://github.com/thyrlian/AndroidSDK)

# 安卓集成到cicd---比较重
- [docker-android](https://github.com/budtmo/docker-android/blob/master/README_APPIUM_AND_SELENIUM.md)
- [android-emulator-container-scripts](https://github.com/google/android-emulator-container-scripts)
- [docker android 模拟器](https://www.jianshu.com/p/3729d983ffb3)
- [知乎搭建](https://zhuanlan.zhihu.com/p/50683232)

# 控制连接到主机的安卓（模拟器或真实设备）
``` s
docker run --privileged -d -p 6080:6080 -p 5554:5554 -p 5555:5555 -p 4723:4723 --name android-container-appium budtmo/docker-android-real-device
```

1. 打开 noVNC http://localhost:6080

2. 通过在noVNC窗口上单击右键打开终端>>终端仿真器

3. 连接到主机的 adb（确保您的主机有 adb 并连接到设备。）

```s
adb -H host.docker.internal devices
```

要指定端口，只需添加-P port_number

```s
adb -H host.docker.internal -P 5037 devices
```

现在您的容器可以访问您的主机设备。但是，您需要添加remoteAdbHost所需adbPort的功能才能使Appium能够识别这些设备。



# 参考资料
- [uiautomator2](https://github.com/openatx/uiautomator2)
- [app-web-editor](https://github.com/alibaba/web-editor/blob/master/README_ZH.md)
- [app-airtest](https://airtest.netease.com/)
- [App 测试工具大全](http://testingpai.com/article/1604021306809)
