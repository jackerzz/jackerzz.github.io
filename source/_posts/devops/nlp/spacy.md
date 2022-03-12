---
title: nlp--词语、短语、名字和概念的检索
tags:
  - nlp
categories:
  - 开发笔记 
date: 2022-03-08 21:50:34
---

# spacy笔记

## spaCy介绍
`is_alpha`，`is_punct`和`like_nums`都会返回一个布尔值，检测词符是否有字母表字符组成、 是否是标点符号或者

是否_代表了_一个数字；举个例子，一个包含了1和0的词符"10"， 或者一个包含了T,E,N三个字母的词组"ten"。

这些属性也被叫做词汇属性：他们仅仅代表了词典中元素的特性，而与词符所在的语义情境无关。

```python
import spacy

nlp = spacy.blank("zh")

# 处理文本
doc = nlp(
    "在1990年，一份豆腐脑可能只要￥0.5。"
    "现在一份豆腐脑可能要￥5左右了。"
)

# 遍历doc中的词符
for token in doc:
    # 检测词符的文本是否是"￥"
    if token.text == "￥":
        # 获取文档中的下一个词符
        next_token = doc[token.i + 1]
        # 检测下一个词符是否组成一个数字
        if next_token.like_num:
            print("Price found:", next_token.text)
```

## 训练流程
很多非常有趣的分析是基于语境的： 比如一个词是否是动词，或者文本的一段跨度是否是人名。
训练好的流程组件所包含的统计模型让spaCy可以通过语境来做抽取。
抽取结果通常包括了词性标注、依存关系和命名实体。
流程是由大量标注过的文本例子训练而成。
流程可以输入更多的标注数据来优化结果，常见的应用是用特定数据优化用户需要的特定场景。

什么是训练流程？
使spaCy可以_从语境中_抽取到语言学属性的模型 `词性标注` `依存关系解析` `命名实体识别` 
从标注过的文本中训练而来可以用更多的标注数据来更新模型，优化抽取结果
	
### 流程包下载
`二进制权重` `词汇表` `元信息` `配置文件`
spaCy提供了很多训练好的流程包，我们可以用spacy download命令来下载。

比如`zh_core_web_sm`这个流程包就是一个小的中文模型，它有所有核心功能，是从网上的文本训练而来。

`spacy.load`方法可以通过包名读取一个流程包并返回一个nlp实例。

模型包含有二进制权重，spaCy用这些`权重`可以做出模型预测实现信息抽取。

模型包也含有词汇表以及关于流程和训练配置文件的元信息，配置了spaCy的语言类以及相应的处理流程组件。

- 下载包
```sh
python -m spacy download zh_core_web_sm
```

- 使用方式
```
import spacy
nlp = spacy.load("zh_core_web_sm")
```


### 词性标注
我们来看下模型的预测结果。这个例子中我们使用spaCy来获得词性标注的结果， 为每个词在其所在语境中标注种类。

首先我们读入小版本的中文流程得到一个nlp的实例。

然后我们处理"我吃了个肉夹馍"这个文本。

对于这段文本中的每一个词符我们可以打印其文字和`.pos_`属性，这个属性就是词性标注的结果。

在spaCy中，返回字符串的属性名一般结尾会有下划线；没有下划线的属性会返回一个整型的ID值。

这里我们看到模型正确地标注"吃"为一个动词，而"肉夹馍"为一个名词。

除了词性分析以外，我们还可以预测词与词之间的关系。比如一个词是某一个句子或者物体的主语。

`.dep_`属性返回预测的依存关系标注
`.pos_`属性返回词性标注的结果
`.head`属性返回句法头词符
`.text`属性返回词符文本


```python
import spacy

# 读取小版本的中文流程
nlp = spacy.load("zh_core_web_sm")

# 处理文本
doc = nlp("我吃了个肉夹馍")

# 遍历词符
for token in doc:
    print(token.text, token.pos_, token.dep_, token.head.text)
```

	
### 命名实体识别
命名实体是那些被赋予了名字的真实世界的物体，比如一个人、一个组织或者一个国家。

从`doc.ents`中可以读取命名实体识别模型预测出的所有命名实体。

它会返回一个Span实例的遍历器，我们可以打印出实体文本和用`.label_`属性来打印出实体标注。

这个例子里模型正确地将"微软"识别为一个组织，将"英国"识别为一个地理政治实体， 将"十亿美金"预测为钱。

```python
# 处理文本
doc = nlp("微软准备用十亿美金买下这家英国的创业公司。")

# 遍历识别出的实体
for ent in doc.ents:
    # 打印实体文本及其标注
    print(ent.text, ent.label_)
```
	
