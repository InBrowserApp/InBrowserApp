## 什麼是 Local Font Access？

Local Font Access 是瀏覽器 API，可列出裝置上安裝的字型。

這個工具可讓你搜尋結果、比較相關字重與字式，並為所選字型複製 CSS 片段。

僅在安全環境與支援的瀏覽器中可用，且需要使用者權限（local-fonts）。

API 回傳的 FontData 包含 family、fullName、postscriptName、style 等資訊。

### 重點說明

- 用它確認目前裝置上 CSS `font-family` 堆疊所需的準確名稱。
- 呼叫必須由使用者互動觸發。
- Permissions Policy 可能會阻擋存取。
- 本工具僅在本機運作，不會上傳字型。
