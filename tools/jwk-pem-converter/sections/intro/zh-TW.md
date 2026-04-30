## 什麼是 JWK ↔ PEM 轉換？

JWK（JSON Web Key）是 JSON 形式的金鑰材料，常用於 JOSE/JWT、JWKS 端點，以及 serverless 或瀏覽器設定。它便於軟體讀取，但許多 CLI 和基礎設施仍較常要求金鑰檔案。

PEM 會用 BEGIN/END 標記包住 DER 金鑰資料，這是 OpenSSL、TLS 工具、API 閘道和許多 SDK 通常要求的格式。

此轉換器會在你的瀏覽器本機橋接這兩種格式。它支援 RSA、EC（P-256/384/521）和 OKP 金鑰容器；從 JWK 轉出時可選擇 public SPKI PEM 或 private PKCS8 PEM；也能把支援的 PEM 區塊轉回格式化或精簡的 JWK JSON。

如果只需要驗證或分發，請使用 public 輸出。private 轉換會在畫面和下載檔案中暴露私鑰材料，因此請把結果當作秘密處理，並在完成後關閉分頁。

- 在 JWKS/JSON 設定與 OpenSSL 風格 PEM 檔案之間移動金鑰。
- 分享給 JWT 驗證器、閘道或用戶端之前先擷取公鑰。
- 在本機完成轉換，不把金鑰材料上傳到伺服器。
