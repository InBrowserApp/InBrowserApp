## SipHash-2-4 là gì?

SipHash-2-4 là hàm băm có khóa, tốc độ nhanh, được thiết kế cho thông điệp ngắn và bảo vệ bảng băm. Hàm này dùng một khóa bí mật 128-bit và tạo đầu ra 64-bit, thường được hiển thị dưới dạng giá trị thập lục phân 16 ký tự.

## Khi nào nên dùng

- Bảo vệ các bảng băm phía máy chủ khỏi tấn công hash-flooding khi khóa được giữ riêng tư.
- Tạo checksum có khóa và xác định cho khóa cache, sharding hoặc bảng tra cứu nội bộ.
- So sánh đoạn văn bản hoặc tệp với cùng một khóa khi không cần xác thực mật mã.

## Định dạng khóa

Nhập khóa dưới dạng đúng 16 byte dữ liệu thập lục phân, chẳng hạn như `0x000102030405060708090a0b0c0d0e0f`. Tiền tố `0x` là tùy chọn, và công cụ chấp nhận dấu cách, dấu hai chấm, dấu gạch nối và dấu gạch dưới để giúp đọc khóa dài dễ hơn.

## Ghi chú bảo mật

SipHash-2-4 không thay thế cho HMAC, chữ ký số hoặc băm mật khẩu. Hãy dùng nó cho quy trình bảng băm có khóa và checksum, không dùng để chứng minh tính xác thực giữa các hệ thống cần bảo đảm an toàn mật mã.
