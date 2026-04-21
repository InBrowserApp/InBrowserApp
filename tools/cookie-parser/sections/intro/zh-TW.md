## 它能做什麼

這個工具會直接在瀏覽器中把原始 Cookie 和 Set-Cookie 標頭解析成結構化 JSON。你可以貼上單行標頭、多行標頭，或只貼上去掉前綴後的值。

## Cookie 與 Set-Cookie

Cookie 標頭通常包含多組由客戶端送出的名稱和值配對。Set-Cookie 標頭通常定義單一 Cookie，並附帶 Path、Secure、HttpOnly、SameSite、Expires 或 Max-Age 等屬性。

## 說明

解析過程完全在本機完成，不會把標頭上傳到伺服器。無效片段會另外列出，方便你快速找出格式有問題的 Cookie 字串。
