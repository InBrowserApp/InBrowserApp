## HMAC là gì?

HMAC (Mã xác thực thông điệp dựa trên Hash) là một cơ chế mật mã kết hợp khóa bí mật với hàm băm để xác minh cả tính toàn vẹn dữ liệu và tính xác thực của tin nhắn.

**Cách hoạt động:**

1. Khóa bí mật được kết hợp với tin nhắn
2. Một hàm băm (như SHA-256) xử lý dữ liệu kết hợp
3. Kết quả là một mã xác thực có kích thước cố định

**Các trường hợp sử dụng phổ biến:**

- **Xác thực API**: Ký các yêu cầu API để xác minh người gửi
- **Token JWT**: Được sử dụng trong các thuật toán HS256/HS384/HS512
- **Xác minh Tin nhắn**: Đảm bảo dữ liệu không bị giả mạo
- **Chữ ký Webhook**: Xác thực payload webhook

**Lưu ý bảo mật:**

- Luôn sử dụng khóa bí mật mạnh và ngẫu nhiên
- Giữ khóa bí mật của bạn được bảo mật
- SHA-256 hoặc cao hơn được khuyến nghị cho các ứng dụng mới
- SHA-1 được coi là yếu và nên tránh sử dụng cho các mục đích bảo mật quan trọng
