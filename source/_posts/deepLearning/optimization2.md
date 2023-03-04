---
title:  PP-YOLO优化策略详解
tags:
  - deepLearning
categories:
  - opencv 
date: 2023-02-15
---

##  Larger Batch Size

![20230216101944.png](/images/deep/20230216101944.png)

## IoU Loss

- `IoU: 检测框定位精度标准`   `评判预测框的检测精度`    `可以防止loss抖动`
- Rnn 才用优化
- 实时的计算iou，并将负值加入到训练过程中

- 真实框的交集➗预测框的并集

![20230216102712.png](/images/deep/20230216102712.png)

## IoU Aware 

`分值=预测框中的物体*对应的类别` `目标概率` `会被 NMS掉`

- source = objectness * classification 
 

- IOU 作为定位精度 防止被 NMS,做了加权的操作


## Grid Sensitve 
`后处理` `在偏移上乘一个系数` `提升精度`

![20230216104406.png](/images/deep/20230216104406.png)


## Matrix NMS
- 防止同类别重叠，被NMS撸掉，
- 提供一个惩罚机制，保留下来分值低的框，给到后面进行预测
- 

![20230216104619.png](/images/deep/20230216104619.png)

![20230216104854.png](/images/deep/20230216104854.png)

![20230216104926.png](/images/deep/20230216104926.png)

![20230216104958.png](/images/deep/20230216104958.png)

## Coord Conv

![20230216105032.png](/images/deep/20230216105032.png)


## SPP
- 不同尺度的池化窗口提取特征

![20230216105240.png](/images/deep/20230216105240.png)


## SSLD
- 知识蒸馏
- backbone
- 选择较大的教师模型来训练小的模型

![20230216105512.png](/images/deep/20230216105512.png)
