## MurmurHash3 (x86 128-bit) là gì?

MurmurHash3 là thuật toán băm phi mật mã nhanh, được thiết kế để tạo mã kiểm tra
có thể lặp lại và phân phối đều. Biến thể x86 128-bit trả về giá trị 16 byte,
thường được hiển thị dưới dạng 32 ký tự thập lục phân, nên phù hợp hơn các hàm
băm 32-bit khi bạn cần một mã định danh rộng hơn cho các tập lớn gồm bản ghi,
tệp hoặc khóa bộ nhớ đệm.

**Hữu ích trong các trường hợp:**

- **Bảng băm và phân mảnh**: Tạo khóa ổn định cho các nhóm, phân vùng hoặc
  bảng tra cứu.
- **Khử trùng lặp**: So sánh các tập văn bản hoặc tệp lớn bằng dấu vân tay
  128-bit nhỏ gọn trước khi kiểm tra sâu hơn.
- **Khóa bộ nhớ đệm**: Tạo mã định danh xác định cho đầu ra bản dựng, dữ liệu
  đã biến đổi hoặc nội dung được tạo.
- **Kiểm tra tính toàn vẹn phi bảo mật**: Phát hiện thay đổi ngoài ý muốn trong
  quá trình lưu trữ hoặc truyền khi không cần bảo đảm mật mã.

**Cách seed hoạt động:**

Giá trị seed không bắt buộc là một giá trị không dấu 32-bit. Dùng cùng seed khi
bạn cần kết quả khớp với hệ thống khác, và để là `0` khi bạn không có yêu cầu
tương thích cụ thể. Công cụ chấp nhận giá trị thập phân và giá trị thập lục phân
dạng `0x`; các giá trị lớn hơn sẽ được quy về cùng phạm vi 32-bit mà thuật toán
sử dụng.

**Lưu ý an toàn:**

MurmurHash3 không phải là thuật toán băm mật khẩu, ký hoặc xác minh chống giả
mạo. Hãy dùng SHA-256, HMAC hoặc công cụ băm mật khẩu khi đầu ra cần thuộc tính
bảo mật. Công cụ này phù hợp nhất cho việc băm cục bộ, ngoại tuyến, hướng tới
hiệu năng, nơi tốc độ và phân phối ổn định quan trọng hơn khả năng chống tấn
công.
