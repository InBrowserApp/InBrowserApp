## MD5 là gì?

MD5 (Message Digest Algorithm 5) là một hàm băm mật mã được sử dụng rộng rãi tạo ra giá trị băm 128-bit (16-byte), thường được hiển thị dưới dạng số thập lục phân 32 ký tự. Nó được thiết kế bởi Ron Rivest năm 1991 như người kế nhiệm MD4.

**Đặc điểm chính:**

- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm
- **Tính toán nhanh**: Nhanh chóng tính toán cho bất kỳ đầu vào nào
- **Hiệu ứng tuyết lở**: Những thay đổi nhỏ trong đầu vào tạo ra đầu ra hoàn toàn khác biệt
- **Kích thước đầu ra cố định**: Luôn tạo ra băm 128-bit bất kể kích thước đầu vào
- **Dễ bị va chạm**: Các lỗ hổng đã biết làm cho việc tìm ra va chạm trở nên khả thi

**Tình trạng bảo mật:**
⚠️ **MD5 đã bị phá vỡ về mặt mật mã và không nên được sử dụng cho các ứng dụng quan trọng về bảo mật**. Các cuộc tấn công va chạm được chứng minh vào năm 2004, và việc tạo ra va chạm thực tế trở nên khả thi với sức mạnh tính toán hiện đại.

**Sử dụng phổ biến (hiện tại và lịch sử):**

- Xác minh tính toàn vẹn tệp (không quan trọng về bảo mật)
- Checksum để phát hiện hỏng dữ liệu
- Hệ thống cũ yêu cầu MD5
- Tạo khóa cơ sở dữ liệu (không mật mã)
- Một số giao thức và hệ thống cũ hơn

**Các lựa chọn thay thế được đề xuất:**

- SHA-256 hoặc SHA-3 cho các ứng dụng mới
- SHA-512 cho yêu cầu bảo mật cao
- BLAKE2 cho các ứng dụng hiệu suất cao
