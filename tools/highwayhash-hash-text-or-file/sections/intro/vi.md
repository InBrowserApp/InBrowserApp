## HighwayHash là gì?

HighwayHash là hàm băm có khóa tốc độ cao do Google thiết kế cho việc tạo fingerprint thông lượng lớn và kiểm tra toàn vẹn. Hàm này dùng khóa 256-bit và có thể tạo đầu ra 64-bit, 128-bit hoặc 256-bit từ cùng một đầu vào văn bản hoặc tệp.

## Khi nào nên dùng

- Tạo checksum có khóa và xác định cho khóa cache, ID đối tượng, sharding hoặc bảng tra cứu nội bộ.
- So sánh tệp hoặc nội dung văn bản với cùng một khóa khi tốc độ quan trọng hơn khả năng tương thích mật mã rộng.
- Tạo fingerprint 128-bit hoặc 256-bit khi cần giá trị băm không dùng cho mật khẩu nhưng lớn hơn cho quy trình toàn vẹn dữ liệu.

## Tùy chọn khóa và đầu ra

Nhập khóa dưới dạng đúng 32 byte dữ liệu thập lục phân, chẳng hạn như `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Tiền tố `0x` là tùy chọn, và công cụ chấp nhận dấu cách, dấu hai chấm, dấu gạch nối và dấu gạch dưới để giúp đọc khóa dài dễ hơn. Để trống khóa sẽ dùng khóa mặc định của thư viện, tiện cho kiểm tra nhanh nhưng không nên xem là bí mật.

## Ghi chú bảo mật

HighwayHash không thay thế cho HMAC, chữ ký số hoặc băm mật khẩu. Hãy dùng nó cho fingerprint có khóa tốc độ cao và quy trình checksum, không dùng để chứng minh tính xác thực giữa các hệ thống cần xác minh mật mã theo chuẩn.
