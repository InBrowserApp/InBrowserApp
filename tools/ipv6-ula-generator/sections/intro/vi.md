## Tạo prefix /48 cho ULA IPv6

Sao chép prefix `fd` đã tạo để dùng cho mạng gia đình, mạng thử nghiệm hoặc VPN. Lưu prefix `/48` đã chọn cùng cấu hình mạng để dùng lại khi thêm mạng con. Chọn **Tạo prefix mới** khi cần một dải địa chỉ mới.

## Tính mạng con /64

Nhập **ID mạng con** ở dạng thập lục phân từ `0000` đến `ffff`. Ví dụ, ID `00a0` trong dải `fd12:3456:789a::/48` cho mạng con `fd12:3456:789a:a0::/64`. Một dải `/48` có 65.536 mạng con `/64`, đủ để gán prefix riêng cho các mạng như LAN, Wi-Fi khách hoặc VPN.

## Nguồn gốc của prefix fd

RFC 4193 định nghĩa địa chỉ cục bộ duy nhất trong dải `fc00::/7`. Nửa dải dành cho cấp phát cục bộ là `fd00::/8`, bắt đầu bằng `fd`. Công cụ dùng Web Crypto API của trình duyệt để tạo ID toàn cục ngẫu nhiên 40 bit và ghép vào prefix `/48`.

## Khi nào dùng địa chỉ cục bộ duy nhất

Dùng ULA để giữ địa chỉ IPv6 ổn định trong một mạng hoặc giữa các địa điểm nối qua VPN. Một thiết bị có thể dùng địa chỉ IPv6 toàn cục để truy cập Internet, đồng thời dùng ULA cho các dịch vụ nội bộ.
