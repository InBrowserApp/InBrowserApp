## 什麼是 Basic Auth？

Basic Auth 會先將 `username:password` 做 Base64 編碼，再放進 `Authorization` 標頭中。它簡單且相容性高，但 Base64 只是編碼，不是加密。

## 這個工具會產生什麼

- 可直接貼到 API 用戶端中的 `Authorization: Basic ...` 標頭。
- 一段可直接執行的 `curl` 範例，方便快速測試。
- 全部處理都在瀏覽器本地完成。

## 使用時要注意什麼

- 傳送 Basic Auth 憑證時務必使用 HTTPS。
- 任何看到這個標頭的人都能解碼出原始的使用者名稱與密碼。
- Basic Auth 很適合內部工具、預備環境與快速 API 測試。
