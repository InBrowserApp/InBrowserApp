## RIPEMD-128 là gì?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) là một hàm băm mật mã tạo ra giá trị băm 128-bit (16-byte), thường được hiển thị dưới dạng số thập lục phân 32 ký tự. Đây là một phần của họ RIPEMD được phát triển ở châu Âu như một lựa chọn thay thế cho MD4/MD5.

**Đặc điểm chính:**

- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm
- **Tính toán nhanh**: Nhanh chóng tính toán cho bất kỳ đầu vào nào
- **Hiệu ứng tuyết lở**: Những thay đổi nhỏ trong đầu vào tạo ra đầu ra hoàn toàn khác biệt
- **Kích thước đầu ra cố định**: Luôn tạo ra băm 128-bit bất kể kích thước đầu vào
- **Một chiều**: Việc khôi phục đầu vào gốc từ băm là không khả thi về mặt tính toán

**Sử dụng phổ biến:**

- Kiểm tra tính toàn vẹn dữ liệu
- Dấu vân tay và khử trùng lặp
- Tương thích hệ thống cũ
