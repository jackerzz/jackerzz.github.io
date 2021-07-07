---
title: API 身份验证
tags:
  - api
categories:
  - DevNote 
date: 2021-07-06 21:50:34
---

# API 身份验证

在典型业务场景中，为了区分用户和安全保密，必须对 API 请求进行鉴权， 但是不能要求每一个请求都进行登录操作。合理做法是，在第一次登录之后产生一个有一定有效期的 token，并将其存储于浏览器的 Cookie 或 LocalStorage 之中，之后的请求都携带该 token ，请求到达服务器端后，服务器端用该 token 对请求进行鉴权。在第一次登录之后，服务器会将这个 token 用文件、数据库或缓存服务器等方法存下来，用于之后请求中的比对。或者，更简单的方法是，直接用密钥对用户信息和时间戳进行签名对称加密，这样就可以省下额外的存储，也可以减少每一次请求时对数据库的查询压力。这种方式，在业界已经有一种标准的实现方式，该方式被称为 JSON Web Token（JWT，音同 jot，详见 JWT RFC 7519）。

>token 的意思是“令牌”，里面包含了用于认证的信息。这里的 token 是指 JSON Web Token（JWT）。

## JWT 简介

### JWT 认证流程

![](/images/st/jwt.png)

1. 客户端使用用户名和密码请求登录
2. 服务端收到请求后会去验证用户名和密码，如果用户名和密码跟数据库记录不一致则验证失败，如果一致则验证通过，服务端会签发一个 Token 返回给客户端
3. 客户端收到请求后会将 Token 缓存起来，比如放在浏览器 Cookie 中或者本地存储中，之后每次请求都会携带该 Token
4. 服务端收到请求后会验证请求中携带的 Token，验证通过则进行业务逻辑处理并成功返回数据

在 JWT 中，Token 有三部分组成，中间用 . 隔开，并使用 Base64 编码：

- header
- payload
- signature

如下是 JWT 中的一个 Token 示例：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjgwMTY5MjIsImlkIjowLCJuYmYiOjE1MjgwMTY5MjIsInVzZXJuYW1lIjoiYWRtaW4ifQ.LjxrK9DuAwAzUD8-9v43NzWBN7HXsSLfebw92DKd1JQ
```

### header 介绍

JWT Token 的 header 中，包含两部分信息：

1. Token 的类型
2. Token 所使用的加密算法

例如：

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

该例说明 Token 类型是 JWT，加密算法是 HS256（alg 算法可以有多种）。

### Payload 载荷介绍

Payload 中携带 Token 的具体内容，里面有一些标准的字段，当然你也可以添加额外的字段，来表达更丰富的信息，可以用这些信息来做更丰富的处理，比如记录请求用户名，标准字段有：

- iss：JWT Token 的签发者
- sub：主题
- exp：JWT Token 过期时间
- aud：接收 JWT Token 的一方
- iat：JWT Token 签发时间
- nbf：JWT Token 生效时间
- jti：JWT Token ID

本例中的 payload 内容为：

```json
{
 "id": 2,
 "username": "kong",
 "nbf": 1527931805,
 "iat": 1527931805
}
```

### Signature 签名介绍

Signature 是 Token 的签名部分，通过如下方式生成：

1. 用 Base64 对 header.payload 进行编码
2. 用 Secret 对编码后的内容进行加密，加密后的内容即为 Signature

Secret 相当于一个密码，存储在服务端，一般通过配置文件来配置 Secret 的值，本例中是配置在 core/config.py 配置文件中:

![](/images/st/20210707212335.png)

最后生成的 Token 像这样：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjgwMTY5MjIsImlkIjowLCJuYmYiOjE1MjgwMTY5MjIsInVzZXJuYW1lIjoiYWRtaW4ifQ.LjxrK9DuAwAzUD8-9v43NzWBN7HXsSLfebw92DKd1JQ
```

签名后服务端会返回生成的 Token，客户端下次请求会携带该 Token，服务端收到 Token 后会解析出 header.payload，然后用相同的加密算法和密码对 header.payload 再进行一次加密，并对比加密后的 Token 和收到的 Token 是否相同，如果相同则验证通过，不相同则返回 HTTP 401 Unauthorized 的错误。

>详细的 JWT 介绍参考 [middleware/authentication](https://github.com/jackerzz/Standard/blob/master/middleware/authentication.py)。