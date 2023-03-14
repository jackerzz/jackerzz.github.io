---
title: ndarray的聚合
tags:
  - numpy
categories:
  - numpy
date: 2022-01-15 21:50:34
---

# ndarray的聚合
np.sum()
```
# axis=None 表示所有的维度都聚合成0维度
np.sum(axis=0) # axis=0表示对行聚合，行没了，列还在
np.sum(axis=1) # axis=0表示对列聚合，列没了，行还在
```
np.prod()
```
笛卡尔乘积
```
np.mean()
np.std()
np.var()
np.min()
np.max()
np.median()
np.argmin()
```
返回最小值的索引
```
np.argmax()
```
返回最大值的索引
```
np.percentile()
np.any()
np.all()
```python
any([1,2,3,4,5,[]])
all([1,2,3,4,5,[]])
```
np.dot()
```python
矩阵积
n = np.random.randint(0,100,size=(4,5))
n2 = np.random.randint(0,100,size=(4,4))
# 矩阵的积，矩阵的点乘.要求第一个矩阵的列数与第二个矩阵的行数相同才行
# 矩阵的积是有顺序的，不满足乘法的交换率
np.dot(n,n2)
```
np.power() 
# 广播机制
ndarray广播机制的条件
`当运算的ndarray的shape不一致的时候，numpy就会启动广播机制`
`目的就是为了让运算的两个ndarray的shape变成一样`
	为缺失的维度补1
	假定缺失元素用已有值填充



