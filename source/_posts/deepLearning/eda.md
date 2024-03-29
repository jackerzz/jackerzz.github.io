---
title:  数据探索EDA
tags:
  - deepLearning
categories:
  - eda 
date: 2023-04-13
---

# 简介
我将向您展示四个最好的Python包，它们可以自动化您的数据探索和分析。我将详细介绍每一个，它的作用以及如何使用它。

# 工具介绍
## DataPrep
- python中的开源低代码数据准备库。用几行代码在python中收集、清理和可视化您的数据。
### 安装
```bash
pip install dataprep
pip install  connectorx 
```
#### connectorx
- [connectorx](https://github.com/sfu-db/connector-x#supported-sources--destinations)

- 单数据库
```python
import connectorx as cx

cx.read_sql("postgresql://username:password@server:port/database", "SELECT * FROM lineitem")
```
- 分区加载
```python
import connectorx as cx

cx.read_sql("postgresql://username:password@server:port/database", "SELECT * FROM lineitem", partition_on="l_orderkey", partition_num=10)
```
- 多数据库
```
import connectorx as cx

db1 = "postgresql://username1:password1@server1:port1/database1"
db2 = "postgresql://username2:password2@server2:port2/database2"

cx.read_sql({"db1": db1, "db2": db2}, "SELECT * FROM db1.nation n, db2.region r where n.n_regionkey = r.r_regionkey")
```

## Pandas Profiling
- 从Panda DataFrame对象创建HTML分析报告

### 安装
```bash
pip install ydata-profiling
```

## SweetViz
- 可视化和比较数据集,价值观和目标

### 安装
```bash
pip install sweetviz
```

### 使用案例
- [Sweetviz：Python中的自动化EDA](https://towardsdatascience.com/sweetviz-automated-eda-in-python-a97e4cabacde)

## AutoViz
- 用一行代码自动可视化任何大小的数据集。由Ram Seshadri创建。欢迎合作者。根据请求授予的权限。

### 安装
```bash
pip install autoviz
```

# 参考资料
- [DataPrep](https://github.com/sfu-db/dataprep)
- [Pandas Profiling](https://github.com/ydataai/ydata-profiling)
- [SweetViz](https://github.com/fbdesignpro/sweetviz)
- [AutoViz](https://github.com/AutoViML/AutoViz)
- [EDA-python](https://builtin.com/data-science/EDA-python)
- [【Python】比较字符串相似度](https://www.cnblogs.com/hforevery0/p/14375286.html)