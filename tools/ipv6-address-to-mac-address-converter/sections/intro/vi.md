## Cách chuyển đổi IPv6 thành địa chỉ MAC

Bạn chỉ có thể khôi phục địa chỉ MAC từ địa chỉ IPv6 khi định danh giao diện
của IPv6 được suy ra từ chính địa chỉ MAC đó bằng phương pháp EUI-64. Điều này
thường gặp nhất ở các địa chỉ link-local cũ bắt đầu bằng `fe80::` và một số
địa chỉ tự động cấu hình không trạng thái.

### Khi nào cách này hoạt động

Phép chuyển đổi ngược này hoạt động khi 64 bit cuối của địa chỉ IPv6 vẫn còn
chứa định danh giao diện EUI-64.

- Định danh giao diện được tạo từ địa chỉ MAC 48 bit.
- Các byte ở giữa vẫn là `ff:fe`.
- Địa chỉ không được tạo bởi tiện ích mở rộng quyền riêng tư hoặc một cơ chế
  ngẫu nhiên hóa khác.

### Cách chuyển đổi hoạt động

Công cụ khôi phục địa chỉ MAC theo các bước sau:

1. Đọc 64 bit cuối của địa chỉ IPv6.
2. Loại bỏ các byte `ff:fe` được chèn vào giữa định danh giao diện.
3. Đảo bit universal/local trong byte đầu tiên.
4. Định dạng 48 bit còn lại thành địa chỉ MAC chuẩn.

### Vì sao không có kết quả

Bạn có thể không nhận được kết quả vì một số lý do:

- Cú pháp địa chỉ IPv6 không hợp lệ.
- Địa chỉ hợp lệ nhưng không được tạo từ MAC bằng EUI-64.
- Địa chỉ dùng quyền riêng tư, stable-random, DHCPv6 hoặc một cách cấp phát
  khác không dựa trên MAC.
