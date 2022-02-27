---
title:  pandas-分块创建
tags:
  - tookit
categories:
  - pandas
date: 2022-01-15 21:50:34
---

# pandas-分块创建

## 分块创建
```python
data=np.random.randint(0, 150, size=(4, 4))
index=['张三','李四','王五','赵六']
columns=['语文','数学','英语','python']
df=Dataframe(data=data, index=index, columns=columns)
df
```
## 字典创建
```python

```
## DataFrame属性
- values
- columns
- index
- shape

```python
data=np.random.randint(0, 150, size=(4, 4))
data=[[150,0],[150,0],[150,0],[300,0]]
index=['张三','李四','王五','赵六']
columns=['语文','数学','英语','python']
df=Dataframe(data=data, index=index, columns=columns)
df.values
df.columns
df.index
df.shape
```

## DataFrame 的索引
可以通过行找列也可以列找行
```python
# 显示写法
df.loc[]
# 隐式写法
df.iloc[]
# 添加以列
df['add行] = [121,122,3,34]
# 先列后行,不推荐使用链式索引
df['英语'].loc['李四']
df.loc['英语','李四']
# 先行后列,不推荐使用链式索引
df['李四'].loc['英语']
df.loc['李四','英语']
# 返回一个dataFrame 
df.loc[['语文'],['张三']]
```
## DataFrame 的切片 
```python
# 行切片
df["李四":"王五"]
# 列切片
df[['数学','英语','python']]
df.iloc[:,0:3]#df.iloc[行隐式索引,列隐式索引start:列隐式索引end]

```
## 总结
1,行索引用.loc,列素素引用中括号
2,对元素的素引，先素引行，再索引列。df.1oc[lindex,columns]
3,如果还想返回 Dataframe,那么使用两层中括号
注意：
	1,直接使用中括号的时候，如果是切片，那么是对行切片
	2,不要使用连式索引

## DataFrame的运算
注意：相互运算的DataFrame 行列索引都需要相同，否则会补齐为NaN
```
# 相加
df.add(df2,fill_value=True)
# DataFrame 与 Series相加
# 使用运算符式DataFrame的列索引和Series的索引进行比较
df.add(df2,axis=0)# 使用axis改变运算的方向
df.add(df2,axis=1)# 使用axis改变运算的方向
```
## 总结	
重归纳总结
1,Dataframe和单个数字运算,每个元素分别运算。
2,Dataframe和Dataframe运算,相同的行列索引进行运算,不同索引NaN
3,Dataframe和Series运算,使用运算符的时候,默认比较Dataframe的列素引和 Series的索引
4,如果想保留原始数据，或者改变运算的方向，使用 pandas封装的方法