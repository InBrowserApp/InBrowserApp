## Công cụ này chuẩn hóa những gì

Công cụ này chuyển địa chỉ IPv4, địa chỉ IPv6 và dải CIDR sang ký hiệu chuẩn ngay trong trình duyệt. Nó loại bỏ phần đệm IPv4 không cần thiết, rút gọn IPv6 về dạng rút gọn chuẩn và giữ nguyên họ địa chỉ ban đầu.

## Chuẩn hóa CIDR hoạt động như thế nào

Khi bạn nhập một khối CIDR, công cụ sẽ viết lại địa chỉ thành địa chỉ mạng thực sự của tiền tố đó. Các bit host sẽ bị xóa, vì vậy `192.168.0.15/24` trở thành `192.168.0.0/24`, còn `2001:db8::1234/64` trở thành `2001:db8::/64`.

## Khi nào điều này hữu ích

Hãy dùng công cụ này trước khi so sánh quy tắc tường lửa, ACL, bảng định tuyến, danh sách cho phép VPN hoặc tệp cấu hình đã nhập. Dữ liệu đầu vào đã chuẩn hóa giúp việc phát hiện trùng lặp, rà soát và sao chép vào công cụ mạng đáng tin cậy hơn.

## Tại sao dữ liệu đầu vào có thể bị từ chối

Công cụ từ chối các địa chỉ IPv4 hoặc IPv6 sai định dạng, tiền tố CIDR không hợp lệ và các tổ hợp địa chỉ hoặc tiền tố không khớp với họ giao thức. Nếu giá trị không thể được phân tích một cách rõ ràng, từ chối nó sẽ an toàn hơn là chuẩn hóa nhầm mạng.
