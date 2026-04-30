## Chuyển đổi JWK ↔ PEM là gì?

JWK (JSON Web Key) là dữ liệu khóa ở dạng JSON được dùng bởi JOSE/JWT, endpoint JWKS và cấu hình serverless hoặc trình duyệt. Phần mềm đọc định dạng này dễ dàng, nhưng CLI và hạ tầng mong đợi tệp khóa thường ít chấp nhận hơn.

PEM bọc dữ liệu khóa DER bằng nhãn BEGIN/END, đây là định dạng mà OpenSSL, công cụ TLS, API gateway và nhiều SDK thường yêu cầu.

Trình chuyển đổi này nối hai định dạng ngay trong trình duyệt của bạn. Nó xử lý các container khóa RSA, EC (P-256/384/521) và OKP, cho phép chọn PEM công khai SPKI hoặc PEM riêng tư PKCS8 khi bắt đầu từ JWK, và có thể đổi các khối PEM được hỗ trợ trở lại JWK JSON đẹp hoặc gọn.

Dùng đầu ra công khai khi bạn chỉ cần xác minh hoặc phân phối. Chuyển đổi riêng tư hiển thị dữ liệu khóa riêng trên màn hình và trong tệp tải xuống, vì vậy hãy coi kết quả như bí mật và đóng tab khi hoàn tất.

- Di chuyển khóa giữa cấu hình JWKS/JSON và tệp PEM kiểu OpenSSL.
- Trích xuất khóa công khai trước khi chia sẻ với bộ xác minh JWT, gateway hoặc client.
- Chuyển đổi cục bộ mà không tải dữ liệu khóa lên máy chủ.
