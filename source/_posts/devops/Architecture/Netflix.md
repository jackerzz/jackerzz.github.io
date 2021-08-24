---
title:  Netflix经典推荐系统架构
tags:
  - python
categories:
  - DevNote 
date: 2021-08-21
---
# Netflix经典推荐系统架构

![](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.4/images/st/Netflix.png)
<!-- ![](/images/st/Netflix.png) -->

# 挑战：
架构既能处理海量数据，又能及时响应用户交互

# 在线层：
特点：快速响应，使用最新的数据输入，比如200MS
缺点：不能使用复杂的算法，只能读取少量数据

# 离线层：
<!-- ![](/images/st/Workoffline.png) -->
![](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.4/images/st/Workoffline.png)
特点：大部分计算包括模型训练都在这层完成
优点：可采用复杂算法、可扫描海量数据
缺点：不能对最新情景和新数据做响应，比如天粒度


# 近线层：
特点：离线和在线的折中，一般将结果存入高速缓存
优点：能使用几乎最新数据计算，延迟10秒~1分钟级别
优点：允许更复杂的算法处理，加载查询更多数据

# 组合使用的例子：
1、天粒度：离线层做矩阵分解，得到用户向量和物品向量做数据存储MySQL
2、10秒钟：近线层根据用户行为，查询TOPN相似的物品列表，存入Cassandra
3、200毫秒：在线层查询第2步骤的结果，更新推荐列表

# 信号和模型
![](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.4/images/st/Signalsandmodels.png)


# 事件和数据分发
![](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.4/images/st/Eventanddatadistribution.png)

# 参考资料
[个性化和推荐系统架构](https://netflixtechblog.com/system-architectures-for-personalization-and-recommendation-e081aa94b5d8)
[Ephemeral Volatile Caching in the cloud](https://netflixtechblog.com/ephemeral-volatile-caching-in-the-cloud-8eba7b124589)