## 工具作用

解碼 HTTP Basic Authorization 標頭，從 Base64 提取使用者名稱與密碼。用於除錯與 API 測試。

## 支援的輸入

貼上例如：Basic dXNlcjpwYXNz
這個工具也接受完整的 `Authorization: Basic ...` 標頭整行。

## 使用提示

- Base64 只是編碼，不是加密。
- 解碼時只會按第一個 `:` 分割，後續內容都會保留在密碼裡。
- 全部處理都會在你的瀏覽器本地完成。
