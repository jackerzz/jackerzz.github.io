---
title: numpy
tags:
  - analysisTool
categories:
  - python
date: 2022-01-15 21:50:34
---

# numpy
- ndarray 数据
	用来表示矩阵，并非数学意义矩阵
	默认所有的元素类型必须相同
	
- display()
	用来展示数据
	
## 常用方法
np.ones(shape, dtype=None, order="C") 
```python
#全是1的ndarray
np.ones(shape=(2,3),dtype=np.float32)

```

np.zeros(shape, dtype=None, order="C")
```python
#全是0的ndarray
np.zeros(shape=(2,3),dtype=np.float32)
```

np.full(shape, fill_value, dtype=None, order="C")
```python
#使用指定的指去填充ndarray
np.full(shape=(2,3),fill_value=23,dtype=np.float32)
```

np.eye(N, M=None, k=0, dtype=float)
```python
#产生对角线上为1其他位置为0 ndarray，是单位矩阵
#k:以0 为分割，对角线-1左下，1右上
np.eye(5, 6,k=1)
```

np.linspace(start, stop, num=50, endpoint=True, retstep=False, dtype=None) 
```python
# 把一个范围的线段等分为n分
# endpoint=False 不显示
# retstep=True 现实等分的间距
np.linspace(0，100，num=200,endpoint=False)#0d到100 分为200分
```

np.arange((start, ]stop, [step,]dtype=None)
```python
# 与range一样，区别步长不支持小数且出来的数据是不连续的
np.arange(0，100,2)
```

np.random.randint(ow, high=None, size=None, dtype="I")
```python
# 生产随机矩阵
np.random.randint(0,200,size=(2,3,5))
```
np.random.randn(d0, d1,..., dn) 
```python
#标准正太分布
#平均值为0，方差为1的正太分布为正太分布
np.random.randn(2,3,4)
```
np.random.random(size=None)
```
#生产0到1的随机数，左闭右开
np.random.random(size=(10,20,3))
```
np.random.normal(loc=0.0, scale=1.0,size=None)
```python
#正太分布（高斯分布）
#loc 平均值
#scale 方程
np.random.normal(loc=10,scale=3,size=(1000,3))
np.random.normal(loc=10,scale=3,size=(1000,3)).mean()
np.random.normal(loc=10,scale=3,size=(1000,3)).std()
```
np.random.rand(d0, dl,...,dn）
```
#生产0到1的随机数，左闭右开
np.random.random(10,20,3)
```
## ndarray 的属性
- ndim:维度
- shape:形状(各维度的长度)
- size:总长度
- dtype:元素类型
## ndarray 的操作类型

### 1.索引
一维与列表一致，多为同理
```python
n = np.random.randint(0,100,size=(3,4,3))
#多维处理,中的“,”用来分割维度
n[1,2,3]
```
### 2.切片
一维与列表一致，多为同理
```python
n = np.random.randint(0,100,size=(3,4,3))
#多维处理,中的“,”用来分割维度
n[1:3,3]
```
### 3.变形
使用reshape函数，注意参数是一个元组
```python
n = np.random.randint(0,100,size=(4,5))
#要求总数一致，即size一致
np.reshape(4,5) 
```
### 4.级联
1.np.concatenate() 级联需要注意 ':'
	级联的参数必须是list,一定要加中括号或小括号
	维度必须相同
	形状相符
	**级联的方向默认是shape这个tuple的第一个值所代表的维度方向
	可以通过axis 参数改变级联的方向
```python
n = np.random.randint(0,100,size=(4,5))
n2 = np.random.randint(0,100,size=(6,5))
# 垂直级联
# 要求列数一致
# axis:轴，axis=0默认垂直
np.concatenate((n1,n2),axis=0)
# 水平级联
# 要求行数一致
n = np.random.randint(0,100,size=(4,5))
n2 = np.random.randint(0,100,size=(4,4))
np.concatenate((n1,n2),axis=1)
```
2.np.hstack()与np.vstack()
	水平级联与垂直级联，处理自己，进行维度变更
```python
# 垂直级联
# 要求列数一致
n = np.random.randint(0,100,size=(4,5))
n2 = np.random.randint(0,100,size=(6,5))
np.vstack(n,n2)
# 水平级联
# 要求行数一致
n = np.random.randint(0,100,size=(4,5))
n2 = np.random.randint(0,100,size=(4,4))
np.hstack(n,n2)
```

### 5.ndarray 的排序
[十大经典排序算法（动图演示）](https://www.cnblogs.com/onepixel/articles/7674659.html)
1.快速排序
	np.sort()与ndarray.sort()都可以
	np.sort()不改变输入
	ndarray.sort() 本地处理，不占用控件但改变输入

