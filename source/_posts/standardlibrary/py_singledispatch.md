---
title: 泛型函数的使用   
tags:
  - singledispatch
categories:
  - python标准库
date: 2021-07-04
---
##  [泛型函数的使用](https://docs.python.org/zh-cn/3.7/library/functools.html?highlight=singledispatch#functools.singledispatch)
##  [python3 标准库](https://pymotw.com/3/index.html)
根据传入参数类型的不同而调用不同的函数逻辑体，这种实现我们称之为泛型。在 Python 中叫做 singledispatch

## 引入包
```python
import functools
```

## 不带装饰器
```python
@functools.singledispatch
def myfunc(arg):
    print('default myfunc({!r})'.format(arg))


@myfunc.register(int)
def myfunc_int(arg):
    print('myfunc_int({})'.format(arg))


@myfunc.register(list)
def myfunc_list(arg):
    print('myfunc_list()')
    for item in arg:
        print('  {}'.format(item))


myfunc('string argument')
myfunc(1)
myfunc(2.3)
myfunc(['a', 'b', 'c'])
```

## 带类型检测装饰器
```python
def check_type(func):
    def wrapper(*args):
        arg1, arg2 = args[:2]
        if type(arg1) != type(arg2):
            return '[Error] : Parameter type is different, cannot be spliced!!'
        return func(*args)
    return wrapper

@functools.singledispatch
@check_type
def add(obj, new_obj):
    raise TypeError

@add.register(str)
@check_type
def _(obj, new_obj):
    obj += new_obj
    return obj

print(add('hello',', world'))
# list and string cannot be concatenated
print(add([1,2,3], '4,5,6'))
```