## Chuyển đổi JWK ↔ PEM là gì?

JWK (JSON Web Key) là định dạng JSON cho khóa mật mã dùng trong hệ thống JOSE/JWT. Nó có thể biểu diễn khóa RSA, EC hoặc OKP và có thể nằm trong JWK Set (JWKS).

PEM là khóa ASN.1/DER được mã hóa Base64 với các dòng tiêu đề như BEGIN PUBLIC KEY hoặc BEGIN PRIVATE KEY, phổ biến trong TLS, OpenSSL và nhiều SDK.

Công cụ này chuyển đổi khóa theo cả hai chiều, giữ nguyên vật liệu khóa khi chọn đầu ra công khai (SPKI) hoặc riêng tư (PKCS8). Hỗ trợ RSA, EC (P-256/384/521) và OKP (Ed25519/X25519/Ed448/X448), và mọi thứ chạy cục bộ trong trình duyệt.

Chọn JWK → PEM khi thư viện, gateway hoặc CLI cần tệp khóa theo kiểu OpenSSL. Chọn PEM → JWK khi bạn cần đưa khóa vào JWKS, truyền qua cấu hình dựa trên JSON, hoặc dùng trong môi trường trình duyệt hay serverless. Việc chuyển đổi khóa riêng tư vẫn giữ nguyên dữ liệu riêng, vì vậy hãy chỉ chia sẻ đầu ra công khai nếu như vậy là đủ.

- Dùng khóa JWK/JWKS với các hệ thống chỉ chấp nhận PEM.
- Xuất khóa PEM cho thư viện JWT, cổng API hoặc phân phối khóa.
- Chia sẻ khóa công khai an toàn mà không lộ dữ liệu khóa riêng.
