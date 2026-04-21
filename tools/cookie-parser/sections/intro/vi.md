## Công cụ này phân tích gì?

Dán header Cookie của request hoặc một hay nhiều dòng Set-Cookie của response. Trình phân tích sẽ tách tên cookie, giá trị và các đoạn lỗi thành JSON có cấu trúc để bạn kiểm tra nhanh.

## Cookie và Set-Cookie khác nhau thế nào?

Dùng Cookie cho header mà trình duyệt gửi lại máy chủ. Dùng Set-Cookie cho các header phản hồi xác định những thuộc tính như Path, Max-Age, SameSite, Secure hoặc HttpOnly.

## Mẹo để có kết quả gọn hơn

- Bạn có thể dán cả dòng header hoặc chỉ các cặp cookie thô.
- Hỗ trợ nhiều dòng Set-Cookie.
- Các đoạn không hợp lệ được liệt kê riêng để dễ phát hiện cặp hoặc thuộc tính bị lỗi.
