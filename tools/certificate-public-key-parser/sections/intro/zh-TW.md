## What is an X.509 certificate parser?

X.509 certificate 是一份已簽章的文件，會將 public key 綁定到網域、服務、組織或個人等身分。TLS certificates、certificate-chain 檔案，以及許多 S/MIME 或簽署流程都使用此格式。

此 parser 會直接在瀏覽器中讀取 certificate 與 public-key material。它可以檢查 PEM 區塊、二進位 DER 檔案與 base64 DER 文字，然後顯示 subject、issuer、serial number、validity window、signature algorithm、public-key algorithm、fingerprints 與常見 extensions。

當你需要比較 certificate fingerprint、檢查 certificate 是否對應預期主機、查看 Subject Alternative Names、確認 key usage，或在除錯 TLS 與部署問題時擷取 public-key details，可以使用這個工具。

此工具不會驗證 trust chains，也不會聯絡 certificate authorities。它只會顯示你提供的 certificate 或 public key 中編碼的內容；若需要 revocation、chain、hostname 或 live endpoint validation，請使用專用的 TLS scanner。

- 安裝或輪替 certificates 前，比對 SHA-256 或 SHA-1 fingerprints。
- 無需上傳 certificate material，即可檢視 SAN、key usage、extended key usage 與 basic constraints。
- 當服務只提供 public-key PEM 或 DER 檔案時，檢查獨立的 SPKI public keys。
