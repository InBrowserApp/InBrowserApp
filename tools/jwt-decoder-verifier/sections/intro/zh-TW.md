## What is a JWT decoder and verifier?

JSON Web Token 是由三個 base64url 片段組成的緊湊字串：標頭、酬載和簽章。此工具會在你的瀏覽器中解碼標頭與酬載，讓你不必將 token 傳送到伺服器，就能檢查 token 結構。

簽章驗證會檢查 token 是否使用你預期的金鑰與演算法簽署。HS256、HS384 或 HS512 token 請使用共用密鑰。RS、PS 和 ES token 請使用 PEM 公開金鑰、JWK 或 JWKS。

## When to use it

在偵錯驗證流程、檢查 OAuth 或 OpenID Connect 宣告、比較不同環境，或確認後端是否簽發預期的受眾、簽發者、主體、到期時間與金鑰識別碼值時，請使用解碼器。

當你有相符的密鑰或公開金鑰，並需要確認標頭、酬載與簽章仍然彼此對應時，請使用驗證功能。此工具也會標示 `exp`、`nbf` 和 `iat`，讓常見的時鐘與過期問題能立即看見。

## Security notes

JWT 酬載只是經過編碼，並未加密。任何持有 token 的人都可以讀取其中的宣告，除非該 token 是另外加密的 JWE；此工具不會處理 JWE。

請勿在共用電腦上貼上正式環境 token 或私人密鑰。此工具會在你的瀏覽器本機執行，且不會儲存 token 或驗證材料，但最安全的流程仍是盡可能使用短效測試 token 與公開金鑰。
