## Công cụ này làm gì

Công cụ này kết hợp các khối CIDR thành tập tương đương nhỏ nhất, rồi trừ mọi khối CIDR bạn đặt trong danh sách loại trừ. Công cụ hỗ trợ IPv4 và IPv6 trong cùng một lần chạy, và toàn bộ quá trình xử lý diễn ra cục bộ trong trình duyệt của bạn.

## Cách gộp và loại trừ hoạt động

Danh sách gộp được chuẩn hóa trước: các bit host được xóa, các mạng chồng lấp được gộp lại với nhau, và các mạng liền kề được thu gọn khi chúng có thể được biểu diễn bằng một khối CIDR ngắn hơn. Sau đó, danh sách loại trừ được trừ khỏi các dải đã gộp. Đầu ra cuối cùng được mở rộng trở lại thành danh sách CIDR tối giản bao phủ chính xác phần còn lại.

## Khi nào nên dùng

Dùng công cụ này khi dọn dẹp quy tắc tường lửa, chuẩn bị mục nhập nhóm bảo mật đám mây, rà soát danh sách cho phép VPN, tóm tắt bảng định tuyến, hoặc loại bỏ các dải dành riêng khỏi một vùng cấp phát lớn hơn. Công cụ đặc biệt hữu ích khi cấu hình được sao chép có các khối chồng lấp hoặc khi một mạng rộng cần loại bỏ một vài dải nhỏ hơn.

## Ghi chú đầu vào

Nhập mỗi dòng một CIDR, hoặc phân tách nhiều CIDR bằng dấu phẩy. Có thể dán chung các khối IPv4 và IPv6, nhưng phần loại trừ chỉ áp dụng cho các khối cùng họ địa chỉ. Các mục không hợp lệ được báo kèm danh sách và số dòng để bạn có thể sửa các đầu vào lớn đã dán mà không phải đoán.
