---
title: 容器化运行-自动化脚本
tags:
  - auto
categories:
  - 自动化测试 
date: 2023-08-12 22:30:34
---

# 参数
shm-size="2g" - 设置共享内存的大小为2GB,保证有足够的内存用于浏览器的缓存等

SE_SCREEN_WIDTH - 设置屏幕的分辨率宽度

SE_SCREEN_HEIGHT - 设置屏幕的分辨率高度

SE_SCREEN_DEPTH - 设置屏幕颜色深度,比如24表示 True color

SE_SCREEN_DPI - 设置屏幕的DPI,影响页面渲染的缩放比例

LANG_WHICH - 设置语言的类型,en表示英语

LANG_WHERE - 设置语言的地区,US表示美国英语

SE_START_XVFB - 启动一个虚拟的 framebuffer,用于无头浏览器

SE_START_VNC - 启动一个 VNC 服务,可以通过VNC连接访问浏览器

SE_START_NO_VNC - 启动 noVNC 网页服务,通过网页可以访问浏览器

SE_NO_VNC_PORT - 设置 noVNC 网页服务的端口号

SE_VNC_PORT - 设置 VNC 服务的端口号

DISPLAY - 设置要使用的显示器编号,用于 Xvfb

CONFIG_FILE - Selenium 配置文件路径

GENERATE_CONFIG - 是否生成默认的配置文件
## config
```ini
shm-size="2g"
SE_SCREEN_WIDTH=1920
SE_SCREEN_HEIGHT=1080 
SE_SCREEN_DEPTH=24
SE_SCREEN_DPI=100
; LANG_WHICH=en
; LANG_WHERE=US
LANG_WHICH=zh
LANG_WHERE=CN
SE_START_XVFB=true
SE_START_VNC=true
SE_START_NO_VNC=true
SE_NO_VNC_PORT=7900
SE_VNC_PORT=5900
DISPLAY=:99.0
DISPLAY_NUM=99
CONFIG_FILE=/opt/selenium/config.toml
GENERATE_CONFIG=true
SE_DRAIN_AFTER_SESSION_COUNT=0
SE_NODE_MAX_SESSIONS=1
SE_NODE_SESSION_TIMEOUT=300
SE_NODE_OVERRIDE_MAX_SESSIONS=false
DBUS_SESSION_BUS_ADDRESS=/dev/null
```
# 部署容器
```bash
docker run -d  --shm-size="2g" -e SE_SCREEN_WIDTH=1920 -e SE_SCREEN_HEIGHT=1080 -e SE_SCREEN_DEPTH=24 -e SE_SCREEN_DPI=100  -p 8889:8090 -p 7901:7900 erlancode/selenium:v5
```

# 单独运行脚本
```bash
python3 -m robot.run --suite testsuite.test_wms_finished_goods_warehousing .
```

