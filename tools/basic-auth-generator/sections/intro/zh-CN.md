## 什么是 Basic Auth？

Basic Auth 会先把 `username:password` 做 Base64 编码，再放进 `Authorization` 请求头里。它简单、兼容性强，但 Base64 只是编码，不是加密。

## 这个工具会生成什么

- 可直接粘贴到 API 客户端中的 `Authorization: Basic ...` 请求头。
- 一个可直接运行的 `curl` 示例，方便快速测试。
- 整个过程都在浏览器本地完成。

## 使用时要注意什么

- 发送 Basic Auth 凭证时务必使用 HTTPS。
- 任何拿到这个请求头的人都可以解码出原始用户名和密码。
- Basic Auth 适合内部工具、预发布环境和快速 API 调试。
