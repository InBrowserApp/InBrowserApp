## 工具作用

解码 HTTP Basic Authorization 头，从 Base64 中提取用户名和密码。用于调试和 API 测试。

## 支持的输入

粘贴类似: Basic dXNlcjpwYXNz
这个工具也接受完整的 `Authorization: Basic ...` 请求头整行。

## 使用提示

- Base64 只是编码，不是加密。
- 解码时只按第一个 `:` 分割，后续内容都会保留在密码里。
- 全部处理都在你的浏览器本地完成。
