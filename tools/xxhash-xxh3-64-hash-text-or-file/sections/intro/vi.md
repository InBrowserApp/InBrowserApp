## xxHash (XXH3 64) là gì?

XXH3 là thuật toán xxHash hiện đại được thiết kế để có tốc độ rất cao và khả năng phân bố tốt. XXH3 64 tạo giá trị băm 64 bit (8 byte), thường được biểu diễn dưới dạng chuỗi thập lục phân dài 16 ký tự. Đây là hàm băm phi mật mã và hỗ trợ giá trị khởi tạo tùy chọn để có thể lặp lại kết quả băm.

**Đặc điểm chính:**

- **Cực nhanh**: Tối ưu hiệu năng cho đầu vào lớn
- **Tính xác định**: Cùng đầu vào và giá trị khởi tạo luôn tạo ra cùng mã băm
- **Phi mật mã**: Không phù hợp cho mục đích bảo mật
- **Phân bố tốt**: Rất phù hợp cho bảng băm và lập chỉ mục
- **Có giá trị khởi tạo**: Giá trị khởi tạo tùy chọn giúp đa dạng hóa đầu ra băm

**Ứng dụng phổ biến:**

- Bảng băm và cấu trúc dữ liệu
- Kiểm tra tính toàn vẹn tệp (không phục vụ bảo mật)
- Loại bỏ dữ liệu trùng lặp và chia khối
- Khóa bộ nhớ đệm và lập chỉ mục cơ sở dữ liệu
- Quy trình xử lý dữ liệu thông lượng cao
