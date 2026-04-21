## 這個工具會解析什麼？

你可以貼上 Cookie 請求標頭，或一條到多條 Set-Cookie 回應標頭。解析器會把 Cookie 名稱、值與格式錯誤的片段整理成結構化 JSON，方便快速檢查。

## Cookie 和 Set-Cookie 的差別

Cookie 用於瀏覽器回傳給伺服器的請求標頭。Set-Cookie 用於伺服器回應標頭，會定義 Path、Max-Age、SameSite、Secure、HttpOnly 等屬性。

## 取得更乾淨結果的提示

- 可以直接貼上完整標頭行，也可以只貼上 cookie 鍵值對。
- 支援一次解析多條 Set-Cookie。
- 無效片段會單獨列出，方便找出格式錯誤的鍵值對或屬性。
