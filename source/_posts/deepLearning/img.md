---
title:  图片处理
tags:
  - deepLearning
categories:
  - opencv 
date: 2023-01-22
---
- [详解Python+opencv裁剪/截取图片的几种方式](https://www.jb51.net/article/211183.htm)
- [PaddleOCR详解](https://www.cnblogs.com/xiaoxia722/p/14627482.html)
## 示例
```python
import json
from PIL import Image
import cv2
import numpy as np
import os

def get_data(res_path):
    with open(res_path, 'r', encoding='utf-8') as f:
        data = json.loads(f.read())
        return data['res']


result = get_data(
    '/Users/zhouzhikai/PycharmProjects/ai_data_acquisition/output/RE_SER/base/res_0.txt')

img_path = '/Users/zhouzhikai/PycharmProjects/ai_data_acquisition/tests/20221112-120221.png'
def core():
    for row in result:
        print(row['text_region'])
        print(row['text'])
        print(row['confidence'])


def chatPng(top,left,bottom,right):
    image = Image.open(img_path)
    crop_image = cv2.imread(img_path)

    top = top - 5
    left = left - 5
    bottom = bottom + 5
    right = right + 5

    # 左上角点的坐标
    top = int(max(0, np.floor(top + 0.5).astype('int32')))
    left = int(max(0, np.floor(left + 0.5).astype('int32')))
    # 右下角点的坐标
    bottom = int(min(np.shape(image)[0], np.floor(bottom + 0.5).astype('int32')))
    right = int(min(np.shape(image)[1], np.floor(right + 0.5).astype('int32')))

    croped_region = crop_image[top:bottom, left:right]

    #裁剪图片存放目录

    cv2.imwrite('da.png', croped_region)
# 29,27,806,167
# 591,170,921,471
# A区
# chatPng(29,27,167,806)
# C区
# chatPng(170,591,471,921)
# D区
# 592,473,921,777
chatPng(473,592,777,921)
# E区
# 31,171,590,1288
chatPng(171,31,1288,590)
# F区
# 29,1290,921,1309
chatPng(1290,29,1309,921)
# A区--2
# 28,27,807,167
chatPng(27,28,167,807)
```