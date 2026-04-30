CIDR Parser biến một khối như `10.24.8.19/21` hoặc `2001:db8:abcd::123/64` thành mạng mà bạn thật sự muốn dùng. Nó chuẩn hóa input có địa chỉ host, hiển thị subnet canonical và chỉ ra các ranh giới thường cần khi viết rule firewall, ghi tài liệu dải địa chỉ hoặc kiểm tra một allocation có quá lớn hay không.

## Công cụ hiển thị gì

Kết quả bắt đầu bằng phần tổng quan nhanh, sau đó tách khối thành các chi tiết thực tế: CIDR canonical, số lượng địa chỉ tổng và usable, điểm bắt đầu và kết thúc dải, cùng các giá trị integer của khối. Với IPv4, bạn còn có netmask, wildcard mask và địa chỉ broadcast. Với IPv6, parser giữ cùng workflow nhưng ẩn những field không áp dụng.

## Vì sao canonicalization quan trọng

Nhiều giá trị CIDR được dán vào có chứa host bits. Điều đó dễ hiểu với con người, nhưng router, ACLs và tài liệu thường cần địa chỉ mạng canonical. Việc viết lại khối trước khi copy giúp phát hiện giả định off-by-one trước khi chúng lọt vào config.

## Ghi chú thực tế

- Các khối IPv4 `/31` và `/32` được xem là dùng được toàn bộ, phù hợp với cách dùng point-to-point và host-route hiện đại.
- Các khối IPv6 báo cáo toàn bộ không gian địa chỉ và dải usable mà không tự tạo khái niệm broadcast.
- Mọi thứ chạy cục bộ trong trình duyệt, nên subnet nội bộ không rời khỏi trang trong lúc bạn kiểm tra.
