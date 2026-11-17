## Công cụ này làm gì

Giải mã tiêu đề HTTP Basic Authorization để trích xuất tên người dùng và mật khẩu từ Base64. Hữu ích cho gỡ lỗi và kiểm thử API.

## Đầu vào được chấp nhận

Dán thứ gì đó như: Basic dXNlcjpwYXNz
Công cụ này cũng chấp nhận cả dòng `Authorization: Basic ...` đầy đủ.

## Ghi chú

- Base64 chỉ mã hóa thông tin đăng nhập, không bảo vệ thông tin đó.
- Trình giải mã tách tại dấu `:` đầu tiên và giữ phần còn lại trong mật khẩu.
- Mọi thứ chạy cục bộ trong trình duyệt của bạn.
