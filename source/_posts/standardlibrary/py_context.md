---
title: 基于python 上下文回调属性实现golang 中的 延迟调用
tags:
  - contextlib
categories:
  - python标准库
date: 2021-07-03
---


# 基于python 上下文回调属性实现golang 中的 延迟调用
- [python官方文档--contextlib ](https://docs.python.org/zh-cn/3.7/library/contextlib.html)
## input
```python
import contextlib

def callback():
    print('被延迟的function')
    
def callnormal():
    print("被正常调用")

def pyDefer(callnormal,callback):
    '''
     实现类似 defer 的延迟调用
         - 借助python 上下文中的 回调机制实现类似golang 中的 defer
    '''
    with contextlib.ExitStack() as stack:
        stack.callback(callback)
        callnormal()

pyDefer(callnormal,callback)
```
## output
```bash
被正常调用
被延迟的function
```