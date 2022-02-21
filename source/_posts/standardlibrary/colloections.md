---
title: collections 容器数据类型
tags:
  - python标准库
categories:
  - python
date: 2021-08-22 21:30:34
---
# 内置数据类型
```python
a_dict = dict()
a_list = list()
a_set = set()
a_tuple = tuple()
```
# [collections模块](https://docs.python.org/zh-cn/3.7/library/collections.html?highlight=collections#module-collections)
collections模块还提供了几个额外的数据类型：Counter、deque、defaultdict、namedtuple和OrderedDict

1.namedtuple: 生成可以使用名字来访问元素内容的tuple
```python
from collections import namedtuple

Point=namedtuple("Point",["x","y"])
d=Point(1,2)
print(d.x)
print(d.y)


Circle=namedtuple("Ciecle",["a","b","r"])
c=Circle(1,2,3)
print(c.a)
print(c.b)
print(c.r)
```

2.deque: 双端队列，可以快速的从另外一侧追加和推出对象

使用list存储数据时，按索引访问元素很快，但是插入和删除元素就很慢了，因为list是线性存储，数据量大的时候，插入和删除效率很低。
deque是为了高效实现插入和删除操作的双向列表，适合用于队列和栈
```python
from collections import deque
l=[1,2,3]
det=deque(l)
print(det)

det.append(4)
det.append(5)
det.appendleft(6)
det.appendleft(7)
print(det)

det.pop()
det.pop()
det.popleft()
det.popleft()
det.popleft()
print(det)

det.popleft()
det.popleft()
print(det)

det.popleft()
print(det)#报错
```

3.Counter: 计数器，主要用来计数
```python
from collections import OrderedDict
d = {'z':'qww','x':'asd','y':'asd','name':'alex'}
print(d.keys())
o_d = OrderedDict([('a', 1), ('b', 2), ('c', 3)])
print(o_d)
od = OrderedDict()
od['z'] = 10
od['x'] = 10
od['y'] = 30
print(od)
print(od.keys())
```

4.OrderedDict: 有序字典
```python
from collections import defaultdict


def func():
    return  'N/A'
my_dic = defaultdict(func)
print(my_dic['k'])

dic=defaultdict(lambda :"good")
print(dic["k"])
```

5.defaultdict: 带有默认值的字典
```python
from collections import Counter
c=Counter("FGEESGFGsyfFEYRDGDFS")
print(c)
print(c["F"])


c = Counter('which')
print(c)
c.update('witch')
print(c)
c.update('watch')
print(c)
c.subtract('where')
print(c)
del c["h"]
print(c)
print(list(c.elements()))
print(c.most_common())  #返回一个有序字典

c2 = c.copy()
print(c2)
c.clear()
print(c)
```







