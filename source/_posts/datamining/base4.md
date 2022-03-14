---
title: 数据预处理
tags:
  - analysisTool
categories:
  - python 
date: 2021-07-29 22:30:34
---

# 数据预处理
海量的原始数据中存在着大量不完整（有缺失值）、不一致、有异常的数据，严重影响到数据挖掘建模的执行效率，甚至可能导致挖掘结果的偏差，所以进行数据清洗就显得尤为重要，数据清洗完成后接着进行或者同时进行数据集成、转换、归约等一系列处理，该过程就是数据预处理，数据预处理工作量占到了整个过程的60%。

## 基于函数做预处理
![20210802230900](/images/mining/20210802230900.png)


### [`interpolate`](https://docs.scipy.org/doc/scipy/reference/interpolate.html)
- 功能
interpolate是SciPy的一个子库，下面包含了大量的插值函数

- 使用格式
```python
from scipy.interpolate import*
f = scipy.interpolate.lagrange(x, y)
```


### [`unique`](https://numpy.org/doc/stable/reference/generated/numpy.unique.html)
- 功能
去除数据中的重复元素，得到单值元素列表。它既是NumPy库的一个函数，也是Series对象的一个方法
- 使用格式
```python
import pandas as pd
import numpy as np
D = pd.Series([1, 1, 2, 3, 5])
D.unique()
np.unique(D)

```

### [`isnull/notnull`](https://numpy.org/doc/stable/reference/generated/numpy.isnan.html)
- 描述
判断每个元素是否空值/非空值
- 使用格式
```python
import pandas as pd
import numpy as np
D = pd.Series([1, 1, 2, 3, 5,[]])
D.isnan()

```

### [`random`](https://numpy.org/doc/1.16/reference/routines.random.html)
- 描述
可以用该库下的各种函数生成服从特定分布的随机矩阵，抽样时可使用
- 使用格式
```python
import numpy as np

np.random.rand(k, m, n, ...)
```

### [`PCA`](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html)
- 描述
对指标变量矩阵进行主成分分析
- 使用格式
```python
from sklearn.decomposition import PCA
D = np.random.rand(10,4)
pca = PCA()
pca.fit(D)
pca.components_                       # 返回模型的各个特征向量
pca.explained_variance_ratio_         # 返回各个成分各自的方差百分比
```


