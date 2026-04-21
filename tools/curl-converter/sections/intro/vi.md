## Trình chuyển đổi cURL là gì?

Trình chuyển đổi cURL biến một lệnh cURL thành đoạn mã sẵn sàng sử dụng cho nhiều ngôn ngữ và client HTTP. Nó hữu ích khi tài liệu API, công cụ dành cho nhà phát triển trong trình duyệt hoặc lịch sử terminal đã cho bạn một request đang hoạt động và bạn muốn đưa nó vào mã ứng dụng mà không phải dựng lại method, URL, header, cookie hay body bằng tay.

**Ghi công**
Được hỗ trợ bởi [curlconverter](https://curlconverter.com) của Nick Carneiro.

## Khi nào công cụ này hữu ích

- Khi bạn bắt đầu từ một ví dụ cURL đang hoạt động trong tài liệu API hoặc lịch sử terminal.
- Khi bạn muốn so sánh cùng một request giữa `fetch`, Python `requests`, Go, Java, PHP và các target khác trước khi chọn.
- Khi bạn muốn tạo nhanh một bản nền rồi thêm xử lý lỗi, retry, làm mới xác thực và cấu hình của riêng dự án.

## Cần kiểm tra gì sau khi chuyển đổi

- Hãy bảo đảm target đã chọn khớp với thư viện HTTP và runtime mà dự án của bạn thực sự dùng.
- Đọc kỹ các cảnh báo. Một số quy tắc trích dẫn của shell, biến môi trường hoặc cờ cURL chưa được hỗ trợ có thể cần chỉnh tay.
- Thay các token mẫu, bí mật hoặc URL ví dụ trước khi commit đoạn mã đã tạo.
