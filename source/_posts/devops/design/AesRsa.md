---
title: Rsa+Aes加密混淆流程
tags:
  - python
categories:
  - 开发笔记 
date: 2021-07-20 21:32:34
---

# Rsa+Aes加密混淆流程

## 仅能处理 信息泄露问题, 请求被篡改问题 

### client 加密
```js
// 接口防止参数篡改和重放攻击
// header['timestamp']  是否超过了60s 处理 重放攻击   类型： int
// header['nonce'] 保证每个请求只发一次     类型： int

var asekey =EncryptedCommunicationMix().md5(str(header['timestamp']+header['nonce']+任意长度随机字母数字组合))
var pubkey = 模板渲染获得

// 原数据 
var bodyData = {"username":"dout","fsdafsa","fdsafsd"}
// 原数据加密后的存放位置
var respons = {"key":"","value":""}

// ase 加密后的
respons['value'] = AESEncrypt(asekey,bodyData)

// 通过公钥 使用RSA加密 aes
RSArespons['key'] = RSAEncrypt(pubkey,asekey)

// 数据发送
// 必须在将上述的 header['timestamp'] 和 header['nonce']  
// 放入Ajax  的 header 中 回传到服务器
$.ajax({
    url: "http://localhost/Register",
    type: 'post',
    async: true,
    contentType: "application/json", // 必须
    data: JSON.stringify(ePost),     // 必须
    dataType: 'json',   // 必须
    success: function (res) {
        console.info(res);
        var resp = eb.browserDecrypt(res);
        console.log(resp);
    },
    error: function (xhr) {
        alert('出错了');
    }
});

```

## server 解密
```python
from SecureHTTP import AESDecrypt,RSADecrypt
# 加密数据
respons = {"key":"xfdsafdsaf","value":"fsdafdsafda"}

asekey = RSADecrypt(privkey,respons['key'])

# 解密获得原数据
bodyData = AESDecrypt(asekey,respons['value'])
```

## server 加密  
```python
from SecureHTTP import AESEncrypt
# 原数据
responseBody = {"username":"admin","status","成功"}

#  原数据加密后的存放位置
respons = {"key":"","value":""}

data = dict(data=AESEncrypt(asekey, json.dumps(responseBody, separators=(',', ':')), output_type="str")))
```

## client 解密
```js
// 加密数据
var respons = {"data":"xfdsafdsaf"}
// 解密获得原数据
var bodyData = AESDecrypt(asekey,respons['data'])
```

### 参考资料
- [前端js加密解密参考](https://github.com/staugur/SecureHTTP.js)
- [后端python加密参考](https://github.com/staugur/Python-SecureHTTP)