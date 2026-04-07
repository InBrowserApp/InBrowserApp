## Xác thực JSON Schema là gì?

Sử dụng công cụ này khi bạn muốn có phản hồi nhanh trong khi thiết kế payload, gỡ lỗi các ví dụ API hoặc kiểm tra xem một thay đổi lược đồ có làm hỏng dữ liệu mẫu hay không. Mọi thứ chạy cục bộ trong trình duyệt, vì vậy JSON thô không bao giờ rời khỏi trang.

## Nơi nó phù hợp

- Xem xét các payload ví dụ trong tài liệu API.
- Xác thực dữ liệu mô phỏng trong quá trình làm frontend.
- Kiểm tra các trường nhạy cảm về định dạng như `uuid`, `email` hoặc `date-time`.

## Những gì nó không thay thế

- Ủy quyền phía máy chủ và quy tắc nghiệp vụ.
- Kiểm tra hợp đồng phụ thuộc vào tham chiếu từ xa hoặc trạng thái ứng dụng.
- Xác thực CI đầy đủ cho toàn bộ tập lược đồ của bạn.
