---
title:  pandas-索引
tags:
  - pandas
categories:
  - pandas
date: 2022-01-15 21:50:34
---
# pandas

## 索引
1.显示索引
```python
df = pd.Series(data=[150,150,150,300],index=["语文","数学","英语","理综"])
#切片是左闭右闭的
#索引: 数学 150
#切片: 语文 150 数学 150 英语 150
df.loc[['数学']] # 在套一层中括号，返回原来的数据类型
df.loc['语文':'英语']

```

2.隐示索引
```python
#切片是左闭右开的
df = pd.Series(data=[150,150,150,300],index=["语文","数学","英语","理综"])
#索引: 数学 150
#切片: 语文 150 数学 150 英语 150
df.iloc[[1,3]] # 在套一层中括号，返回原来的数据类型
df.iloc[0:3] # 在套一层中括号，返回原来的数据类型
```
## Series概念
`可以将其理解为一个定长的有序字典`

### 基本属性
```python
df = pd.Series(data=[150,150,150,300],index=["语文","数学","英语","理综"])
df.shape
df.size
df.index
df.values
df.head()#默认前5个
df.tail()#默认后5个
# 判断是否有空数据
pd.isnull(df)
pd.notnull(df)
df.isnull()
df.notnull()
df.name = "给Series定义名字"
```
### Series之间的运算
```python
df = Series(np.random.randint(0,10,size=11),index=np.arange(3,14))
df2 = Series(np.random.randint(0,10,size=11),index=np.arange(1,11))
# 不一致的地方补NaN,相同的索引进行运算
df+df2
# 如何保留所有的index 对应的value 
# fill_value 将需要补全的数据定义为指定的数值
df.add(df2,fill_value=0)
df.subtract(df2)
df.sub(df2)
df.mul(df2)
df.mod(df2)
df.pow(df2)
df.floordiv(df2)
```

