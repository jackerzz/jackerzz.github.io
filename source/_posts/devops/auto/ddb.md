---
title: 驱动开发方法论
tags:
  - 自动化测试
categories:
  - 自动化测试 
date: 2022-07-20 22:30:34
---

概念
TDD：测试驱动开发（Test-Driven Development）
测试驱动开发是敏捷开发中的一项核心实践和技术，也是一种设计方法论。TDD的原理是在开发功能代码之前，先编写单元测试用例代码，测试代码确定需要编写什么产品代码。TDD的基本思路就是通过测试来推动整个开发的进行，但测试驱动开发并不只是单纯的测试工作，而是把需求分析，设计，质量控制量化的过程。TDD首先考虑使用需求（对象、功能、过程、接口等），主要是编写测试用例框架对功能的过程和接口进行设计，而测试框架可以持续进行验证。

ATDD：验收测试驱动开发（Acceptance Test Driven Development）
ATDD 只是开发人员的职责，通过单元测试用例来驱动功能代码的实现。在准备实施一个功能或特性之前，首先团队需要定义出期望的质量标准和验收细则，以明确而且达成共识的验收测试计划（包含一系列测试场景）来驱动开发人员的TDD实践和测试人员的测试脚本开发。面向开发人员，强调如何实现系统以及如何检验。

BDD：行为驱动开发（Behavior Driven Development）
行为驱动开发是一种敏捷软件开发的技术，它鼓励软件项目中的开发者、QA和非技术人员或商业参与者之间的协作。主要是从用户的需求出发，强调系统行为。BDD最初是由Dan North在2003年命名，它包括验收测试和客户测试驱动等的极限编程的实践，作为对测试驱动开发的回应。

DDT：数据驱动测试（Data-driven testing）
数据驱动测试是一种软件测试方式，数据驱动测试会配合一个有许多测试输入及对应的验证输出值的表格，而其测试环境设定及控制不会固定在程序代码中。简而言之，即用数据验证程序的正确性。

BDD的诞生
2003年，开发人员Dan North偶然间发现把测试的标题经过简单的文字处理可以更好表达代码蕴含的业务逻辑，比如下面这段代码，

```java
public class CustomerLookupTest extends TestCase {
    testFindsCustomerById() {
        ...
    }
    testFailsForDuplicateCustomers() {
        ...
    }
}
```
当我们把测试方法中的test去掉，给单词加上空格，然后把他们组合在一起时，就会出现：

```
CustomerLookup

finds customer by id

fails for duplicate customers

...
```

在Dan看来，这无疑是对CustomerLookup类的描述，并且是用测试内容来描述代码中类的行为。Dan发现他似乎找到了一种方式，可以在TDD的基础上，通过测试来表达代码的行为。在尝到甜头后，Dan写了JBehave，用一个更关注代码行为的工具来代替JUnit进行软件开发。经过一番折腾后，Dan觉得只描述类行为不过瘾，便开始把关注点从类扩展到整个软件，他和当时项目组的业务人员一起把需求转化成Given/When/Then的三段式，然后用JBehave写成测试来描述软件的某种行为。当测试完成后，开发人员才开始编码，一旦测试通过，那软件就完成了测试中描述的某种行为。在他看来，他把TDD升级了，因为他不再只关注于局部类的方法，而开始关注整个软件的行为。

通过这种方式，Dan成功的把需求转换成了软件的功能测试，先写功能测试再驱动出产品代码，保证软件行为正确性。其次，Dan强调在测试中要尽可能的使用业务词汇，保证团队成员对业务理解一致。于是，BDD就此诞生。

为什么要BDD？
“开发软件系统最困难的部分就是准确说明开发什么” (“The hardest single part of building a software system is deciding precisely what to build” — No Silver Bullet, Fred Brooks) 。

场景一：业务分析人员觉得自己分析的需求已经写的很清晰了，并且跟技术人员进行了足够的沟通，可是开发完sign off的时候，发现所开发的功能还是跟期望有差距。

场景二：开发团队辛辛苦苦开发完一个功能，满怀信心的去给客户展示的时候，才发现原来客户需求的功能不是这样的。

这些场景是不是似曾相识？为什么会这样？第一个场景是开发团队内部技术人员跟需求分析人员的理解有偏差，导致大家理解的需求其实是不一样的；第二个场景是开发团队没有真正理解产品经理／客户所提出来的真实需求，导致开发的产品跟需求不一致。其实，产生这两个不一致的真正原因是因为不同角色有着不同的领域知识，说着不同的语言，大家在沟通的时候，如果都用自己领域语言，必然会产生沟通代沟，导致理解的不一致性。

领域知识不同、语言不通导致沟通障碍，这个客观存在的问题该如何解决呢？BDD正是为此而生。

BDD如何做？
BDD规定了行为规范，使用Given、When、Then、And来连接业务场景：

```
Given，意为前置条件；

When，意为事件触发；

Then，意为预期结果；

And，可以连接多个Given、When、Then。
```
Eg：

