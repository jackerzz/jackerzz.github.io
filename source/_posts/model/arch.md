---
title: ARCH 和 GARCH 模型
tags:
  - 金融模型
categories:
  - 金融模型 
date: 2020-07-15
---

## 介绍
>对于收益率序列的波动建模预测

1. 一组时间序列本身可能只有非常微弱的自相关性,而这组时间序列的函数(eg: 取平方,绝对值) 呈现很强的自相关性
2. 有些资产收益率序列的条件方差会随着时间发生改变(条件异方差的特征),
3. 资产收益率序列的波动会有持续的现象(波动聚集现象),即: 大波动跟着大波动,小波动伴随着小波动
4. 具有厚尾现象,即：不服从正态分布,其极端值较多


## 建模流程
1. 先检验收益率序列{y^t}是否为平稳时间序列,并根据其相关性建立适合的均值方差,描述收益率的yt 如何演进

2. 对拟合的均值方程得到的残差序列{^yt}进行ARCH效应检验。
>用Ljung-Box 检验残差平方序列的自相关性,即将序列的平方值作为波动率的代理变量，弱残差序列有自相关性,则说明当期波动与过去期波动有关,初步判别有ARCH效应
>>Langrange Multiplier 检验(LM检验)。

3. 设定一个波动率模型试图刻画这种波动率的动态变化

4. 对均值方程和波动率方程进行联合估计,

5. 检验所拟合的模型,并再必要时进行改进
