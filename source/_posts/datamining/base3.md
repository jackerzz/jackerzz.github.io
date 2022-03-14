---
title: 数据探索
tags:
  - analysisTool
categories:
  - python 
date: 2021-07-29 21:30:34
---

# 数据探索
- 考虑的问题
`样本数据集的数量和质量是否满足模型构建的要求`
`有没有出现从未设想过的数据状态`
`其中有没有明显的规律和趋势`
`各因素之间有什么样的关联性`

## 数据质量分析 
### 脏数据
- 定义
`缺失值` `异常值` `不一致的值` `重复数据` `特殊符号($^&$)`
- 产生原因
    - `信息获取难度大` 
    - `信息遗漏` 
    - `属性值不存在`
- 影响
    - `数据挖掘建模将丢失大量的有用信息` 
    - `数据挖掘模型所表现出的不确定性更加显著，模型中蕴含的规律更难把握` 
    - `包含空值的数据会使建模过程陷入混乱，导致不可靠的输出`
- 如何分析
    - `对缺失属性进行统计` 
        - `缺失数` `缺失率` `未缺失数`
    - `缺失值的处理` 
        - `删除存在缺失值的记录` `可能值进行插补和不处理`

### 异常值分析
- [描述性统计](https://wiki.mbalib.com/wiki/%E6%8F%8F%E8%BF%B0%E6%80%A7%E6%8C%87%E6%A0%87)
- [3σ原则](https://wiki.mbalib.com/wiki/%E4%B8%89%E8%A5%BF%E6%A0%BC%E7%8E%9B%E5%87%86%E5%88%99)
- [箱线图](https://wiki.mbalib.com/wiki/%E7%AE%B1%E7%BA%BF%E5%9B%BE)

## 基于函数工具探索

[pandas数据分析中文](https://www.bookstack.cn/read/PandasCookbook/README.md)


### `corr`

```python
import pandas as pd
D = pd.DataFrame([range(1, 8), range(2, 9)])        # 生成样本D，一行为1～7，一行为2～8
print(D.corr(method='spearman'))                    # 计算相关系数矩阵
S1 = D.loc[0]                                       # 提取第一行
S2 = D.loc[1]                                       # 提取第二行
print(S1.corr(S2, method='pearson'))                # 计算S1、S2的相关系数
```

### `cov`

```python
import numpy as np
D = pd.DataFrame(np.random.randn(6, 5))          # 产生6×5随机矩阵
print(D.cov())                                   # 计算协方差矩阵
print(D[0].cov(D[1]))                            # 计算第一列和第二列的协方差
```

### `skew/kurt`

```python
import numpy as np
D = pd.DataFrame(np.random.randn(100, 233))          # 产生6×5随机矩阵
print(D.skew())                                  # 计算偏度
print(D.kurt())                                  # 计算峰度
```

### `describe`

```python
import numpy as np
D = pd.DataFrame(np.random.randn(6, 5))        # 产生6×5随机矩阵
print(D.describe())
```

## 拓展统计特征函数

### pandas累积计算统计特征函数
包名称 | 功能描述
-------- | ----- 
[pandas.DataFrame.cumsum](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.cumsum.html) | 返回包含累积总和的相同大小的DataFrame或Series
[pandas.DataFrame.describe](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html) | 返回包生成描述性统计数据
[pandas.DataFrame.cumprod](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.cumprod.html) | 返回 返回DataFrame或Series轴上的累积乘积
[pandas.DataFrame.cummin](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.cummin.html) | 返回包含返回 DataFrame或Series轴上的累积最小值
[pandas.DataFrame.cummax](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.cummax.html) | 返回包含返回DataFrame或Series轴上的累积最大值。

## 详细的参考官方
[https://pandas.pydata.org/docs/reference/](https://pandas.pydata.org/docs/reference/)
[https://matplotlib.org/stable/api/index.html](https://matplotlib.org/stable/api/index.html)