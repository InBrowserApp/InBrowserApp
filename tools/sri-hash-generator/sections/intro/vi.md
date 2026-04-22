## Tính Toàn Vẹn Tài Nguyên Phụ (SRI) là gì?

Tính Toàn Vẹn Tài Nguyên Phụ (SRI) là một tính năng bảo mật cho phép trình duyệt xác minh rằng các tệp họ tải về (ví dụ: từ CDN) không bị thay đổi ngoài ý muốn. Nó hoạt động bằng cách so sánh hash mật mã của tài nguyên với hash được cung cấp trong HTML.

**Cách hoạt động:**

1. Tạo hash mật mã của tệp tài nguyên của bạn
2. Bao gồm hash trong thuộc tính integrity của thẻ script hoặc link
3. Trình duyệt tải tài nguyên và tính toán hash của nó
4. Trình duyệt so sánh hash được tính toán với hash được cung cấp
5. Nếu hash khớp, tài nguyên được tải; nếu không, việc tải bị chặn

**Lợi ích:**

- **Bảo mật**: Bảo vệ chống lại các thay đổi độc hại của tài nguyên bên thứ ba
- **Bảo vệ CDN**: Đảm bảo các tệp được phục vụ bởi CDN không bị giả mạo
- **Bảo mật chuỗi cung ứng**: Xác thực tính toàn vẹn của các phụ thuộc bên ngoài
- **Hỗ trợ trình duyệt**: Được hỗ trợ rộng rãi trên các trình duyệt hiện đại

**Thuật toán được hỗ trợ:**

- SHA-256 (tối thiểu được khuyến nghị)
- SHA-384 (được khuyến nghị)
- SHA-512 (bảo mật cao nhất)
