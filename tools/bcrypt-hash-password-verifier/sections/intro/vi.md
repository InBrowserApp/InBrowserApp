## Công cụ này làm gì

Xác minh xem một mật khẩu dạng văn bản thuần có khớp với mã băm mật khẩu bcrypt hay không. Điều này hữu ích khi bạn gỡ lỗi mã đăng nhập, kiểm tra bản ghi người dùng đã nhập, hoặc xác nhận rằng quá trình di chuyển mật khẩu vẫn giữ các mã băm tương thích.

## Dữ liệu đầu vào được chấp nhận

Dán một mã băm bcrypt chuẩn như `$2b$10$...` và nhập mật khẩu cần kiểm tra. Trình xác minh chấp nhận các tiền tố `$2a$`, `$2b$` và `$2y$` với giá trị cost từ `04` đến `31`.

## Đọc kết quả

Kết quả khớp nghĩa là bcrypt đã chấp nhận mật khẩu cho mã băm đó, bao gồm salt và cost được nhúng trong chuỗi mã băm. Kết quả không khớp nghĩa là mật khẩu không xác minh được; điều đó không chứng minh rằng bản thân mã băm là không an toàn. Lỗi mã băm không hợp lệ thường nghĩa là tiền tố, cost, độ dài hoặc các ký tự bcrypt base64 bị sai định dạng.

## Lưu ý về quyền riêng tư và bảo mật

- Quá trình xác minh chạy cục bộ trong trình duyệt của bạn.
- Mật khẩu và mã băm không được lưu trong bộ nhớ cục bộ.
- bcrypt được thiết kế để lưu trữ mật khẩu, không phải để làm checksum tệp đa dụng.
- Dùng công cụ này để gỡ lỗi và xác thực, không xem nó là cách kiểm toán duy nhất cho hệ thống xác thực production.
