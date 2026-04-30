## JWK ↔ PEM 変換とは？

JWK（JSON Web Key）は JOSE/JWT で使われる JSON 形式の鍵表現です。RSA、EC、OKP の鍵を表せ、JWK Set（JWKS）としてまとめられることもあります。

PEM は Base64 でエンコードされた ASN.1/DER 鍵で、BEGIN PUBLIC KEY や BEGIN PRIVATE KEY のヘッダーを持ち、TLS、OpenSSL、さまざまな SDK で一般的です。

このツールは鍵を双方向に変換し、公鍵（SPKI）または秘密鍵（PKCS8）を選んでも鍵素材を保持します。対応形式には RSA、EC（P-256/384/521）、OKP 鍵コンテナーが含まれ、すべてブラウザー内で完結します。

ライブラリ、ゲートウェイ、CLI が OpenSSL 形式の鍵ファイルを期待する場合は JWK → PEM を選びます。鍵を JWKS に含めたい場合、JSON ベースの設定で受け渡したい場合、またはブラウザーや serverless 環境で使いたい場合は PEM → JWK を選びます。秘密鍵の変換では秘密情報も保持されるため、利用先に公開鍵だけで足りるなら公開鍵出力だけを共有してください。

- PEM しか受け付けないシステムで JWK/JWKS 鍵を使えます。
- JWT ライブラリや API ゲートウェイ向けに PEM 鍵を出力できます。
- 秘密鍵を公開せずに公開鍵を安全に共有できます。
