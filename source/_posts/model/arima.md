---
title: ARIMA模型原理及实现
tags:
  - 金融模型
categories:
  - 金融模型 
date: 2020-07-15
---
# ARIMA模型原理及实现
## 导包
```python
import warnings
warnings.filterwarnings("ignore") # 不再显示warning

import pandas as pd
import matplotlib.pyplot as plt
# from matplotlib import qq
import datetime
import torch
import torch.nn as nn
import numpy as np
from torch.utils.data import Dataset, DataLoader
import os
os.chdir(os.getcwd())
plt.rcParams['font.sans-serif'] = ['SimHei'] # 处理中文显示问题
```

## 通过 baostock 包提供的接口获取训练数据集
```python
import baostock as bs
import pandas as pd

def getIndexDate(code:str,start_date:str,end_date:str):
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
        "Date,code,open,high,low,Close,volume",
        start_date, end_date, frequency="d")
    data_list = []
    while (rs.error_code == '0') & rs.next():
        data_list.append(rs.get_row_data())
    result = pd.DataFrame(data_list, columns=rs.fields)
    result.to_csv("%s.csv"%(code.replace(".","_")), index=False)
    bs.logout()
    
```
## 获取数据集
```python
getIndexDate(code='sz.399106',start_date='2014-01-01', end_date='2014-12-01')
```
## 处理
```python
import pandas as pd
import matplotlib.pyplot as plt
ChinaBank = pd.read_csv('sz_399106.csv',index_col = 'Date',parse_dates=['Date'])

ChinaBank.index = pd.to_datetime(ChinaBank.index)
sub = ChinaBank['2014-01':'2014-06']['Close']
train = sub.loc['2014-01':'2014-03']
test = sub.loc['2014-04':'2014-06']

plt.figure(figsize=(10,10))
plt.title('2014-01到2014-06 的收盘数据')
plt.plot(train)
plt.show()
```
![](/images/post/closeFigure.png)

## 差分处理
```python
ChinaBank['Close_diff_1'] = ChinaBank['Close'].diff(1)
ChinaBank['Close_diff_2'] = ChinaBank['Close_diff_1'].diff(1)
fig = plt.figure(figsize=(20,6))
ax1 = fig.add_subplot(131)
plt.title("原始数据")
ax1.plot(ChinaBank['Close'])

ax2 = fig.add_subplot(132)
ax2.plot(ChinaBank['Close_diff_1'])
plt.title("经过1阶差分处理")

ax3 = fig.add_subplot(133)
ax3.plot(ChinaBank['Close_diff_2'])
plt.title("经过2阶差分处理")

plt.show()
```
![](/images/post/diffDate.png)

## 计算: AIC  BIC 
```python
train_results = sm.tsa.arma_order_select_ic(train, ic=['aic', 'bic'], trend='nc', max_ar=4, max_ma=4)
print('AIC', train_results.aic_min_order)
print('BIC', train_results.bic_min_order)
```
### output
```
AIC (1, 0)
BIC (1, 0)
```

## 模型检验
```python
model = sm.tsa.ARIMA(train, order=(1, 0, 0))
results = model.fit()
resid = results.resid #赋值
fig = plt.figure(figsize=(12,8))
fig = sm.graphics.tsa.plot_acf(resid.values.squeeze(), lags=40)
plt.show()
```
![](/images/post/模型检验.png)

## 做D-W检验
```bash
德宾-沃森（Durbin-Watson）检验。
德宾-沃森检验,简称D-W检验，是目前检验自相关性最常用的方法，但它只使用于检验一阶自相关性。
因为自相关系数ρ的值介于-1和1之间，所以 0≤DW≤４。

DW＝O＝＞ρ＝１　　 即存在正自相关性 
DW＝４＜＝＞ρ＝－１　即存在负自相关性 
DW＝２＜＝＞ρ＝０　　即不存在（一阶）自相关性 
因此，当DW值显著的接近于O或４时，则存在自相关性，而接近于２时，则不存在（一阶）自相关性。
这样只要知道ＤＷ统计量的概率分布，在给定的显著水平下，根据临界值的位置就可以对原假设Ｈ０进行检验。
```
### input
```python
sm.stats.durbin_watson(results.resid.values)
```
### output
```
1.802970716007886
```

## 观察是否符合正态分布，QQ图
```bash
这里使用QQ图，它用于直观验证一组数据是否来自某个分布，
或者验证某两组数据是否来自同一（族）分布。
在教学和软件中常用的是检验数据是否来自于正态分布。
```
```python
from statsmodels.api import qqplot
resid = results.resid#残差
fig = plt.figure(figsize=(12,8))
ax = fig.add_subplot(111)
fig = qqplot(resid, line='q', ax=ax, fit=True)
```
![](/images/post/qqimg.png)

## Ljung-Box检验（白噪声检验）
```bash
Ljung-Box test是对randomness的检验,或者说是对时间序列是否存在滞后相关的一种统计检验。
对于滞后相关的检验，我们常常采用的方法还包括计算ACF和PCAF并观察其图像，
但是无论是ACF还是PACF都仅仅考虑是否存在某一特定滞后阶数的相关。
LB检验则是基于一系列滞后阶数，判断序列总体的相关性或者说随机性是否存在。 
时间序列中一个最基本的模型就是高斯白噪声序列。而对于ARIMA模型，其残差被假定为高斯白噪声序列，
所以当我们用ARIMA模型去拟合数据时，拟合后我们要对残差的估计序列进行LB检验，判断其是否是高斯白噪声，
如果不是，那么就说明ARIMA模型也许并不是一个适合样本的模型。
```
### input
```python
r,q,p = sm.tsa.acf(resid.values.squeeze(), qstat=True)
data = np.c_[range(1,41), r[1:], q, p]
table = pd.DataFrame(data, columns=['lag', "AC", "Q", "Prob(>Q)"])
table.plot()
plt.title("白噪声检验")
```

![](/images/post/白噪声检验.png)

### 结果分析:
```bash
    原假设为白噪声（相关系数为零）
    检验的结果就是看最后一列前十二行的检验概率（一般观察滞后1~12阶），
    如果检验概率小于给定的显著性水平，比如0.05、0.10等就拒绝原假设，即为非白噪声。
```

### 就结果来看:
```bash
    如果取显著性水平为0.05或者0.1，结果不小于显著性水平，那么相关系数与零没有显著差异，即为白噪声序列
```
## 模型预测
```
model = sm.tsa.ARIMA(sub, order=(1, 0, 0))
results = model.fit()
predict_sunspots = results.predict(start=str('2014-04'),end=str('2014-05'),dynamic=False)
fig, ax = plt.subplots(figsize=(12, 8))
ax = sub.plot(ax=ax)
predict_sunspots.plot(ax=ax)
plt.show()
```
![](/images/post/模型预测.png)