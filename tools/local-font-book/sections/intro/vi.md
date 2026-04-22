## Local Font Access là gì?

Local Font Access là API trình duyệt liệt kê các phông chữ cài trên thiết bị.

Công cụ này cho phép bạn tìm kiếm kết quả, so sánh các kiểu liên quan và sao chép đoạn CSS cho phông chữ đã chọn.

Chỉ hoạt động trong ngữ cảnh an toàn và trình duyệt hỗ trợ, cần quyền người dùng (local-fonts).

API trả về FontData với family, fullName, postscriptName và style.

### Điểm chính

- Dùng công cụ này để xác nhận chính xác tên cần dùng trong một stack CSS `font-family` trên thiết bị hiện tại.
- Lệnh gọi phải được kích hoạt bằng thao tác người dùng.
- Permissions Policy có thể chặn truy cập trên một số trang.
- Công cụ này chạy cục bộ và không tải phông chữ lên.
