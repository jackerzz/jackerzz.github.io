---
title: 均线策略
tags:
  - 均线策略
  - pandas
  - matplotlib
categories:
  - 金融模型 
date: 2020-07-15
---
# 均线策略

### 导包及加载工具函数
```python
import os
os.chdir(os.getcwd())
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['SimHei'] 

def smaCal(tsPrice,k):
    '''
        计算简单移动平均
        均线的时间跨度很重要
    '''
    Sma=pd.Series(0.0,index=tsPrice.index)
    for i in range(k-1,len(tsPrice)):
        Sma[i]=sum(tsPrice[(i-k+1):(i+1)])/k
    return(Sma)

def wmaCal(tsPrice,weight):
    '''
        计算加权移动平均
    '''
    
    k=len(weight)
    arrWeight=np.array(weight)
    Wma=pd.Series(0.0,index=tsPrice.index)
    for i in range(k-1,len(tsPrice.index)):
        Wma[i]=sum(arrWeight*tsPrice[(i-k+1):(i+1)])
    return(Wma)

def ewmaCal(tsprice,period=5,exponential=0.2):
    '''
        计算指数加权移动平均
    '''
    Ewma=pd.Series(0.0,index=tsprice.index)
    Ewma[period-1]=np.mean(tsprice[0:period])
    for i in range(period,len(tsprice)):
        Ewma[i]=exponential*tsprice[i]+(1-exponential)*Ewma[i-1]
    return(Ewma)
```
### 加载数据
```python
sh000952 = pd.read_csv('sh000952.csv',index_col='date')
sh000952.index.name = 'Date'
sh000952.index = pd.to_datetime(sh000952.index,format='%Y-%m-%d')
sh000952 = sh000952.iloc[:,2:]
sh000952Close = sh000952.close
sh000952Close = sh000952Close['2020']
```

### 价格均线
```python
# 计算 code = sh000952 的90天 简单移动平均
Sma90 = smaCal(sh000952Close,90)
# 计算 code = sh000952 的90天 加权移动平均
weight = np.array(range(1,91))/sum(range(1,91))
Wma90 = wmaCal(sh000952Close,weight)

# 计算 code = sh000952 的90天 指数加权移动平均
expo= 2/(len(sh000952Close)+1)
Ema90=ewmaCal(sh000952Close,90,expo)
plt.plot(sh000952Close[90:],label="Close",color='k')
plt.plot(Sma90[90:],label="Sma90",color='r',linestyle='dashed')
plt.plot(Wma90[90:],label="Wma90",color='b',linestyle=':')
plt.plot(Ema90[90:],label="Ema90",color='g',linestyle='-.')
plt.title("股票sh000952的90天 价格均线")
plt.legend()
```
![](/images/post/jiangejunxian.png)

### 股票价格的长短期均线
```python
Sma5 = smaCal(sh000952Close,5)
Sma30 = smaCal(sh000952Close,30)
plt.plot(sh000952Close[30:],label='close',color='k')
plt.plot(Sma5[30:],label='Sam5',color='b',linestyle='dashed')
plt.plot(Sma30[30:],label='Sma30',color='r',linestyle=':')
plt.title("股票sh000952 股票价格的长短期均线")
plt.legend()
```

![](/images/post/loangsort.png)
