---
title: 笔试准备
tags:
  - 笔试
categories:
  - 笔试
date: 2021-09-16 21:50:34
---

# 笔试--python 部分

## 面向对象

### 继承
	
#### 单继承多继承
```py
class ParentClass1: #定义父类
	pass
 
class ParentClass2: #定义父类
	pass
 
class SubClass1(ParentClass1): #单继承，基类是ParentClass1，派生类是SubClass
	pass
 
class SubClass2(ParentClass1,ParentClass2): #python支持多继承，用逗号分隔开多个继承的类
	pass
```
	
#### 查看所有继承的父类

`__base __只查看从左到右继承的第一个子类，__bases__则是查看所有继承的父类`

```py
print(Person.__bases__)
```

		
#### 派生：相对论

在父类的基础上产生子类，产生的子类就叫做派生类
父类里没有的方法，在子类中有了，这样的方法就叫做派生方法。
父类里有，子类也有的方法，就叫做方法的重写

#### 接口类与抽象类	

1.接口类：（在抽象类的基础上）
	在python中，默认是没有接口类的,接口类不能被实例化（如果实例化会报错）,接口类中的方法不能被实现
```py
# 借用abc模块来实现接口
# 接口类（就是为了提供标准，约束后面的子类）
from abc import ABCMeta,abstractmethod
class Payment(metaclass=ABCMeta):
	@abstractmethod
	def pay(self,money):
		pass

class Wechatpay(Payment):
	def fuqian(self,money):
		'''实现了pay的功能，但是方法名字不一样'''
		print('微信支付了%s元'%money)

class Alipay:
	def pay(self,money):
		print('支付宝  支付了%s' %money)

# p = Wechatpay() #报错了（因为上面定义了一个接口类，接口类里面
# 定义了一个pay方法，而在下面的Wechatpay方法里没有pay方法，不能
# 调用，在接口类里面约束一下，接口类里的pay方法里面不能写其他，直接pass）
a = Alipay()
a.pay(200)
p = Payment() #接口类不能被实例化

#借用abc模块来实现接口
```


### 封装
`封装数据：目的是保护隐私` `功能封装：目的是隔离复杂度` 
`如果用了私有的，在类的外部，无法直接使用变形的属性，但是在类的内部可以直接使用`
#### property
`将一个类的函数定义成特性以后，对象再去使用的时候obj.name,根本无法察觉自己的name是执行了一个函数然后计算出来的，这种特性的使用方式遵循了统一访问的原则`
```py
class Calculate:
    def __init__(self,*args):
        print(args)
        if len(args)==1 and (type(args[0]) is list or type(args[0]) is tuple):
            self.Calculatebers=args[0]
        else:
            self.Calculatebers = args

    @property
    def sum(self):
        return sum(self.Calculatebers)

    @property
    def avg(self):
        return self.sum/len(self.Calculatebers)

    @property
    def min(self):
        return min(self.Calculatebers)

    @property
    def max(self):
        return max(self.Calculatebers)
Calculate = Calculate([3,1,3])
vvv = Calculate(8,2,3)
print(Calculate.sum)
print(Calculate.min)
print(Calculate.avg)
print(Calculate.max)
print('-----------')
print(vvv.sum)
print(vvv.min)
print(vvv.avg)
print(vvv.max)

property（3）
```

## 生成器，迭代器

### 可迭代协议：
`可以被迭代要满足要求的就叫做可迭代协议。内部实现了__iter__方法`

　　iterable：
        可迭代的------对应的标志

　　什么叫迭代？：
        一个一个取值，就像for循环一样取值
        字符串，列表，元组，集合，字典都是可迭代的

### 迭代器协议：内部实现了__iter__，__next__方法

　　迭代器大部分都是在python的内部去使用的，我们直接拿来用就行了

　　迭代器的优点：如果用了迭代器，节约内存，方便操作
 

`相同点：都可以用for循环`

`不同点：就是迭代器内部多实现了一个__next__方法`

### 生成器表达式：类似于列表推倒式，就是把列表推导式的【】改为了（）

```py
l=[{'name':'v1','age':'22'},{'name':'v2'}]
name_list=(dic['name'] for dic in l)#吧列表生成器的[]改成()
print(name_list)#取出的是一个生成器，而不是要取得值，所以得加上next
print(next(name_list))
```

### 列表推导式：

```py
 l=[i*y for i in range(100)]
```

## 装饰器
`装饰器的功能：在不修改原函数及其调用方式的情况下对原函数功能进行扩展`
`装饰器的本质：就是一个闭包函数`
`多个装饰器，由上往下执行`
```py
import time 
def  wrapper(func):
        def inner():
              start=time.time()
              func()
              end=time.time()
              print(end-start)
        return inner 
@wrapper   # <==>t1=wrapper(test_1)
def  test_1():
        time.sleep(1)
        print('aaaaa')
t1=wrapper(test_1)
t1() 
```

## 网络编程

## 互斥锁，进程间通信

## 进程池以及回调函数

## 线程相关