```
Given I open Calculator

When I enter 3+2

And enter =

Then got 5
```

是不是感觉比较简单，通过业务场景来实现、验证软件功能，而且通俗易懂，整体来看似乎很简单，但实际应用起来很多tester就容易设计的过于复杂，使其变成了难以理解的文字载体，BDD的核心思想是业务场景、行为驱动的开发、测试过程，我们必须回归业务；

1.业务层抽取，业务语言描述

根据业务层的数据流，在每个数据停留点进行纵切，抽取出一个个用例场景。描述语言一定是业务领域可懂的，不要涉及任何实现相关的技术细节。所描述的场景一定是从业务层抽象出来，体现真实业务价值的。

2.技术人员可懂，自动化友好

所描述的用例场景要能驱动开发，必须要让技术人员易于理解；要指导自动化测试，还得要求对于自动化的实现是友好的。这一点似乎是跟第一点有些矛盾，但我们严格遵守BDD的格式要求还是可以做到的。其中，GIVEN从句描述的是场景的前提条件、初始状态，通常是一种现在完成时态；WHEN从句是采取某个动作或者是发生某个事件，一定是动词，通常是一般现在时；THEN从句用“应该…(should be…)”来描述一种期望的结果，而不用断言（assert），后者与测试关联更紧密。

3.数据驱动，需求实例化

抽象的业务语言描述的需求，往往由于太抽象而缺失掉很多关键信息，导致不同人员对需求理解的不一致。想要既抽象又能包含细节信息，就需要采用需求实例来描述。简单说来，就是给场景用例举例说明。举例就会需要列举数据，如果在场景用例描述里边直接添加数据实例，那样的用例将会很混乱，可读性和可维护性都非常差。如果我们能够在描述场景的用例里边用一些变量来代替，把变量对应的值（数据）提取出来存为一个表格或者独立的文件，这样将会使得用例的可读性很好，而且也不会缺失细节信息（数据），后期的维护和修改也较为方便。这就是数据驱动的方法来描述实例化的需求。

软件测试是个极其复杂的过程，BDD并不是万能，BDD只是一种思维、行为方式，在此我不建议全盘使用BDD，尤其在公司、产品、项目、团队等不成熟、不健硕、任务繁重等情况下。然而给出强业务侧案例后，可以用BDD实现自动化测试，那是极其美妙的。

BDD-RF实践
极其幸运，RF支持BDD框架。

在RF中，BDD的行为规范不会标识为关键字，它是独立存在的，并且能够与真正的关键字完美结合，毫无违和感。

![1import.png](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.8/images/ansible/1import.png)


图中，我将测试分层，首先将数据分离出来，此处的demo做的不极致，极致的做法可以将测试数据用单独的文件维护起来，通过引入资源后去获取测试数据；

将关键字分层，最基本的分层方法，目的为了强业务性关键字，提高复用率，降低维护成本，减少代码冗余；

BDD风格代码，首先创建行为驱动关键字，如visit the host ${alias} & ${host}，其中 ${alias} 、 ${host}为业务变量，在test-case中可以直接写入变量内容，如Given visit the host httpbin & http://isee-core-stg1.paic.com.cn，

则将httpbin赋予变量${alias}，将http://isee-core-stg1.paic.com.cn

赋予变量${host}，需要注意的是此处变量是强顺序接收的，然后传入下层关键字使用。

也可以使用DDT驱动变量，如下图，Then post page ${loginUrl} & ${loginHeaders} & ${loginData}，其中${loginUrl} 、 ${loginHeaders} 、 ${loginData}则直接引用的变量值。

![4import.png](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.8/images/ansible/4import.png)



最后通过BDD行为准则，连接关键字，拼接测试场景，完成测试脚本，最后可以加入断言结果，原本BDD不建议添加断言，因为BDD只关注流程、场景，但是为了强测试，以及自动化测试，加入断言可以使脚本更加健壮，如：And assert response data msg = success。

解读下下面的test-case：
![5import.png](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.8/images/ansible/5import.png)

1、 创建接口访问host；

2、 传入业务参数；

3、 使用headers和cookie；

4、 访问业务接口；

5、 预期结果
![6import.png](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.8/images/ansible/6import.png)
![7import.png](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.8/images/ansible/7import.png)
## 总结
BDD不是工具，而是一套流程和一系列实践。它需要团队成员的通力合作，可以帮助整个团队更好的理解业务，理解软件。

BDD使用强业务性语言，使测试面向业务，面向客户，强化产品方向，其语言更利于测试脚本维护，交接。

BDD的作用是把利益关系人、交付团队等不同方面的项目相关人员集中到一起，形成共同的理解，共同的价值观以及共同的期望值。它可以帮助我们：

关注用户行为

交付最有价值的功能

在团队内部维护一致的术语

探究需求实例

编写和维护需求

创建活的文档

消除协作与沟通障碍