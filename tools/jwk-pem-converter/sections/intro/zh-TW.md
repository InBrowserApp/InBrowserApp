## 什麼是 JWK ↔ PEM 轉換？

JWK（JSON Web Key）是用於 JOSE/JWT 系統的 JSON 金鑰格式。它可以表示 RSA、EC 或 OKP 金鑰，也可能出現在 JWK Set（JWKS）中。

PEM 是以 Base64 編碼的 ASN.1/DER 金鑰，帶有像 BEGIN PUBLIC KEY 或 BEGIN PRIVATE KEY 的標頭行，常見於 TLS、OpenSSL 與許多 SDK。

此工具可雙向轉換金鑰，在選擇公鑰（SPKI）或私鑰（PKCS8）輸出時保留金鑰材料。支援 RSA、EC（P-256/384/521）與 OKP（Ed25519/X25519/Ed448/X448），並全程在瀏覽器本機完成。

當程式庫、閘道或 CLI 需要 OpenSSL 風格的金鑰檔時，選擇 JWK → PEM。當你需要把金鑰放進 JWKS、透過 JSON 設定傳遞，或在瀏覽器與 serverless 執行環境中使用時，選擇 PEM → JWK。私鑰轉換會保留私鑰材料，因此如果下游只需要公鑰，請只分享公鑰輸出。

- 讓 JWK/JWKS 金鑰可用於只接受 PEM 的系統。
- 匯出 PEM 供 JWT 函式庫、API 閘道或金鑰發佈使用。
- 安全分享公鑰而不暴露私鑰資料。
