## CityHash64 là gì?

CityHash64 là thuật toán băm phi mã hóa nhanh của Google, tạo ra giá trị 64-bit (8 byte). Thuật toán này hữu ích khi bạn cần dấu vân tay nhỏ gọn, xác định cho văn bản hoặc tệp và tốc độ quan trọng hơn bảo mật mật mã.

**Đặc điểm chính:**

- **Nhanh và xác định**: Cùng một đầu vào và seed luôn tạo ra cùng một hàm băm 64-bit
- **Phi mã hóa**: Không dùng CityHash64 cho mật khẩu, chữ ký, token hoặc kiểm tra toàn vẹn chống giả mạo
- **Hỗ trợ seed**: Để trống seed để dùng CityHash64 tiêu chuẩn, hoặc nhập seed dạng thập phân hay thập lục phân `0x` khi bạn cần một không gian băm có seed riêng
- **Xử lý cục bộ**: Văn bản và tệp được băm trong trình duyệt; tệp tải lên không được gửi tới máy chủ
- **Nhiều kiểu mã hóa**: Kết quả được hiển thị dưới dạng thập lục phân, Base64, thập phân và nhị phân

**Sử dụng phổ biến:**

- Bảng băm và cấu trúc dữ liệu
- Dấu vân tay tệp không dùng cho bảo mật
- Khử trùng lặp và phân nhóm dữ liệu
- Khóa cache và khóa phân mảnh
- Fixture hồi quy cho các hệ thống đã dùng CityHash64
- Lập chỉ mục cơ sở dữ liệu
