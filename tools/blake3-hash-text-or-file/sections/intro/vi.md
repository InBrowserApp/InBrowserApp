## BLAKE3 là gì?

BLAKE3 là hàm băm mật mã hiện đại được dẫn xuất từ BLAKE2. Nó được thiết kế để đạt hiệu năng rất cao và hỗ trợ song song trong khi vẫn duy trì mức độ bảo mật mạnh. Nó tạo băm 256 bit theo mặc định và hỗ trợ độ dài đầu ra có thể mở rộng (XOF).

**Đặc điểm chính:**

- **Độ dài đầu ra có thể mở rộng**: Có thể tạo băm với bất kỳ độ dài nào
- **Hiệu suất cao**: Nhanh và có thể song song hóa trên CPU hiện đại
- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm
- **Hiệu ứng tuyết lở**: Thay đổi nhỏ trong đầu vào tạo ra đầu ra rất khác biệt
- **Không thể đảo ngược**: Về mặt tính toán, không thể đảo ngược băm để tìm đầu vào gốc
- **Chống va chạm**: Rất khó tìm hai đầu vào khác nhau tạo ra cùng một băm
- **Băm có khóa**: Hỗ trợ khóa tùy chọn 32 byte cho chức năng MAC
- **Dẫn xuất khóa**: Có thể dẫn xuất khóa con từ vật liệu khóa và ngữ cảnh

**Sử dụng phổ biến:**

- Xác minh tính toàn vẹn tệp
- Lưu trữ theo địa chỉ nội dung và khử trùng lặp
- Chữ ký số và chứng chỉ
- Lưu trữ và xác thực mật khẩu
- Giao thức và hệ thống mật mã
