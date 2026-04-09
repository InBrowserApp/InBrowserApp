## 什麼是 OpenAPI 轉 TypeScript 轉換器？

OpenAPI 轉 TypeScript 轉換器會直接在瀏覽器中，將 OpenAPI 3.x 文件轉換為產生的 TypeScript 型別。當你需要快速預覽型別、可下載的宣告檔，或是在不把 schema 傳到伺服器的情況下安全測試 `openapi-typescript` 選項時，這個工具特別有用。

## 何時使用

當你已經有 JSON 或 YAML 格式的 OpenAPI schema，並想為前端應用程式、SDK 原型或 API 審查取得具型別的請求與回應模型時，可以使用這個工具。它特別適合在你把輸出提交到儲存庫之前，比較不同產生選項的差異。

## 產生前

這個瀏覽器重寫版支援已打包的 OpenAPI 3.0 與 3.1 文件。如果你的 schema 仍包含外部 `$ref` 目標，請先將它們合併或內嵌，然後再在這裡產生最終的 TypeScript 輸出。
