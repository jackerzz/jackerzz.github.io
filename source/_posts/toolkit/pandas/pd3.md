---
title: 如何让 Pandas 按数据类型选择列？
tags:
  - analysisTool
categories:
  - python
date: 2021-09-16 21:50:34
---

include 表示包含哪种类型，输出结果是包含该类型的 df；
exclude 表示排除哪种类型，输出结果是不包含该类型的 df；
包含或排除的类型可以是多种，用列表显示，如 include=['float64','int64']


# 构建数据
```python
import pandas as pd
df = pd.DataFrame({'a': [1, 2] * 10,
                   'b': [True, False] * 10,
                   'c': [1.0, 2.0] * 10})
```

# 输出包含 bool 数据类型的列
```python
df.select_dtypes(include='bool')
```

# 输出包含小数数据类型的列
```python
df.select_dtypes(include=['float64'])
```

# 输出排除整数的列
```python
df.select_dtypes(exclude=['int64'])
```