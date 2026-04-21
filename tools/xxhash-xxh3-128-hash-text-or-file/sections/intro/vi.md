## xxHash (XXH3 128) là gì?

XXH3 là thuật toán xxHash hiện đại, được thiết kế để đạt tốc độ rất cao và khả năng phân phối giá trị rất tốt. XXH3 128 tạo ra giá trị hash 128 bit (16 byte), thường được hiển thị dưới dạng chuỗi thập lục phân 32 ký tự. Đây là hash không dùng cho mật mã và cũng hỗ trợ seed tùy chọn để tạo ra kết quả có thể lặp lại.

**Đặc điểm chính:**

- **Rất nhanh**: Được tối ưu cho hiệu năng cao với đầu vào lớn
- **Tất định**: Cùng một đầu vào và cùng một seed luôn cho ra cùng một hash
- **Không dùng cho mật mã**: Không phù hợp cho mục đích bảo mật
- **Phân phối tốt**: Hữu ích cho bảng băm và lập chỉ mục
- **Có seed**: Seed tùy chọn giúp phân biệt đầu ra hash

**Trường hợp sử dụng phổ biến:**

- Bảng băm và cấu trúc dữ liệu
- Kiểm tra toàn vẹn tệp (không phục vụ bảo mật)
- Khử trùng lặp dữ liệu và chia chunk
- Khóa bộ nhớ đệm và lập chỉ mục cơ sở dữ liệu
- Pipeline dữ liệu thông lượng cao
