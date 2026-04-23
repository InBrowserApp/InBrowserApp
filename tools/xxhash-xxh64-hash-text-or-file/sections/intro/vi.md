## xxHash (XXH64) là gì?

xxHash là một thuật toán băm phi mã hóa cực kỳ nhanh tập trung vào tốc độ và hiệu suất trong khi vẫn duy trì các đặc tính phân phối tốt. XXH64 là biến thể 64-bit tạo ra giá trị băm 64-bit (8-byte), thường được hiển thị dưới dạng số thập lục phân 16 ký tự.

**Đặc điểm chính:**

- **Cực kỳ nhanh**: Được tối ưu hóa cho tốc độ, nhanh hơn nhiều so với các hàm băm mã hóa
- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm
- **Phân phối tốt**: Cung cấp phân phối băm xuất sắc cho bảng băm
- **Phi mã hóa**: Không phù hợp cho mục đích bảo mật, được thiết kế cho hiệu suất
- **Đầu ra lớn hơn**: Băm 64-bit cung cấp khả năng chống va chạm tốt hơn so với các biến thể 32-bit
- **Tối ưu hóa nền tảng**: Sử dụng các lệnh SIMD khi có sẵn để đạt tốc độ tối đa

**Sử dụng phổ biến:**

- Bảng băm và cấu trúc dữ liệu
- Kiểm tra tính toàn vẹn tệp (không bảo mật)
- Khử trùng lặp dữ liệu
- Checksum cho truyền dữ liệu
- Ứng dụng quan trọng về hiệu suất
- Lập chỉ mục cơ sở dữ liệu
- Tạo khóa cache
