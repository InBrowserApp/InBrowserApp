## Basic Auth là gì?

Basic Auth đưa `username:password` vào tiêu đề `Authorization` sau khi mã hóa bằng Base64. Cách này đơn giản và được hỗ trợ rộng rãi, nhưng Base64 chỉ là mã hóa biểu diễn chứ không phải mã hóa bảo mật.

## Công cụ này tạo ra gì

- Một tiêu đề `Authorization: Basic ...` để dán vào client API.
- Một ví dụ `curl` sẵn sàng chạy để thử nhanh.
- Mọi thứ đều chạy cục bộ trong trình duyệt.

## Điều cần lưu ý

- Luôn dùng HTTPS khi gửi thông tin Basic Auth.
- Bất kỳ ai nhìn thấy tiêu đề này đều có thể giải mã lại tên người dùng và mật khẩu gốc.
- Basic Auth phù hợp cho công cụ nội bộ, môi trường staging và kiểm tra API nhanh.
