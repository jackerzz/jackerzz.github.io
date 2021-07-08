---
title: 描述性统计简明
tags:
  - 统计学
categories:
  - 统计学 
date: 2021-03-04
---

## 数据的位置
用来度量数据中心位置的指标
- 平均数(sample mean)
- 几何平均数(GEOMETRIC mean)
- 中位数(Median)
- 众数(Mode)
- 百分位数(Percentile)

### 示例
```python
import os
os.chdir(os.getcwd())
import pandas as pd
import matplotlib.pyplot as plt

import baostock as bs

def getIndexDate(code:str,start_date:str,end_date:str):
    '''
      下载数据集
    '''
    # 登陆系统
    lg = bs.login()
    # 获取指数(综合指数、规模指数、一级行业指数、二级行业指数、策略指数、成长指数、价值指数、主题指数)K线数据
    # 综合指数，例如：sh.000001 上证指数，sz.399106 深证综指 等；
    # 规模指数，例如：sh.000016 上证50，sh.000300 沪深300，sh.000905 中证500，sz.399001 深证成指等；
    # 一级行业指数，例如：sh.000037 上证医药，sz.399433 国证交运 等；
    # 二级行业指数，例如：sh.000952 300地产，sz.399951 300银行 等；
    # 策略指数，例如：sh.000050 50等权，sh.000982 500等权 等；
    # 成长指数，例如：sz.399376 小盘成长 等；
    # 价值指数，例如：sh.000029 180价值 等；
    # 主题指数，例如：sh.000015 红利指数，sh.000063 上证周期 等；

    # 详细指标参数，参见“历史行情指标参数”章节；“周月线”参数与“日线”参数不同。
    # 周月线指标：date,code,open,high,low,close,volume,amount,adjustflag,turn,pctChg
    rs = bs.query_history_k_data_plus(code,
        "date,code,open,high,low,close,preclose,volume,amount,pctChg",
        start_date, end_date, frequency="d")
    data_list = []
    while (rs.error_code == '0') & rs.next():
        data_list.append(rs.get_row_data())
    result = pd.DataFrame(data_list, columns=rs.fields)
    result.to_csv("%s.csv"%(code.replace(".","_")), index=False)
    bs.logout()

getIndexDate(code='sz.399376',start_date='2018-01-01', end_date='2021-06-10')
returns = pd.read_csv('sz_399376.csv')
```

### 画出 sz.399376 股票的收盘价直方图
```python
returns.close.hist()
```
![](/images/post/closeHist.png)

```python
returns.close.mean()
'''
4937.431747784431
'''
returns.close.median()
'''
4884.9446
'''
returns.close.mode()
'''
0      3442.2600
1      3525.6160
2      3540.0160
3      3551.7090
4      3574.8730
         ...    
830    6320.3282
831    6342.6444
832    6346.6771
833    6365.1933
834    6388.9117
Length: 835, dtype: float64
'''
[returns.close.quantile(i) for i in [0.25,0.65]]
'''
[4315.082, 5464.19337]
'''
```

## 数据的离散度
- 极差(range)
```python
returns.close.max() - returns.close.min()
```
- 平均绝对偏差(Mean Absolute Deviation)
```python
returns.close.mad
```
  - 数据的离散程度可以通过一组数据与均值的偏差来度量,
  - 假设一个数据与均值的差越大,则说明数据的值偏离均值越远
  - 所有数据与均值的差值和为0

- 方差(Variance)
```python
returns.close.var()
```
- 标准差(Standard Deviation)
```python
returns.close.std()
```
## 二项分布
>常用于描述金融市场中只有两个结果之间重复事件

## 正态分布
>在金融学研究中,收益率等变量的分布常常假定为正太分布或者对数正态分布,由于正态分布的概率密度曲线呈钟形,人们常称正态分布曲线为钟形曲线

>VaR(Value at Risk)指在一定概率水平(@%)下,某一金融资产或者金融资产组合在未来特定一段时间内的最大可能损失

## 其他连续分布
>卡方分布
>>[抽样分布：卡方分布](https://www.afenxi.com/26465.html)
>>[非参数方法：卡方检验的运用](https://www.afenxi.com/25469.html)
>>[多项分布的卡方检验](https://www.afenxi.com/25471.html)
>>[泊松分布的卡方分布](https://www.afenxi.com/25476.html)
>>[正态分布的卡方检验](https://www.afenxi.com/26747.html)
>>[一致性的卡方检验](https://www.afenxi.com/26744.html)

>t分布
>>[抽样分布：t分布](https://www.afenxi.com/26408.html)

>F分布
>>[追本溯源F分布](https://www.afenxi.com/25457.html)


## 变量的关系
>变量的特性
>>独立性
>>相关性




