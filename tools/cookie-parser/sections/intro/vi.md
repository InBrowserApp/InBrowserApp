## Công Cụ Này Làm Gì

Công cụ này phân tích các header Cookie và Set-Cookie thô thành JSON có cấu trúc ngay trong trình duyệt. Bạn có thể dán một dòng header, nhiều dòng hoặc chỉ các giá trị mà không cần các tiền tố thông thường.

## Cookie Vs. Set-Cookie

Header Cookie thường chứa nhiều cặp tên/giá trị do client gửi lên. Header Set-Cookie thường định nghĩa một cookie cùng với các thuộc tính như Path, Secure, HttpOnly, SameSite, Expires hoặc Max-Age.

## Ghi Chú

Trình phân tích chạy cục bộ và không tải header lên máy chủ. Các đoạn không hợp lệ được giữ trong danh sách riêng để bạn nhanh chóng phát hiện các chuỗi cookie bị sai định dạng.
