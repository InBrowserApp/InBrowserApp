## Cách chuyển địa chỉ MAC sang IPv6

Nhập địa chỉ MAC 48 bit với dấu hai chấm, dấu gạch nối, dấu chấm hoặc không có dấu phân cách. Thêm tiền tố mạng IPv6 `/64` bạn muốn dùng. Bạn có thể nhập tiền tố ở dạng rút gọn hoặc đầy đủ, miễn là các bit phần máy chủ đều bằng 0. Địa chỉ IPv6 cập nhật ngay khi bạn nhập và có thể sao chép. Nút **Thử ví dụ** điền giá trị mẫu vào cả hai ô.

## Cách EUI-64 sửa đổi tạo địa chỉ

Trong mạng con `/64`, tiền tố mạng chiếm 64 bit đầu và mã định danh giao diện chiếm 64 bit cuối. EUI-64 sửa đổi chèn `ff:fe` vào giữa hai nửa của địa chỉ MAC và đảo bit toàn cục/cục bộ (U/L) trong byte đầu tiên. Ví dụ, `00:11:22:33:44:55` trở thành mã định danh giao diện `211:22ff:fe33:4455`. Khi kết hợp với tiền tố `2001:db8:1:2::/64`, địa chỉ thu được là `2001:db8:1:2:211:22ff:fe33:4455`.

## Các tiền tố IPv6 thường dùng

- **Link-local.** Dùng `fe80::/64` để liên lạc trên cùng một liên kết mạng. Nút link-local điền tiền tố này và giữ nguyên địa chỉ MAC đã nhập. Để thêm tên giao diện như `%eth0`, hãy dùng [trình chuyển đổi sang IPv6 link-local](/vi/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Cục bộ duy nhất (ULA).** Nút ULA điền `fd12:3456:789a:1::/64`, một ví dụ từ dải `fd00::/8` dành cho mạng nội bộ. Để tạo tiền tố duy nhất cho mạng của bạn, hãy dùng [trình tạo ULA IPv6](/vi/tools/ipv6-ula-generator/).
- **Unicast toàn cầu.** Nhập một mạng con `/64` thuộc dải địa chỉ đã được nhà cung cấp Internet, nhà cung cấp dịch vụ đám mây hoặc quản trị viên mạng cấp cho bạn.
- **Tài liệu.** Tiền tố `2001:db8:1:2::/64` thuộc dải `2001:db8::/32` dành riêng cho tài liệu và ví dụ.

## Kết quả có trùng với địa chỉ IPv6 của thiết bị không?

Công cụ tạo địa chỉ từ tiền tố bạn nhập theo phương pháp EUI-64 sửa đổi. Thiết bị có thể dùng mã định danh giao diện khác, chẳng hạn như mã ổn định hoặc tạm thời được tạo để bảo vệ quyền riêng tư. Nếu bạn đã có địa chỉ IPv6 với mã định danh giao diện được tạo từ địa chỉ MAC, bạn có thể lấy lại địa chỉ MAC bằng [trình chuyển đổi IPv6 sang MAC](/vi/tools/ipv6-address-to-mac-address-converter/).
