---
title: 用户权限设计
tags:
  - python
categories:
  - DevNote 
date: 2021-03-08
---


## 概要

权限管理几乎是每个系统或者服务都会直接或者间接涉及的部分. 权限管理保障了资源(大部分时候就是数据)的安全, 权限管理一般都是和业务强关联, 每当有新的业务或者业务变化时, 不能将精力完全放在业务实现上, 权限的调整往往耗费大量的精力.

其实, 权限的本质没有那么复杂, 只是对访问的控制而已, 有一套完善的访问控制接口, 再加上简单的权限模型. 权限模型之所以能够简单, 就是因为权限管理本身并不复杂, 只是在和具体业务结合时, 出现了各种各样的访问控制场景, 才显得复杂.

## PERM 模型
PERM(Policy, Effect, Request, Matchers)模型很简单, 但是反映了权限的本质 – 访问控制

Policy: 定义权限的规则
Effect: 定义组合了多个 Policy 之后的结果, allow/deny
Request: 访问请求, 也就是谁想操作什么
Matcher: 判断 Request 是否满足 Policy

## Model
[支持的Models](https://casbin.org/docs/zh-CN/model-storage)
[casbin 语法](https://casbin.org/docs/zh-CN/syntax-for-models)
[函数](https://casbin.org/docs/zh-CN/function)
[基于角色的访问控制](https://casbin.org/docs/zh-CN/rbac)
[域内RBAC](https://casbin.org/docs/zh-CN/rbac-with-domains)
[Casbin RBAC v.s. RBAC96](https://casbin.org/docs/zh-CN/rbac-96)
[ABAC](https://casbin.org/docs/zh-CN/abac)
[优先级模型](https://casbin.org/docs/zh-CN/priority-model)

## 术语表
- ACL: Access Control List 规模增加导致管理员重复且繁杂
特色：直接将用户与权限进行一一对应
缺点：新增用户权限需要重新设定，非常麻烦，在资源类别少的时候，可以忍受，同事和资源类别增加后，管理员的工作就会非常痛苦
- RBAC: Role Based Access Control 
特色：ACL 模型进行拓展后得来的，引入资源组以及角色组，让管理员可以更方便地管理权限
缺点：细粒度不够
-  ABAC: Attribute Based Access Control
特色： 非常强大的模型，它允许你完成非常细化的权限需求，它所有的权限都是依赖于用户、角色、行为、资源甚至环境的属性。
缺点： 与 ACL 有点类似：非常繁琐，而且非常依赖于规则引擎，而这种引擎无法独立于系统，即需要与系统耦合在一起
- PERM: 全称 Policy Effect Request Matchers
## 引用连接
[casbin 中文官方文档教程](https://casbin.org/docs/zh-CN/tutorials)
[系统权限的设计](https://github.com/xizhibei/blog/issues/101)
[k8s 权限设计](https://github.com/xizhibei/blog/issues/64)
[pycasbin](https://github.com/pycasbin)
[casbin 编辑器](https://casbin.org/zh-CN/editor)