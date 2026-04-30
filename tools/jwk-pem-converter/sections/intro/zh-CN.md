## 什么是 JWK ↔ PEM 转换？

JWK（JSON Web Key）是 JSON 形式的密钥材料，常用于 JOSE/JWT、JWKS 端点，以及 serverless 或浏览器配置。它便于软件读取，但很多 CLI 和基础设施仍然更习惯接收密钥文件。

PEM 会用 BEGIN/END 标记包裹 DER 密钥数据，这是 OpenSSL、TLS 工具、API 网关和许多 SDK 通常要求的格式。

此转换器会在你的浏览器本地桥接这两种格式。它支持 RSA、EC（P-256/384/521）和 OKP 密钥容器；从 JWK 转出时可选择 public SPKI PEM 或 private PKCS8 PEM；也能把受支持的 PEM 块转回格式化或紧凑的 JWK JSON。

如果只需要验证或分发，请使用 public 输出。private 转换会在屏幕和下载文件中暴露私钥材料，因此请把结果当作密钥处理，并在完成后关闭标签页。

- 在 JWKS/JSON 配置与 OpenSSL 风格 PEM 文件之间迁移密钥。
- 在分享给 JWT 验证器、网关或客户端之前提取公钥。
- 在本地完成转换，不把密钥材料上传到服务器。
