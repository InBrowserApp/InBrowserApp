## Cách tạo địa chỉ IPv6

EUI-64 sửa đổi chèn `ff:fe` vào giữa hai nửa của địa chỉ MAC và đảo bit toàn cục/cục bộ (U/L) trong byte đầu tiên. Ví dụ, `00:11:22:33:44:55` trở thành mã định danh giao diện `211:22ff:fe33:4455`. Khi kết hợp với tiền tố `2001:db8:1:2::/64`, địa chỉ thu được là `2001:db8:1:2:211:22ff:fe33:4455`.

Nhập `fe80::/64` để tạo địa chỉ link-local. Để thêm tên giao diện mạng, hãy dùng [trình chuyển đổi sang IPv6 link-local](/vi/tools/mac-address-to-ipv6-link-local-address-converter/). Để tạo địa chỉ unicast có thể triển khai, hãy dùng tiền tố /64 được cấp cho mạng của bạn. Ví dụ trên dùng tiền tố dành cho tài liệu.
