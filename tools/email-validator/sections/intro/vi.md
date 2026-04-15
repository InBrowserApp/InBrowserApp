## Xác thực email là gì?

Xác thực email kiểm tra xem một địa chỉ có tuân theo các quy tắc cú pháp phổ biến cho phần local, dấu `@`, nhãn miền và miền cấp cao nhất hay không. Công cụ này hữu ích khi kiểm thử biểu mẫu, làm sạch dữ liệu mẫu và phát hiện các lỗi gõ rõ ràng trước khi gửi.

### Trình xác thực này kiểm tra gì

- Một dấu `@` duy nhất để tách phần local và tên miền
- Giới hạn độ dài cho toàn bộ địa chỉ, phần local và tên miền
- Ký tự được phép, vị trí dấu chấm, quy tắc dấu gạch nối và cấu trúc TLD
- Kết quả chuẩn hóa với tên miền viết thường để tiện so sánh

### Ví dụ

- Hợp lệ: `name@example.com`
- Hợp lệ: `first.last+news@example.co.uk`
- Không hợp lệ: `name..dots@example.com`
- Không hợp lệ: `user@-example.com`

Tên miền quốc tế nên được nhập ở dạng Punycode ASCII, ví dụ `user@xn--bcher-kva.example`.

### Công cụ này không kiểm tra gì

- Hộp thư có thực sự tồn tại hoặc có thể nhận thư hay không
- Kiểm tra DNS, MX, SMTP hoặc nhà cung cấp email dùng một lần
- Liệu một website có chấp nhận địa chỉ đó theo quy tắc kinh doanh riêng hay không