### spacy.explain方法
一个小诀窍是可以用`spacy.explain`这个帮手函数 来快速获得大部分常见的标注和标签定义。

举个例子，
	可能很多人不知道"GPE"代表的地理政治实体（geopolitical entity）的意思， 
	但调用`spacy.explain`我们就知道这是指国家、城市和州省。

同样这个方法也适用于词性标注和依存关系标注。

```
spacy.explain("GPE")

spacy.explain("NNP")

spacy.explain("dobj")
```	
	
## 基于规则的匹配
`用它来写一些规则来寻找文本中的目标词汇和短语。`

### 使用Matcher
要使用模板我们首先从spacy.matcher中导入matcher。

我们还要读取一个流程创建nlp实例。

用模型分享出来的词汇表nlp.vocab来初始化matcher。 我们后面会详细介绍这一块，现在只要记得一定要传入这个词汇表就好了。

matcher.add方法可以用来添加一个模板。第一个参数是唯一的ID用来识别匹配的是哪一个模板。 第二个参数是一个模板的列表。

要在文本中匹配模板，我们可以在任何doc中调用matcher。

这样就会返回所有的匹配结果

> `使用方式1`

```python
import spacy

# 导入Matcher
from spacy.matcher import Matcher

# 读取一个流程，创建nlp实例
nlp = spacy.load("zh_core_web_sm")

# 用模型分享出的vocab初始化matcher
matcher = Matcher(nlp.vocab)

# 给matcher加入模板
pattern = [{"TEXT": "iPhone"}, {"TEXT": "X"}] # 划重点
matcher.add("IPHONE_PATTERN", [pattern])      # 划重点

# 处理文本
doc = nlp("即将上市的iPhone X发布日期被泄露了") # 划重点

# 在doc上面调用matcher
matches = matcher(doc)
```

> 使用方式2

match_id: 模板名的哈希值
start: 匹配到的跨度的起始索引
end: 匹配到的跨度的终止索引

```python
# 在doc上调用matcher
doc = nlp("即将上市的iPhone X发布日期被泄露了")
matches = matcher(doc)

# 遍历所有的匹配结果
for match_id, start, end in matches:
    # 获取匹配的跨度
    matched_span = doc[start:end]
    print(matched_span.text)

```

> `应用1--匹配词汇属性`

```python
pattern = [
     # 一个只含有数字的词符
    {"IS_DIGIT": True}, 
    # 三个匹配到"国际", "足联"和"世界杯"的词符 
    {"LOWER": "国际"},    
    {"LOWER": "足联"}, 
    {"LOWER": "世界杯"},
    # 标点符号词符。
    {"IS_PUNCT": True}
]
matcher.add("IPHONE_PATTERN", [pattern])      # 划重点
doc = nlp("2018国际足联世界杯：法国队赢了！")
```

>  `应用2--匹配其它的词符属性`

```python
pattern = [
    {"LEMMA": "喜欢", "POS": "VERB"},
    {"POS": "NOUN"} # 跟名词
]
matcher.add("IPHONE_PATTERN", [pattern])      # 划重点
doc = nlp("我喜欢狗但我更喜欢猫。")
```

> `使用运算符和量词`

| 例子 | 说明 |
|------|-----|
| {"OP": "!"} | 否定: 0次匹配     |
| {"OP": "?"} | 可选: 0次或1次匹配|
| {"OP": "+"} | 1次或更多次匹配   |
| {"OP": "*"} | s0次或更多次匹配  |

```python
pattern = [
    {"LEMMA": "买"},
    {"POS": "NUM", "OP": "?"},  # 可选: 匹配0次或者1次
    {"POS": "NOUN"}  #NOUN 匹配到名词
    # {"POS": "ADJ"} #ADJ 匹配到形容词
]
doc = nlp("我买个肉夹馍。我还要买凉皮。")
```

### `实践检查`

```python
import spacy
from spacy.matcher import Matcher
​
nlp = spacy.load("zh_core_web_sm")
matcher = Matcher(nlp.vocab)
​
doc = nlp(
    "这个app的特性包括了优雅设计、快捷搜索、自动标签以及可选声音。"
)
​
# 写一个模板是形容词加上一个或者两个名词
pattern = [{"POS": "ADJ"}, {"POS": "NOUN"}, {"POS": "NOUN", "OP": "?"}]
​
# 把模板加入到matcher中然后把matcher应用到doc上面
matcher.add("ADJ_NOUN_PATTERN", [pattern])
matches = matcher(doc)
print("Total matches found:", len(matches))
​
# 遍历所有的匹配，打印span的文本
for match_id, start, end in matches:
    print("Match found:", doc[start:end].text)
```

