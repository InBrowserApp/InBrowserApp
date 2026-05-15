## Xác minh Argon2 là gì?

Xác minh Argon2 kiểm tra xem một mật khẩu dạng rõ có tạo ra cùng hash Argon2 đã mã hóa đã được lưu trước đó hay không. Hash đã mã hóa chứa biến thể Argon2, các tham số chi phí, salt và digest, nên trình xác minh có thể lặp lại cùng công việc mà không cần các thiết lập riêng.

## Khi nào nên dùng công cụ này

- Xác nhận rằng một mật khẩu đã sao chép và hash Argon2 đã lưu thuộc về nhau
- Gỡ lỗi các vấn đề đăng nhập hoặc di chuyển dữ liệu khi chuyển bản ghi mật khẩu giữa các hệ thống
- Kiểm tra biến thể và tham số chi phí bên trong một hash Argon2 đã mã hóa
- Kiểm thử các hash dùng secret phía máy chủ tùy chọn, thường được gọi là pepper

## Cách xác minh an toàn

1. Dán mật khẩu bạn muốn kiểm tra.
2. Dán hash đã mã hóa đầy đủ, chẳng hạn một chuỗi bắt đầu bằng `$argon2id$`.
3. Chỉ nhập secret nếu hash ban đầu được tạo với secret đó.
4. Chạy xác minh và đọc kết quả khớp, không khớp hoặc hash không hợp lệ.

## Ghi chú bảo mật

Việc xác minh diễn ra cục bộ trong trình duyệt của bạn, nhưng mật khẩu và hash đã dán vẫn có thể còn trong bộ nhớ trình duyệt cho đến khi bạn đặt lại biểu mẫu hoặc đóng thẻ. Tránh dùng thông tin đăng nhập sản xuất trên thiết bị dùng chung. Với các hệ thống lưu trữ mật khẩu mới, Argon2id thường là biến thể Argon2 được ưu tiên vì nó cân bằng khả năng chống kênh kề và GPU.
