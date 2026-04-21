## 它能做什么

这个工具会在浏览器里直接把原始 Cookie 和 Set-Cookie 头解析成结构化 JSON。你可以粘贴单行头、多行头，或者只粘贴去掉前缀后的值。

## Cookie 与 Set-Cookie

Cookie 头通常包含多个由客户端发送的名称和值对。Set-Cookie 头通常定义单个 Cookie，并带上 Path、Secure、HttpOnly、SameSite、Expires 或 Max-Age 等属性。

## 说明

解析过程完全在本地完成，不会把头信息上传到服务器。无效片段会单独列出，方便你快速发现格式有问题的 Cookie 字符串。
