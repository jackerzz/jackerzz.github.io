---
title:  Faster R-CNN
tags:
  - deepLearning
categories:
  - RCNN系列目标检测算法详解 
date: 2023-01-22
---

- `启航地址`：https://aistudio.baidu.com/aistudio/education/preview/667703

# Faster R-CNN

![20230122202629.png](/images/deep/20230122202629.png)

## Faster R-CNN 网络结构
![20230122202629.png](/images/deep/20230122203308.png)
- [PaddleDetectionFaster R-CNN Github](https://github.com/PaddlePaddle/PaddleDetection/blob/release/0.4/docs/MODEL_ZOO_cn.md)

## feature map

### 含义
 在每个卷积层，数据都是以三维形式存在的。你可以把它看成许多个二维图片叠在一起，其中每一个称为一个feature map。在输入层，如果是灰度图片，那就只有一个feature map；如果是彩色图片，一般就是3个feature map（红绿蓝）。层与层之间会有若干个卷积核（kernel），上一层和每个feature map跟每个卷积核做卷积，都会产生下一层的一个feature map

### 计算方式
INPUT为32*32，filter的大小即kernel size为5*5，stride = 1，pading=0,卷积后得到的feature maps边长的计算公式是： 
output_h =（originalSize_h+padding*2-kernelSize_h）/stride +1 
所以，卷积层的feature map的变长为：conv1_h=（32-5）/1 + 1 = 28 
卷积层的feature maps尺寸为28*28.

