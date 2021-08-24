title: 迭代器和生成器
tags:
  - python标准库
categories:
  - python
date: 2021-08-23 21:50:34
---

## 可迭代对象
>作用：迭代器节省内存

### 定义
可迭代协议
>凡是可迭代的内部都有一个__iter__方法;

迭代器协议
>迭代器里既有iter方法，又有next方法，通过iter(o)得到的结果就是一个迭代器
### 如何判断
```python
from collections import Iterable
from collections import Iterator
a = range(100)
print(isinstance(a,Iterable)) # 可迭代(只有__iter__()方法)
print(isinstance(a,Iterator)) # 迭代器(既有__iter__()方法，也有__next__()方法)
'''
True
False
'''
```

## 生成器

### 生成器函数：
>常规函数定义，但是，使用yield语句而不是return语句返回结果。yield语句一次返回一个结果，在每个结果中间，挂起函数的状态，以便下次重它离开的地方继续执行

### 生成器表达式：
>类似于列表推导，但是，生成器返回按需产生结果的一个对象，而不是一次构建一个结果列表

### 生成器Generator：
本质：
>迭代器(所以自带了__iter__方法和__next__方法，不需要我们去实现)

特点：
>惰性运算,开发者自定义

### 生成器函数

>一个包含yield关键字的函数就是一个生成器函数。
yield可以为我们从函数中返回值，
但是yield又不同于return，return的执行意味着程序的结束，
调用生成器函数不会得到返回的具体的值，而是得到一个可迭代的对象。
每一次获取这个可迭代对象的值，就能推动函数的执行，获取新的返回值。直到函数执行结束。

```python
import time
def genrator_fun1():
    a = 1
    print('现在定义了a变量')
    yield a
    b = 2
    print('现在又定义了b变量')
    yield b

g1 = genrator_fun1()
print('g1 : ',g1)       #打印g1可以发现g1就是一个生成器
print('-'*20)   #我是华丽的分割线
print(next(g1))
time.sleep(1)   #sleep一秒看清执行过程
print(next(g1))
```