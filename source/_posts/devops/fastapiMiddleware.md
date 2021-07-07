---
title: 给Fastapi 设计一个自定义 http加密中间件
tags:
  - api
categories:
  - DevNote 
date: 2021-07-06
---
## 什么是中间件

中间件 作用 HTTP 调用添加自定义处理逻辑
在实际开发中，我们可能需要对每个请求/返回做一些特定的操作，比如记录请求的 log 信息，在返回中插入一个 Header，对部分接口进行鉴权，这些都需要一个统一的入口，逻辑如下：

![](/images/st/接口逻辑.png)

这个功能可以通过引入 middleware 中间件来解决。python [HTTP 模块](https://docs.python.org/zh-cn/3.7/library/http.html) 的设计的一大特点是特别容易构建中间件。Standard 所使用的 fastapi 框架也提供了类似的中间件。

## 如何在中间件设计自定义的自己的通信协议加密

- 1. 生成http 加密解密需要的公钥和私钥
- 2. 根据fastapi 原生的中间件写法写一个基础框架
- 3. 设计 请求接受的消息加密
- 4. 设计 响应数据的加密以及 Content-Length 的长度计算
- 5. 设计 自定义的响应头参数

## 伪代码

```python
import json
from starlette.requests import Request
from starlette.types import ASGIApp, Message, Receive, Scope, Send
from starlette.datastructures import MutableHeaders
from SecureHTTP import EncryptedCommunicationServer
from db.session import redis_session
from core.config import settings

class MessageSecureHTTPMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            responder = _MessageSecureHTTPResponder(self.app)
            await responder(scope, receive, send)
            return
        await self.app(scope, receive, send)

class _MessageSecureHTTPResponder:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        self.receive: Receive = unattached_receive
        self.send: Send = unattached_send
        self.url = ''
        self.initial_message: Message = {}
        self.started = False
        self.client = redis_session()
        self.resServer = EncryptedCommunicationServer(
            self.client.get('privkey'))

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        request = Request(scope, receive)
        self.url = request.url.path
        self.receive = receive
        self.send = send
        await self.app(scope, self.receive_with_msg, self.send_with_msg)

    async def receive_with_msg(self) -> Message:
        '''
            解密返回
        '''
        message = await self.receive()
        if self.url not in settings.EXURL:
            return message

        body = json.loads(str(message['body'], encoding="utf-8"))
        body = self.resServer.serverDecrypt(body)
        message['body'] = bytes(json.dumps(body), encoding='utf-8')
        
        return message

    async def send_with_msg(self, message: Message) -> None:
        '''
            加密返回
        '''
        if self.url not in settings.EXURL:
            await self.send(message)
            return

        if message["type"] == "http.response.start":
            self.initial_message = message
            return

        elif message["type"] == "http.response.body":
            headers = MutableHeaders(raw=self.initial_message['headers'])

            # bytes to dict => dict to bytes
            body = json.loads(str(message['body'], encoding="utf-8"))
            body = self.resServer.serverEncrypt(body)
            body = bytes(json.dumps(body), encoding='utf-8')

            # 更新 body
            message["body"] = body

            # 自定义响应header
            headers["Content-Length"] = str(len(body))
            headers['ac'] = "hhhh"
            headers.append("Set-Cookie", "fasdfdsa")

            self.initial_message['headers'] = headers._list
            await self.send(self.initial_message)

            await self.send(message)


async def unattached_receive() -> Message:
    raise RuntimeError("receive awaitable not set")  # pragma: no cover


async def unattached_send(message: Message) -> None:
    raise RuntimeError("send awaitable not set")  # pragma: no cover
```

- [源代码](https://github.com/jackerzz/Standard/blob/master/middleware/secureHttpsMiddleware.py)

## 最后如何应用于实际项目
- 1.将生成的的公钥加密后发送前端
- 2.或者可以参考[test_client 测试示例](https://github.com/jackerzz/Standard/blob/master/test/test_client.py)

## 参考资料

- [http.server](https://docs.python.org/zh-cn/3.7/library/http.server.html#module-http.server)
- [http.cookies](https://docs.python.org/zh-cn/3.7/library/http.cookies.html#module-http.cookies)
- [http.cookiejar](https://docs.python.org/zh-cn/3.7/library/http.cookiejar.html#module-http.cookiejar)
- [http.client](https://docs.python.org/zh-cn/3.7/library/http.client.html#module-http.client)