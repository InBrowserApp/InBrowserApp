## 什么是 JWT 解码器和验证器？

JSON Web Token 是一种紧凑字符串，包含三个 base64url 片段：标头、载荷和签名。此工具会在你的浏览器中解码标头和载荷，让你无需将 token 发送到服务器即可检查 token 结构。

签名验证会检查 token 是否使用你预期的密钥和算法签名。对于 HS256、HS384 或 HS512 token，请使用共享密钥。对于 RS、PS 和 ES token，请使用 PEM 公钥、JWK 或 JWKS。

## 何时使用

在调试身份验证流程、检查 OAuth 或 OpenID Connect 声明、比较不同环境，或确认后端是否签发了预期的 audience、issuer、subject、expiration 和 key identifier 值时，可以使用解码器。

当你拥有匹配的密钥或公钥，并需要确认标头、载荷和签名仍然属于同一个 token 时，请使用验证功能。该工具还会突出显示 `exp`、`nbf` 和 `iat`，让常见的时钟和过期问题立即可见。

## 安全说明

JWT 载荷只是编码，并非加密。任何持有 token 的人都可以读取其中的声明，除非该 token 是单独加密的 JWE，而此工具不会处理 JWE。

不要在共享机器上粘贴生产 token 或私有密钥。该工具在你的浏览器中本地运行，并且不会存储 token 或验证材料，但最安全的工作流仍然是尽可能使用短期有效的测试 token 和公钥。
