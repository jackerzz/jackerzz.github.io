---
title: 笔试准备
tags:
  - 基础
categories:
  - 笔试
date: 2021-09-16 21:50:34
---

1. 如何打乱一个列表

```py
from random import shuffle
lists = range(10)
shuffle(lists)

```
2. py变量名称是区分大小写的

3. py中的闭包
```py
def a(x):
    def b(a):
        print("hhhh")
        a +=1
        return 
    return b(x)
```