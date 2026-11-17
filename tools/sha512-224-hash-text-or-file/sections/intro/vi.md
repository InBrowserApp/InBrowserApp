## SHA-512/224 (FIPS 180-4) là gì?

SHA-512/224 (FIPS 180-4) là hàm băm mật mã thuộc họ SHA-2, tạo bản tóm lược 224 bit (28 byte), thường được biểu diễn dưới dạng chuỗi thập lục phân dài 56 ký tự. Hàm này dựa trên SHA-512 với các giá trị khởi tạo khác và đầu ra được rút gọn, tạo bản tóm lược ngắn hơn trong khi giữ nguyên cấu trúc nội bộ của SHA-512.

**Đặc điểm chính:**

- **Tính xác định**: Cùng một đầu vào luôn tạo ra cùng một mã băm
- **Tính toán nhanh**: Tính toán nhanh cho bất kỳ đầu vào nào
- **Hiệu ứng thác lũ**: Thay đổi nhỏ ở đầu vào tạo ra đầu ra rất khác biệt
- **Không thể đảo ngược**: Việc đảo ngược mã băm để tìm đầu vào gốc không khả thi về mặt tính toán
- **Khả năng chống va chạm**: Rất khó tìm hai đầu vào khác nhau tạo ra cùng một mã băm

**Ứng dụng phổ biến:**

- Chữ ký số và chứng chỉ
- Kiểm tra tính toàn vẹn và tổng kiểm tra
- Xây dựng HMAC
- Xác minh tệp và quy trình xử lý dữ liệu
- Giao thức yêu cầu mã băm 224 bit
