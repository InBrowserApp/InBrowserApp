## Tổng quan

JSON Diff Path so sánh hai tài liệu JSON và biến mọi thay đổi cấu trúc thành bản ghi đường dẫn dễ đọc, đồng thời xuất cả JSONPath lẫn JSON Pointer.

## Khi Nào Dùng

Dùng khi bạn cần xem xét thay đổi trong payload API, kiểm tra các lần di chuyển cấu hình, hoặc tạo các thao tác RFC 6902 JSON Patch để tự động hóa.

## Cách Hoạt Động

Công cụ phân tích cả hai đầu vào JSON, tính các thay đổi `add`, `remove` và `replace`, rồi cho phép bạn lọc các thao tác đó và chuyển đổi giữa danh sách đường dẫn với đầu ra JSON Patch ngay trong cùng một bảng kết quả.
