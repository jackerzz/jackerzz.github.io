---
title:  PP-YOLO优化深度解析
tags:
  - deepLearning
categories:
  - opencv 
date: 2023-02-15
---
## 优化策略
![20230215231843.png](/images/deep/20230215231843.png)

## Image Mixup

`提升模型抗空间扰动的影响` 

- `预处理配置中设置`

![20230216094911.png](/images/deep/20230216094911.png)


## Label Smooth

`激活函数`  `防止过拟合`

![20230216095641.png](/images/deep/20230216095641.png)


## Synchronized Batch Norm
`多卡GPU 数据同步`  `帮助多卡的卡间同步`    
![20230216095902.png](/images/deep/20230216095902.png)

## ResNet-D
`stride=2`  `通过调整RestNet 模型在采样阶段，提升模型精度`
![20230216100538.png](/images/deep/20230216100538.png)

## Deformable Conv
`可变行卷`  `学习卷机核` `权重` `形状`

- dcn_v2_stages: [5] `在第五阶段使用可变形卷积`

![20230216100538.png](/images/deep/20230216100538.png)

## Drop Block
`减少过拟合`   `提高网络泛化能力`
![20230216101310.png](/images/deep/20230216101310.png)

## Exponential Moving Average

`指数滑动平均` `历史滑动平均` 

![20230216101612.png](/images/deep/20230216101612.png)


