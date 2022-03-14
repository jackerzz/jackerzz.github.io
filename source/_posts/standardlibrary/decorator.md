title: 装饰器
tags:
  - 灰魔法
categories:
  - python
date: 2021-08-19 20:50:34
---

# 装饰器
装饰器的本质:闭包函数
功能:就是在不改变原函数调用方式的情况下，在这个函数前后加上扩展功能

```python
def timmer(func):
    def inner(*args,**kwargs):
        '''添加函数调用之前的扩展代码'''
        ret = func(*args,**kwargs)
        '''添加函数调用之后的扩展代码'''
        return ret
    return inner

#设计模式 原则 开放封闭原则
#对扩展是开放的
#对修改是封闭的
@timmer  #jjj = timmer(jjj)  语法糖
def jjj():
    return 123
```