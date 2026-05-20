## CSR là gì?

Certificate Signing Request (CSR) là một tài liệu PKCS#10 nhỏ mà cơ quan cấp chứng chỉ (CA) cần để phát hành chứng chỉ TLS hoặc chứng chỉ ký mã. Nó tập hợp nửa công khai của cặp khóa, danh tính bạn muốn CA xác nhận (Subject), cùng các định danh bổ sung như tên DNS hoặc địa chỉ IP (Subject Alternative Names, hay SAN), tất cả được ký bằng khóa riêng tư tương ứng.

Công cụ này xây dựng CSR hoàn toàn trong trình duyệt của bạn bằng Web Crypto API và [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Không có thông tin nào về khóa hay yêu cầu của bạn được gửi lên máy chủ.

## Khi nào nên dùng công cụ này

- Yêu cầu chứng chỉ TLS từ CA công cộng (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, v.v.) khi quy trình của họ yêu cầu bạn dán CSR của riêng mình.
- Tạo CSR cho cơ quan cấp chứng chỉ nội bộ — ACME, smallstep, EJBCA, AD CS — mà không cần tin tưởng vào biểu mẫu được lưu trữ bên ngoài.
- Tái cấp chứng chỉ với cùng khóa riêng tư bằng cách nhập khóa PKCS#8 PEM có sẵn và chỉ ký một CSR mới.

## Cách điền biểu mẫu

- **Nguồn khóa** — chọn _Tạo mới_ để tạo cặp khóa mới, hoặc _Nhập sẵn có_ để dán khóa PKCS#8 PEM không mã hóa. Không chấp nhận khóa đã mã hóa, `RSA PRIVATE KEY` kiểu cũ và khối `EC PRIVATE KEY`; hãy chuyển đổi chúng bằng `openssl pkcs8 -topk8 -nocrypt` trước.
- **Thuật toán** — RSA là lựa chọn có khả năng tương thích rộng nhất. ECDSA tạo ra chữ ký nhỏ hơn và được hỗ trợ rộng rãi bởi các CA và TLS client hiện đại.
- **Subject** — hầu hết CA công cộng bỏ qua mọi thứ trừ Common Name và xem danh sách DNS trong SAN là thông tin xác thực, nhưng CA nội bộ vẫn có thể cần đầy đủ DN.
- **Các mục SAN** — liệt kê tên máy chủ, địa chỉ IP, địa chỉ email hoặc URI mà bạn muốn chứng chỉ bao phủ. Mỗi dòng một mục hoặc phân cách bằng dấu phẩy.

## Những điều cần lưu ý

- Khóa riêng tư hiển thị cùng CSR được tạo cục bộ và không bao giờ rời khỏi trình duyệt của bạn. Hãy lưu nó trước khi đóng tab — không có khóa riêng tư tương ứng, chứng chỉ đã ký sẽ không sử dụng được.
- CA công cộng yêu cầu Common Name (hoặc ít nhất một mục SAN) phải là tên DNS mà họ có thể xác thực. SAN kiểu địa chỉ IP chủ yếu hữu ích cho chứng chỉ nội bộ.
- Khóa riêng tư được tạo ra không có mã hóa. Thêm cụm mật khẩu bằng `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` nếu cần trước khi lưu trữ.
- Chỉ hỗ trợ RSA (2048/3072/4096) và ECDSA (P-256/P-384/P-521). EdDSA bị bỏ qua có chủ đích vì mức độ chấp nhận trên các trình duyệt và CA vẫn chưa đồng nhất.
