## Địa chỉ IPv6 Link-Local là gì?

Địa chỉ IPv6 Link-Local là những địa chỉ IPv6 đặc biệt được tự động cấu hình trên mọi giao diện hỗ trợ IPv6. Chúng luôn bắt đầu bằng tiền tố fe80::/10 và được sử dụng để liên lạc giữa các thiết bị trên cùng một phân đoạn mạng. Những địa chỉ này không thể định tuyến vượt ra ngoài liên kết cục bộ và thường được sử dụng cho khám phá láng giềng, khám phá bộ định tuyến và các giao thức mạng cục bộ khác. Địa chỉ link-local có thể được tạo từ địa chỉ MAC của thiết bị sử dụng định dạng EUI-64.

### Định dạng đầu vào

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Đầu ra EUI-64

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Hậu tố giao diện

- `%eth0`
- `%en0`
- `%wlan0`
