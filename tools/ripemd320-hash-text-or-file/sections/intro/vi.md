## RIPEMD-320 là gì?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) là một hàm băm mật mã tạo ra giá trị băm 320-bit (40-byte), thường được biểu diễn dưới dạng số thập lục phân dài 80 ký tự. Hàm này thuộc họ RIPEMD, được phát triển ở châu Âu như một lựa chọn thay thế cho MD4/MD5.

Dùng công cụ này khi bạn cần tính giá trị băm RIPEMD-320 cho văn bản đã dán, dữ liệu cấu hình đã sao chép hoặc một tệp cục bộ. Phép tính chạy trong trình duyệt của bạn, nên nội dung tệp không cần được tải lên máy chủ.

**Đặc điểm chính:**

- **Tất định**: Cùng một đầu vào luôn tạo ra cùng một giá trị băm
- **Tính toán nhanh**: Tính nhanh cho bất kỳ đầu vào nào
- **Hiệu ứng tuyết lở**: Thay đổi nhỏ trong đầu vào tạo ra đầu ra khác biệt rõ rệt
- **Kích thước đầu ra cố định**: Luôn tạo ra giá trị băm 320-bit bất kể kích thước đầu vào
- **Một chiều**: Về mặt tính toán, không khả thi để khôi phục đầu vào gốc từ giá trị băm

**Sử dụng phổ biến:**

- Kiểm tra tính toàn vẹn dữ liệu
- Tạo dấu vân tay dữ liệu và khử trùng lặp
- Tương thích với hệ thống cũ

**Ghi chú bảo mật:**

RIPEMD-320 chủ yếu hữu ích khi một giao thức, kho lưu trữ, danh sách checksum hoặc hệ thống cũ đã quy định sử dụng nó. Với các thiết kế mới nhạy cảm về bảo mật, hãy ưu tiên một hàm băm hiện được chuẩn hóa như SHA-256, SHA-512, SHA-3 hoặc BLAKE3, trừ khi cần tương thích với RIPEMD.
