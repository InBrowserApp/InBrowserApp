## 什麼是 CSR？

憑證簽章請求（Certificate Signing Request，CSR）是一份小型的 PKCS#10 文件，憑證機構（CA）需要此文件才能簽發 TLS 或程式碼簽署憑證。它將金鑰對的公開部分、您希望 CA 驗證的身份資訊（Subject）以及其他識別資訊（如 DNS 名稱或 IP 位址，即 Subject Alternative Names，或稱 SAN）打包在一起，並由對應的私鑰簽署。

本工具完全在您的瀏覽器中使用 Web Crypto API 與 [`@peculiar/x509`](https://github.com/PeculiarVentures/x509) 建立 CSR。您的金鑰與請求內容均不會傳送至任何伺服器。

## 使用時機

- 向公開 CA（Let's Encrypt、DigiCert、ZeroSSL、Sectigo 等）申請 TLS 憑證時，若其流程要求您自行貼入 CSR，即可使用本工具。
- 為內部憑證機構（基於 ACME、smallstep、EJBCA、AD CS 等）產生 CSR，而無需信任外部託管表單。
- 匯入現有的 PKCS#8 PEM 私鑰，以相同的私鑰簽署新的 CSR，藉此重新簽發憑證。

## 如何填寫表單

- **金鑰來源** — 選擇「產生新金鑰」以建立全新金鑰對，或選擇「匯入現有金鑰」以貼入未加密的 PKCS#8 PEM 私鑰。加密金鑰、舊式 `RSA PRIVATE KEY` 及 `EC PRIVATE KEY` 區塊均不被接受；請先使用 `openssl pkcs8 -topk8 -nocrypt` 進行轉換。
- **演算法** — RSA 相容性最廣泛，為預設選項。ECDSA 可產生較小的簽章，且受現代 CA 與 TLS 客戶端廣泛支援。
- **Subject** — 大多數公開 CA 僅關注 Common Name，並以 DNS SAN 清單作為權威依據；但私有 CA 可能仍需要完整的 DN。
- **SAN 項目** — 列出您希望憑證涵蓋的主機名稱、IP 位址、電子郵件地址或 URI，每行一筆或以逗號分隔。

## 注意事項

- CSR 旁顯示的私鑰在本機產生，不會離開您的瀏覽器。請在關閉分頁前將其儲存——若遺失對應的私鑰，已簽發的憑證將無法使用。
- 公開 CA 要求 Common Name（或至少一筆 SAN 項目）必須是可供其驗證的 DNS 名稱。IP 位址 SAN 主要適用於內部憑證。
- 產生的私鑰為未加密格式。若有需要，請在儲存前使用 `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` 新增密碼保護。
- 僅支援 RSA（2048/3072/4096）及 ECDSA（P-256/P-384/P-521）。EdDSA 因在各瀏覽器與 CA 之間的支援仍不一致，目前不予支援。
