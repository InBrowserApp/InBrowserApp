## 什么是 JWK ↔ PEM 转换？

JWK（JSON Web Key）是用于 JOSE/JWT 系统的 JSON 密钥格式。它可以表示 RSA、EC 或 OKP 密钥，也可以作为 JWK Set（JWKS）中的一项出现。

PEM 是用 Base64 编码的 ASN.1/DER 密钥，带有类似 BEGIN PUBLIC KEY 或 BEGIN PRIVATE KEY 的头部行，常见于 TLS、OpenSSL 和许多 SDK。

该工具可双向转换密钥，在选择公钥（SPKI）或私钥（PKCS8）输出时保持密钥材料不变。支持格式包括 RSA、EC（P-256/384/521）和 OKP 密钥容器，并且全部在浏览器本地完成。

当库、网关或 CLI 需要 OpenSSL 风格的密钥文件时，选择 JWK → PEM。当你需要把密钥放进 JWKS、通过 JSON 配置传递，或在浏览器和 serverless 运行时中使用时，选择 PEM → JWK。私钥转换会保留私钥材料，因此如果下游只需要公钥，请仅分享公钥输出。

- 将 JWK/JWKS 密钥用于只接受 PEM 的系统。
- 导出 PEM 供 JWT 库、API 网关或密钥分发使用。
- 安全分享公钥而不暴露私钥数据。
