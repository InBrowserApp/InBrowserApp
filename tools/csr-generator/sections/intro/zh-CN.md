## 什么是 CSR？

证书签名请求（CSR）是一份小型 PKCS#10 文档，证书颁发机构（CA）需要它来签发 TLS 或代码签名证书。它将密钥对的公钥部分、您希望 CA 认证的身份信息（Subject），以及 DNS 名称或 IP 地址等附加标识符（Subject Alternative Names，即 SAN）打包在一起，并由对应的私钥签名。

本工具完全在浏览器中使用 Web Crypto API 和 [`@peculiar/x509`](https://github.com/PeculiarVentures/x509) 构建 CSR，您的密钥和请求信息不会发送到任何服务器。

## 适用场景

- 当公共 CA（Let's Encrypt、DigiCert、ZeroSSL、Sectigo 等）的申请流程要求您自行粘贴 CSR 时，使用本工具生成 TLS 证书请求。
- 为内部证书颁发机构（基于 ACME、smallstep、EJBCA、AD CS 等）生成 CSR，无需信任托管表单。
- 导入现有 PKCS#8 PEM 私钥并仅签署新的 CSR，以相同私钥重新签发证书。

## 表单填写说明

- **密钥来源** — 选择"生成新密钥"以创建新的密钥对，或选择"导入现有密钥"以粘贴未加密的 PKCS#8 PEM 私钥。不接受加密密钥、旧版 `RSA PRIVATE KEY` 及 `EC PRIVATE KEY` 块，请先使用 `openssl pkcs8 -topk8 -nocrypt` 进行转换。
- **算法** — RSA 兼容性最广，是默认选项。ECDSA 生成的签名更小，现代 CA 和 TLS 客户端均广泛支持。
- **Subject** — 大多数公共 CA 仅关注 Common Name，并以 DNS SAN 列表作为权威依据，但私有 CA 可能仍需要完整的 DN 信息。
- **SAN 条目** — 列出您希望证书覆盖的主机名、IP 地址、电子邮件地址或 URI，每行一个，或以逗号分隔。

## 注意事项

- CSR 旁显示的私钥在本地生成，绝不离开您的浏览器。请在关闭标签页前保存私钥——没有匹配的私钥，已签发的证书将无法使用。
- 公共 CA 要求 Common Name（或至少一个 SAN 条目）为可供其验证的 DNS 名称。IP 地址 SAN 主要适用于内部证书。
- 生成的私钥未经加密。如需在存储前添加密码保护，请使用 `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem`。
- 仅支持 RSA（2048/3072/4096）和 ECDSA（P-256/P-384/P-521）。EdDSA 因在浏览器和 CA 之间的兼容性尚不稳定，暂未纳入支持。
