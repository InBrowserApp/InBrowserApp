## 这个工具会解析什么？

你可以粘贴 Cookie 请求头，或一条到多条 Set-Cookie 响应头。解析器会把 Cookie 名称、值以及格式错误的片段整理成结构化 JSON，方便快速检查。

## Cookie 和 Set-Cookie 的区别

Cookie 用于浏览器回传给服务器的请求头。Set-Cookie 用于服务器响应头，它会定义 Path、Max-Age、SameSite、Secure、HttpOnly 等属性。

## 获得更干净结果的提示

- 可以直接粘贴完整头部行，也可以只粘贴 cookie 键值对。
- 支持一次解析多条 Set-Cookie。
- 无效片段会单独列出，方便定位格式错误的键值对或属性。
